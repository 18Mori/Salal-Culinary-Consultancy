import { useState, useEffect } from "react";
import DNavigation from "../DNavigation";
import SkeletonLoader from "../../../../components/SkeletonLoader";

function Bill() {
  const [logout, setLogout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Track sidebar collapse state to apply responsive layout margin
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  
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
      <DNavigation onToggleCollapse={setIsCollapsed} setLogout={setLogout} />
      <main 
        className="p-4 transition-all duration-300 ease-out"
        style={{ marginLeft: isCollapsed ? '4rem' : '15rem' }}
      >
        <DashboardContent loading={loading} />
      </main>
    </div>
        </>
    );
}

function DashboardContent({ userData, loading }) {
  if (loading) {
    return <SkeletonLoader.Section />;
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bill Page</h1>
      <p>No invoice</p>
    </div>

    
  );
};

export default Bill;