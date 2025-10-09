import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../../../../constants";
import LoadingIndicator from "../../../../components/LoadingIndicator";
import { toast } from "react-hot-toast";

const BookingList = () => {
  const [deleteBookingId, setDeleteBookingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [booking, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/booking/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else if (res.status === 401) {
        localStorage.removeItem(ACCESS_TOKEN);
        navigate("/login");
      } else {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (bookingId) => {
    setDeleteBookingId(bookingId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDeleteBookingId(null);
  };

  const handleDeleteBooking = async () => {
    if (!deleteBookingId) return;

    const token = localStorage.getItem(ACCESS_TOKEN);
    const apiUrl = import.meta.env.VITE_API_URL;
    const endpoint = `${apiUrl}/api/booking/${deleteBookingId}/`;
    try {
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setBookings(booking.filter(b => b.id !== deleteBookingId));
        toast.success("Booking cancelled successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to cancel booking.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
      console.error("Delete error:", err);
    } finally {
      handleCloseModal();
    }
  };

  if (loading) return <LoadingIndicator />;
  if (booking.length === 0) {
    return (
      <div className="text-center py-12 bg-muted rounded-lg">
        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-700">No bookings yet</h3>
        <p className="mt-2 text-gray-500">You haven’t booked any consultations yet.</p>
        <button
          onClick={() => navigate("/booking")}
          className="mt-4 px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition"
        >
          Book a Consultation
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-foreground mb-6">Your Bookings</h2>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {booking.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.service_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })} at {booking.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.duration} min
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    booking.session_type === 'video' ? 'bg-blue-100 text-blue-800' :
                    booking.session_type === 'in-person' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {booking.session_type === 'video' ? 'Video' :
                     booking.session_type === 'in-person' ? 'In-Person' : 'Phone'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleOpenDeleteModal(booking.id)}
                    className="text-red-600 hover:text-red-900 transition"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">Cancel Booking</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Keep Booking
              </button>
              <button
                onClick={handleDeleteBooking}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingList;