// src/components/DStats.jsx
import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../../../constants";

const DStats = () => {
  const [total_bookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingCount();
  }, []);

  const fetchBookingCount = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/booking/count/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTotalBookings(data.total_bookings || 0);
      } else if (res.status === 401) {
        localStorage.removeItem(ACCESS_TOKEN);
        window.location.href = "/login";
      } else {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch booking count");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Network error. Please try again.");
      setTotalBookings(0); // fallback
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-20">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{total_bookings}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
        <div className="flex items-center">
          <div className="p-3 bg-orange-100 rounded-full">
            <svg className="w-8 h-8 text-orange-600" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#BD4C31">
              <path d="M120-80v-800l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v800l-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60Zm120-200h480v-80H240v80Zm0-160h480v-80H240v80Zm0-160h480v-80H240v80Zm-40 404h560v-568H200v568Zm0-568v568-568Z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Pending Invoices</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DStats;