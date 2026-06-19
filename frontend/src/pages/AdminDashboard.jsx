import { useState, useEffect } from 'react';
import { ACCESS_TOKEN } from '../constants';
import LoadingIndicator from '../components/LoadingIndicator';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        // Fetch bookings
        const bookingsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/bookings/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Fetch clients
        const clientsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/clients/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (bookingsRes.ok && clientsRes.ok) {
          const bookingsData = await bookingsRes.json();
          const clientsData = await clientsRes.json();
          setBookings(bookingsData);
          setClients(clientsData);
        } else if (bookingsRes.status === 403 || clientsRes.status === 403) {
          // Not admin → redirect
          alert('Admin access required');
          window.location.href = '/client_index';
        } else {
          throw new Error('Failed to load data');
        }
      } catch (err) {
        setError('Network error');
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
        alert('Client deleted');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete client');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Clients Table */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Clients ({clients.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Username</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Joined</th>
                <th className="px-4 py-2 border">Last Login</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{client.username}</td>
                  <td className="px-4 py-2 border">
                    {client.first_name} {client.last_name}
                  </td>
                  <td className="px-4 py-2 border">{client.email}</td>
                  <td className="px-4 py-2 border">
                    {new Date(client.date_joined).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {client.last_login ? new Date(client.last_login).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="text-red-600 hover:text-red-900"
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

      {/* Bookings Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Bookings ({bookings.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Client</th>
                <th className="px-4 py-2 border">Booking</th>
                <th className="px-4 py-2 border">Service</th>
                <th className="px-4 py-2 border">Date & Time</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Booked At</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{booking.client_username}</td>
                  <td className="px-4 py-2 border">{booking.booking_title}</td>
                  <td className="px-4 py-2 border">{booking.service_type}</td>
                  <td className="px-4 py-2 border">
                    {new Date(booking.date).toLocaleDateString()} at {booking.time}
                  </td>
                  <td className="px-4 py-2 border">{booking.session_type}</td>
                  <td className="px-4 py-2 border">
                    {new Date(booking.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;