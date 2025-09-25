import { useState, useEffect } from "react";
import DNavigation from "../../../ClientDashboard/components/DNavigation";
import BookingForm from "../../../../components/BookingForm";


function Booking() {
  const [logout, setLogout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
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
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
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
      <main className={`ml-${sidebarCollapsed ? '16' : '64'} p-4 transition-all duration-300`}>
        <DashboardContent 
          userData={userData} 
          loading={loading} 
        />
      </main>
    </div>
        </>
    );
}

function DashboardContent({ userData, loading }) {
  if (loading) {
    return <LoadingIndicator />;
  }
  return (
    <div className="container mx-auto p-4">
      <BookingForm />
    </div>

    
  );
};

export default Booking;