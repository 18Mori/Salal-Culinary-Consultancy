import React, { useState, useEffect } from 'react';
import AdminNavigation from './components/AdminNavigation';
import MobileDrawer from '../../components/MobileDrawer';
import Loader from '../../components/Loader';
import { ACCESS_TOKEN } from '../../constants';

// --- Activity Helper Calculations ---
const ACTIVE_THRESHOLD_MS = 120 * 1000; // 120 seconds (2 minutes) activity window - matches backend

const formatTimeAgo = (diffMs) => {
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Active just now';
  if (minutes < 60) return `Active ${minutes}m ago`;
  if (hours < 24) return `Active ${hours}h ago`;
  if (days === 1) return 'Active yesterday';
  return `Active ${days}d ago`;
};

const calculateUserStatus = (activeStatus, lastLogin, lastSeen) => {
  // 1. Explicit dynamic status string sent directly by backend endpoint
  // Only "Active now" (exact match) counts as currently active
  if (activeStatus === 'Active now') {
    return {
      label: 'Active Now',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotClass: 'bg-emerald-500 animate-pulse'
    };
  }

  // Historical statuses (e.g., "Active 5m ago", "Active 3d ago") are NOT active now
  if (activeStatus && activeStatus.startsWith('Active') && activeStatus !== 'Active now') {
    return {
      label: activeStatus,
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      dotClass: 'bg-blue-500'
    };
  }

  if (activeStatus === 'Inactive') {
    return {
      label: 'Inactive',
      badgeClass: 'bg-gray-100 text-gray-600 border-gray-300',
      dotClass: 'bg-gray-400'
    };
  }

  // 2. Client-side evaluation using last_seen or last_login timestamps
  // Fallback for missing/malformed timestamp data
  const timestampToEvaluate = lastSeen || lastLogin;
  if (!timestampToEvaluate) {
    return {
      label: 'Never Logged In',
      badgeClass: 'bg-gray-100 text-gray-600 border-gray-300',
      dotClass: 'bg-gray-400'
    };
  }

  const timeMs = new Date(timestampToEvaluate).getTime();
  if (isNaN(timeMs)) {
    return {
      label: 'Invalid Timestamp',
      badgeClass: 'bg-gray-100 text-gray-600 border-gray-300',
      dotClass: 'bg-gray-400'
    };
  }

  const diffMs = Date.now() - timeMs;
  const isOnline = diffMs >= 0 && diffMs <= ACTIVE_THRESHOLD_MS;

  return {
    label: isOnline ? 'Active Now' : formatTimeAgo(diffMs),
    badgeClass: isOnline 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
      : 'bg-slate-100 text-slate-600 border-slate-200',
    dotClass: isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
  };
};

const UserStatusBadge = ({ activeStatus, lastLogin, lastSeen }) => {
  const [status, setStatus] = useState(() => calculateUserStatus(activeStatus, lastLogin, lastSeen));

  useEffect(() => {
    setStatus(calculateUserStatus(activeStatus, lastLogin, lastSeen));
    const interval = setInterval(() => {
      setStatus(calculateUserStatus(activeStatus, lastLogin, lastSeen));
    }, 10000); // Recalculate badge display every 10 seconds
    return () => clearInterval(interval);
  }, [activeStatus, lastLogin, lastSeen]);

  return (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${status.badgeClass}`}>
      <span className={`w-2 h-2 mr-2 rounded-full ${status.dotClass}`} />
      <span>{status.label}</span>
    </div>
  );
};

// --- SVG Dynamic Line Graph Component ---
const ActivityChart = ({ bookings }) => {
  const getMonthlyCounts = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const last6Months = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6Months.push({
        name: months[d.getMonth()],
        month: d.getMonth(),
        year: d.getFullYear(),
        count: 0
      });
    }

    bookings.forEach(b => {
      const bDate = new Date(b.date || b.created_at);
      if (!isNaN(bDate.getTime())) {
        const match = last6Months.find(m => m.month === bDate.getMonth() && m.year === bDate.getFullYear());
        if (match) match.count += 1;
      }
    });

    return last6Months;
  };

  const monthlyData = getMonthlyCounts();
  const maxCount = Math.max(...monthlyData.map(m => m.count), 1);

  const points = monthlyData.map((d, idx) => {
    const x = idx * 60 + 20;
    const y = 150 - (d.count / maxCount) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Booking & Activity Trends</h2>
          <p className="text-xs text-gray-500">Real consultation request volume over the last 6 months</p>
        </div>
        <span className="text-xs font-semibold px-2 py-1 bg-brass/10 text-brass rounded-md">
          Total: {bookings.length}
        </span>
      </div>
      <div className="relative w-full h-44">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 320 160">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1E293B" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={`M 20 150 L ${points} L 320 150 Z`} fill="url(#chartGradient)" />
          <polyline fill="none" stroke="#1E293B" strokeWidth="3" points={points} />
          {monthlyData.map((d, idx) => {
            const x = idx * 60 + 20;
            const y = 150 - (d.count / maxCount) * 100;
            return (
              <circle key={idx} cx={x} cy={y} r="4" className="fill-brass stroke-white stroke-2" />
            );
          })}
        </svg>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
        {monthlyData.map((m, idx) => (
          <span key={idx}>{m.name}</span>
        ))}
      </div>
    </div>
  );
};

// --- Main Admin Dashboard Component ---
const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const chefs = [
    'Chef Alex Salal',
    'Chef Marcus Vance',
    'Chef Elena Rostova',
    'Chef David Chen',
  ];

  const statuses = ['New', 'Assigned', 'Resolved'];

  // Explicitly defined fetcher function for Client Directory
  const fetchClientDirectory = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN) || localStorage.getItem('access');
    if (!token) return;

    const rawUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const baseUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

    try {
      const res = await fetch(`${baseUrl}/api/admin/clients/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      console.error('Failed to fetch client directory:', err);
    }
  };

  useEffect(() => {
    const initialFetch = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN) || localStorage.getItem('access');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const rawUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const baseUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

      try {
        const bookingsRes = await fetch(`${baseUrl}/api/admin/bookings/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        await fetchClientDirectory();

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(Array.isArray(bookingsData) ? bookingsData : bookingsData.results || []);
        } else if (bookingsRes.status === 403) {
          setShowUnauthorizedModal(true);
        } else {
          throw new Error('Failed to load admin bookings data');
        }
      } catch (err) {
        setError('Network error or insufficient permissions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initialFetch();

    // Setup periodic polling every 10 seconds for real-time user directory status updates
    const pollInterval = setInterval(() => {
      fetchClientDirectory();
    }, 10000);

    return () => clearInterval(pollInterval);
  }, []);

  const handleDeleteClient = async (userId) => {
    const token = localStorage.getItem(ACCESS_TOKEN) || localStorage.getItem('access');
    const rawUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const baseUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

    try {
      const res = await fetch(`${baseUrl}/api/admin/clients/${userId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setClients(clients.filter(client => client.id !== userId));
        setBookings(bookings.filter(booking => booking.client_id !== userId));
        setActionMessage('Client deleted successfully');
      } else {
        const data = await res.json();
        setActionMessage(data.error || 'Failed to delete client');
      }
    } catch (err) {
      console.error(err);
      setActionMessage('Network error');
    }
  };

  const handleUpdateBooking = async (bookingId, updatedFields) => {
    const token = localStorage.getItem(ACCESS_TOKEN) || localStorage.getItem('access');
    const rawUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const baseUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

    try {
      const res = await fetch(`${baseUrl}/api/admin/bookings/${bookingId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedFields)
      });

      if (res.ok) {
        setBookings(bookings.map(b => b.id === bookingId ? { ...b, ...updatedFields } : b));
        setActionMessage('Consultation updated successfully');
      } else {
        setActionMessage('Failed to update consultation request');
      }
    } catch (err) {
      console.error(err);
      setActionMessage('Network error during update');
    }
  };

  const handleRedirectLogin = () => {
    window.location.href = '/login';
  };

  // Evaluate count of active users currently logged in / active in window
  // Only count users with exact "Active Now" status (120-second threshold or explicit "Active now" from backend)
  const activeClientsCount = clients.filter(c => {
    const statusObj = calculateUserStatus(c.active_status, c.last_login, c.last_seen);
    return statusObj.label === 'Active Now';
  }).length;

  const assignedChefsCount = new Set(bookings.map(b => b.assigned_chef).filter(Boolean)).size;

  if (loading) return <Loader.Section />;
  if (error) return <div className="min-h-screen bg-background flex items-center justify-center p-6 text-terracotta text-xl">{error}</div>;

  return (
    <div className="min-h-screen bg-background overflow-x-auto">
      <div className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:hidden">
        <div className="h-14 flex items-center justify-between">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg text-slate-300 hover:text-amber-400 transition-all lg:hidden"
            aria-label="Open mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="hidden lg:flex">
        <AdminNavigation onToggleCollapse={setIsCollapsed} />
      </div>

      {/* Unauthorized Access Pop-up Modal */}
      {showUnauthorizedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 bg-terracotta/10 text-terracotta rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              !
            </div>
            <h3 className="text-2xl font-bold text-charcoal mb-2 font-heading">
              Access Restricted
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              You are not authorized to view this page. Administrative privileges are required to access executive controls.
            </p>
            <button
              onClick={handleRedirectLogin}
              className="w-full py-3 px-4 bg-charcoal text-white font-semibold rounded-xl hover:bg-black transition-colors shadow-md"
            >
              Go to Login Page
            </button>
          </div>
        </div>
      )}

      <main 
        className={`p-6 transition-all duration-300 ease-out ${
          isCollapsed ? 'w-full ml-0' : 'w-full lg:w-[calc(100%-15rem)] ml-0 lg:ml-64'
        }`}
      >
        <div className="container mx-auto space-y-8">

          {/* Action Alert Banner */}
          {actionMessage && (
            <div className="p-4 bg-brass/10 border border-brass/30 text-charcoal rounded-xl flex justify-between items-center text-sm font-medium">
              <span>{actionMessage}</span>
              <button onClick={() => setActionMessage(null)} className="font-bold text-xs underline">
                Dismiss
              </button>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-heading">Admin Operations & Control</h1>
              <p className="text-sm text-gray-500">Manage client bookings, chef assignments, and user activity</p>
            </div>
          </div>

          {/* Key Metric Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase">Total Client(s)</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{clients.length}</h3>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase">Consultation(s)</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{bookings.length}</h3>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase">Assigned Chef(s)</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{assignedChefsCount}</h3>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase">Active Session(s)</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{activeClientsCount}</h3>
            </div>
          </div>

          {/* Analytics Chart & Coordination Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActivityChart bookings={bookings} />
            </div>

            {/* Chef Coordination Box */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Chef Coordination</h2>
                <p className="text-xs text-gray-500 mb-4">Available culinary roster for consultation assignments</p>

                <div className="space-y-3">
                  {chefs.map((chef, idx) => {
                    const assignedCount = bookings.filter(b => b.assigned_chef === chef).length;
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{chef}</p>
                          <p className="text-xs text-gray-500">
                            {assignedCount > 0 ? `${assignedCount} Active Assignment((s))` : 'Available'}
                          </p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                          assignedCount > 0 
                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {assignedCount > 0 ? 'Assigned' : 'Ready'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Requests Table */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Consultation Requests & Chef Coordination ({bookings.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                    <th className="px-6 py-4 truncate">Client & Contact</th>
                    <th className="px-6 py-4 truncate">Request / Requirements</th>
                    <th className="px-6 py-4 truncate">Service & Type</th>
                    <th className="px-6 py-4 truncate">Assigned Chef</th>
                    <th className="px-6 py-4 truncate">Status</th>
                    <th className="px-6 py-4 text-right truncate">Coordinate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50/50 align-top transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{booking.client_username || 'Anonymous'}</div>
                          <div className="text-xs text-gray-500">{booking.client_email || 'No email'}</div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div className="font-medium text-gray-900 truncate">{booking.booking_title || 'Consultation Request'}</div>
                          <div className="text-xs text-gray-500 truncate mt-1 italic">{booking.notes || 'No specific notes provided.'}</div>
                          {booking.date && (
                            <div className="text-xs text-brass font-medium mt-1">
                              {new Date(booking.date).toLocaleDateString()} {booking.time ? `at ${booking.time}` : ''}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="truncate">{booking.service_type || 'General Consultation'}</div>
                          {booking.session_type && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                              {booking.session_type}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={booking.assigned_chef || ''}
                            onChange={(e) => handleUpdateBooking(booking.id, { assigned_chef: e.target.value })}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-800 focus:ring-2 focus:ring-brass focus:outline-none"
                          >
                            <option value="">-- Unassigned --</option>
                            {chefs.map(chef => (
                              <option key={chef} value={chef}>{chef}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={booking.status || 'New'}
                            onChange={(e) => handleUpdateBooking(booking.id, { status: e.target.value })}
                            className={`px-3 py-1.5 border rounded-lg text-xs font-medium focus:outline-none ${
                              booking.status === 'Resolved' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                              booking.status === 'Assigned' ? 'bg-blue-50 border-blue-300 text-blue-800' :
                              'bg-amber-50 border-amber-300 text-amber-800'
                            }`}
                          >
                            {statuses.map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {booking.client_email ? (
                            <a
                              href={`mailto:${booking.client_email}?subject=Salal Culinary Consultation: ${booking.booking_title || 'Request'}&body=Hello ${booking.client_username || 'Client'},%0D%0A%0D%0ARegarding your consultation request for "${booking.booking_title || 'Service'}" (${booking.service_type || 'Consultation'}):%0D%0A%0D%0A`}
                              className="px-3 py-1.5 bg-charcoal text-white rounded-lg hover:bg-black transition-colors inline-block text-xs text-center font-semibold"
                            >
                              Email Client
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No contact info</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500 text-sm">
                        No consultation requests found in system database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Activity & Directory Table */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">User Activity & Directory ({clients.length})</h2>
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Auto Syncing (10s)
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Username</th>
                    <th className="px-6 py-4">Full Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Active Status</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4">Last Activity</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clients.length > 0 ? (
                    clients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                        <td className="px-6 py-4 font-medium text-gray-900">{client.username}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {client.first_name || client.last_name
                            ? `${client.first_name || ''} ${client.last_name || ''}`.trim()
                            : '—'}
                        </td>
                        <td className="px-6 py-4 text-gray-600 truncate">{client.email || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <UserStatusBadge 
                            activeStatus={client.active_status} 
                            lastLogin={client.last_login} 
                            lastSeen={client.last_seen}
                          />
                        </td>
                        <td className="px-6 py-4 text-gray-500 truncate">
                          {client.date_joined ? new Date(client.date_joined).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-gray-500 truncate">
                          {client.last_seen 
                            ? new Date(client.last_seen).toLocaleString() 
                            : client.last_login 
                            ? new Date(client.last_login).toLocaleString() 
                            : 'Never'}
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          <button
                            onClick={() => handleDeleteClient(client.id)}
                            className="text-terracotta hover:text-red-700 transition-colors text-xs font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500 text-sm">
                        No registered clients returned from backend API.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
      {drawerOpen && <MobileDrawer isOpen={drawerOpen} onToggle={() => setDrawerOpen(false)} userRole="admin" />}
    </div>
  );
};

export default AdminDashboard;