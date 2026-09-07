import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../../../../constants";
import Loader from "../../../../components/Loader";
import { toast } from "react-hot-toast";

const BookingList = ({ refreshKey, onOpenBooking }) => {
  const [deleteBookingId, setDeleteBookingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [booking, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, [refreshKey]);

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

  if (loading) return <Loader.Section />;
  if (booking.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 border border-slate-100 rounded-2xl p-8">
        <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto text-amber-600 mb-4 shadow-sm">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Consultations Scheduled Yet</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">Book your first culinary strategy, menu review, or kitchen operations consultation today.</p>
        <button
          onClick={onOpenBooking}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-amber-500/20 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Schedule New Consultation</span>
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Your Scheduled Consultations</h2>
          <p className="text-xs text-slate-500">Track and manage your upcoming culinary advisory sessions</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
          {booking.length} {booking.length === 1 ? 'Session' : 'Sessions'}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Title</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Service</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Date & Time</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Duration</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Format</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {booking.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                  {b.title}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                    {b.service_type}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600">
                  <div className="font-medium text-slate-800">
                    {new Date(b.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="text-xs text-slate-400">{b.time}</div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600">
                  {b.duration_minutes || b.duration || 60} min
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600">
                  <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-lg ${
                    b.session_type === 'video' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    b.session_type === 'in-person' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>
                    {b.session_type === 'video' ? 'Video' :
                     b.session_type === 'in-person' ? 'In-Person' : 'Phone'}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-right">
                  <button
                    onClick={() => handleOpenDeleteModal(b.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Cancel</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 transform transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Cancel Consultation</h3>
                  <p className="text-xs text-slate-500">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              Are you sure you want to cancel this booking? Our culinary consultants will be notified of the slot release.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 transition"
              >
                Keep Booking
              </button>
              <button
                onClick={handleDeleteBooking}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl shadow-sm transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingList;