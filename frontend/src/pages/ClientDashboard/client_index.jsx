import { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../../constants";
import DNavigation from "./components/DNavigation";
import Loader from "../../components/Loader";
import DStats from "./components/DStats";
import BookingList from "./components/page/BookingList";

function useHeartbeat() {
  useEffect(() => {
    const sendHeartbeat = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN) || localStorage.getItem('access');
      if (!token) return;

      const rawUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/";
      const baseUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

      try {
        const res = await fetch(`${baseUrl}/api/user/heartbeat/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          console.warn('Heartbeat response error:', res.status);
        }
      } catch (err) {
        console.error('Heartbeat network failure:', err);
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 30000);
    return () => clearInterval(interval);
  }, []);
}

function client_index() {
  const [logout, setLogout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useHeartbeat();

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
    const token = localStorage.getItem(ACCESS_TOKEN) || localStorage.getItem('access');
    
    if (token) {
      const cleanUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      fetch(`${cleanUrl}/api/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <DNavigation onToggleCollapse={setIsCollapsed} setLogout={setLogout} />
      <main 
        className="p-6 transition-all duration-300 ease-out"
        style={{ marginLeft: isCollapsed ? '4rem' : '15rem' }}
      >
        <DashboardContent loading={loading} userData={userData} />
      </main>
    </div>
  );
}

function DashboardContent({ loading, userData }) {
  const [activeModal, setActiveModal] = useState(null);

  if (loading) {
    return <Loader.Section />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome Back{userData?.first_name ? `, ${userData.first_name}` : ''}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Here is an overview of your active consultations and account stats.</p>
        </div>
        <button 
          onClick={() => setActiveModal('booking')}
          className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Booking</span>
        </button>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6">
        <DStats />
        
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <BookingList />
        </div>
      </div>

      {/* Support & Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-amber-50 border border-amber-200 text-amber-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Need Help?</h3>
            <p className="text-sm text-slate-500 mb-4">Have questions about your scheduled consultations or billing?</p>
          </div>
          <button 
            onClick={() => setActiveModal('support')}
            className="text-sm font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 self-start"
          >
            <span>Contact Support</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-amber-50 border border-amber-200 text-amber-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Resources</h3>
            <p className="text-sm text-slate-500 mb-4">Access consultation guides, platform guidelines, and FAQs.</p>
          </div>
          <button 
            onClick={() => setActiveModal('resources')}
            className="text-sm font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 self-start"
          >
            <span>Browse Knowledge Base</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Interactive Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {activeModal === 'booking' && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Create New Booking</h3>
                <p className="text-sm text-slate-500 mb-4">Navigate to booking form or select an instant session parameter.</p>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl">Cancel</button>
                  <a href="/booking" className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold">Go to Form</a>
                </div>
              </div>
            )}

            {activeModal === 'support' && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Contact Support</h3>
                <p className="text-sm text-slate-500 mb-4">Send an inquiry directly to our culinary consultancy team.</p>
                <textarea rows={3} placeholder="Describe your issue or question..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm mb-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100" />
                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl">Cancel</button>
                  <button onClick={() => { alert('Support request submitted.'); setActiveModal(null); }} className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold">Send Message</button>
                </div>
              </div>
            )}

            {activeModal === 'resources' && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Knowledge Base & Resources</h3>
                <ul className="space-y-2 text-sm text-slate-600 mb-6">
                  <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 cursor-pointer">Client Consultation Protocol Guide</li>
                  <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 cursor-pointer">Menu & Food Safety Preparation Checklist</li>
                </ul>
                <div className="flex justify-end border-t border-slate-100 pt-4">
                  <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold">Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default client_index;