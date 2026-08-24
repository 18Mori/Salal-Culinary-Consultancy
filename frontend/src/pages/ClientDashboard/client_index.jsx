import { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../../constants";
import DNavigation from "./components/DNavigation";
import SkeletonLoader from "../../components/SkeletonLoader";
import DStats from "./components/DStats";
import BookingList from "./components/page/BookingList";


function client_index() {
  const [logout, setLogout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

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
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/";
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      fetch(`${apiUrl}/api/user/`, {
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
    <div className="min-h-screen bg-background">
      <DNavigation onToggleCollapse={setIsCollapsed} setLogout={setLogout} />
      <main 
        className="p-4 transition-all duration-300 ease-out"
        style={{ marginLeft: isCollapsed ? '4rem' : '15rem' }}
      >
        <DashboardContent loading={loading} />
      </main>
    </div>
  );
}

function DashboardContent({ loading }) {
  if (loading) {
    return <SkeletonLoader.Section />;
  }
  return (
    <div className="container mx-auto pl-5">
      <div className="mb-8">
        <div className="flex items-center justify-between">
        </div>
      </div>
      <div>
        <DStats />
      </div>
      <div>
        <BookingList />
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div>
          <h3>Need Help</h3>
          <p>Support text</p>
        </div>
        <div>
          <h3>Resources</h3>
          <p>Resources text</p>
        </div>
      </div>
    </div>
  );
}

export default client_index;