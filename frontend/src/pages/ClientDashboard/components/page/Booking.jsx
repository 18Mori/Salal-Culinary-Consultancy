import { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../../../../constants";
import DNavigation from "../DNavigation";
import BookingForm from "../../../../components/BookingForm";
import Loader from "../../../../components/Loader";
import MobileDrawer from "../../../../components/MobileDrawer";


function Booking() {
  const [logout, setLogout] = useState(false);
  const [loading, setLoading] = useState(false);

  // Track sidebar collapse state to apply responsive layout margin
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

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
        <div className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:hidden">
        <div className="h-14 flex items-center justify-between">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg text-slate-300 hover:text-amber-400 transition-all lg:hidden"
            aria-label="Open mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="hidden md:block">
        <DNavigation onToggleCollapse={setIsCollapsed} setLogout={setLogout} />
      </div>
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