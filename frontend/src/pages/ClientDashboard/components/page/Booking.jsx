import { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../../../../constants";
import DNavigation from "../../../ClientDashboard/components/DNavigation";
import BookingForm from "../../../../components/BookingForm";
import BookingList from "./BookingList";
import LoadingIndicator from "../../../../components/LoadingIndicator";



function Booking() {
  const [logout, setLogout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
  setSidebarCollapsed(!sidebarCollapsed);
};

  useEffect(() => {
    if (logout) {
      localStorage.clear();
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
      <DNavigation 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        setLogout={setLogout} 
      />
      <main className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} p-4 transition-all duration-300`}>
        <DashboardContent 
          loading={loading} 
        />
      </main>
    </div>
        </>
    );
}

function DashboardContent({ loading }) {
  if (loading) {
    return <LoadingIndicator />;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
      <BookingForm />
      <BookingList />
    </div>

    
  );
};

export default Booking;