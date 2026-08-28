import { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../../../../constants";
import DNavigation from "../DNavigation";
import BookingForm from "../../../../components/BookingForm";
import BookingList from "./BookingList";
import Loader from "../../../../components/Loader";


function Booking() {
  const [logout, setLogout] = useState(false);
  const [loading, setLoading] = useState(false);

  // Track sidebar collapse state to apply responsive layout margin
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (logout) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('sidebarCollapsed');
      window.location.href = "/login";
    }
  }, [logout]);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-background">
      <DNavigation onToggleCollapse={setIsCollapsed} setLogout={setLogout} />
      <main 
        className="transition-all duration-300 ease-out"
        style={{ marginLeft: isCollapsed ? '4rem' : '15rem' }}
      >
        <DashboardContent loading={loading} />
      </main>
    </div>
    </>
  );
}

function DashboardContent({ loading }) {
  if (loading) {
    return <Loader.Section />;
  }
  return (
    <div className="container">
      <BookingForm />
    </div>

  );
}

export default Booking;