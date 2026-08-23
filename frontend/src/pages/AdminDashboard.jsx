import { useState, useEffect } from 'react';
import { ACCESS_TOKEN } from '../constants';
import SkeletonLoader from '../components/SkeletonLoader';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chefs = [
    'Chef Alex Salal',
    'Chef Marcus Vance',
    'Chef Elena Rostova',
    'Chef David Chen',
  ];

  const statuses = ['New', 'Assigned', 'Resolved'];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const bookingsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/bookings/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const clientsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/clients/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (bookingsRes.ok && clientsRes.ok) {
          const bookingsData = await bookingsRes.json();
          const clientsData = await clientsRes.json();
          setBookings(bookingsData);
          setClients(clientsData);
        } else if (bookingsRes.status === 403 || clientsRes.status === 403) {
          alert('Admin access required');
          window.location.href = '/client_index';
        } else {
          throw new Error('Failed to load admin data');
        }
      } catch (err) {
        setError('Network error or insufficient permissions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteClient = async (userId) => {
    if (!window.confirm('Delete this client and all their bookings?')) return;

    const token = localStorage.getItem(ACCESS_TOKEN);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/clients/${userId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setClients(clients.filter(client => client.id !== userId));
        setBookings(bookings.filter(booking => booking.client_id !== userId));
        alert('Client deleted successfully');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete client');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleUpdateBooking = async (bookingId, updatedFields) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/bookings/${bookingId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedFields)
      });

      if (res.ok) {
        const data = await res.json();
        setBookings(bookings.map(b => b.id === bookingId ? { ...b, ...updatedFields } : b));
      } else {
        alert('Failed to update consultation request');
      }
    } catch (err) {
      console.error(err);
      alert('Network error during update');
    }
  };

  if (loading) return <SkeletonLoader.Section />;
  if (error) return <div className="min-h-screen bg-cream flex items-center justify-center p-6 text-terracotta text-xl">{error}</div>;

  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-sage-200 pb-6">
          <div>
            <span className="inline-block px-3 py-1 bg-brass text-charcoal text-xs font-bold rounded-full tracking-tighter mb-2">
              Admin Portal
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-charcoal tracking-tight">
              Executive Management & Consultation Control
            </h1>
          </div>
          <button
            onClick={() => window.location.href = '/client_index'}
            className="px-4 py-2 bg-charcoal text-cream text-sm rounded-lg hover:bg-brass hover:text-charcoal transition-colors"
          >
            Client Dashboard
          </button>
        </div>

        {/* User Activity & Logging Monitor */}
        <div className="mb-12 bg-white rounded-2xl p-6 shadow-sm border border-sage-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-display font-bold text-charcoal">
              User Activity & Directory ({clients.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sage-200">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-charcoal uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-sage-100">
                {clients.map(client => (
                  <tr key={client.id} className="hover:bg-cream/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-charcoal">{client.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sage">
                      {client.first_name} {client.last_name || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sage">{client.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${
                        client.active_status === 'Active now' ? 'bg-green-100 text-green-800' :
                        client.active_status?.includes('Active') ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {client.active_status || 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sage">
                      {new Date(client.date_joined).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sage">
                      {client.last_login ? new Date(client.last_login).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-terracotta hover:text-charcoal transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Meeting & Consultation Request Manager */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-display font-bold text-charcoal">
              Consultation Requests & Chef Coordination ({bookings.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sage-200">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider">Client & Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider">Request / Requirements</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider">Service & Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider">Assigned Chef</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-charcoal uppercase tracking-wider">Coordinate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-sage-100">
                {bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-cream/50 transition-colors align-top">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-semibold text-charcoal">{booking.client_username}</div>
                      <div className="text-xs text-sage">{booking.client_email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm max-w-xs">
                      <div className="font-medium text-charcoal">{booking.booking_title}</div>
                      <div className="text-xs text-sage mt-1 italic">{booking.notes || 'No specific notes provided.'}</div>
                      <div className="text-xs text-brass mt-1">
                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sage">
                      <div>{booking.service_type}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-cream text-charcoal rounded text-xs font-medium">
                        {booking.session_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={booking.assigned_chef || ''}
                        onChange={(e) => handleUpdateBooking(booking.id, { assigned_chef: e.target.value })}
                        className="px-3 py-1.5 border border-sage-300 rounded-lg text-sm bg-cream text-charcoal focus:ring-2 focus:ring-brass"
                      >
                        <option value="">-- Unassigned --</option>
                        {chefs.map(chef => (
                          <option key={chef} value={chef}>{chef}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={booking.status || 'New'}
                        onChange={(e) => handleUpdateBooking(booking.id, { status: e.target.value })}
                        className={`px-3 py-1.5 border rounded-lg text-sm font-medium ${
                          booking.status === 'Resolved' ? 'bg-green-50 border-green-300 text-green-800' :
                          booking.status === 'Assigned' ? 'bg-blue-50 border-blue-300 text-blue-800' :
                          'bg-amber-50 border-amber-300 text-amber-800'
                        }`}
                      >
                        {statuses.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a
                        href={`mailto:${booking.client_email}?subject=Salal Culinary Consultation: ${booking.booking_title}&body=Hello ${booking.client_username},%0D%0A%0D%0ARegarding your consultation request for "${booking.booking_title}" (${booking.service_type}):%0D%0A%0D%0A`}
                        className="px-3 py-1.5 bg-brass text-charcoal rounded-lg hover:bg-terracotta hover:text-cream transition-colors inline-block text-xs font-semibold"
                      >
                        Email Client
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
