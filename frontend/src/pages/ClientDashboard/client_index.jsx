import { useState, useEffect } from "react";
import DNavigation from "./components/DNavigation";

function client_index() {
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
    <div className="min-h-screen bg-background">
      <DNavigation 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      <main className={`ml-${sidebarCollapsed ? '16' : '64'} p-4 transition-all duration-300`}>
        <DashboardContent 
          userData={userData} 
          loading={loading} 
          setLogout={setLogout} 
        />
      </main>
    </div>
  );
}

function DashboardContent({ userData, loading, setLogout }) {
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }
  return (
    <div className="p-4 ml-30 bg-white rounded-lg shadow-md">
      <h1>Client Dashboard</h1>
      <p>Welcome to the Client Dashboard!</p>
      <button className="bg-red-500 text-white p-2 rounded" onClick={() => setLogout(true)}>Logout</button>
    </div>
  );
}

export default client_index;