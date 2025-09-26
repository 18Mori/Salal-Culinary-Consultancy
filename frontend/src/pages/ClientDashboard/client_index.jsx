import { useState, useEffect } from "react";
import DNavigation from "./components/DNavigation";
import LoadingIndicator from "../../components/LoadingIndicator";
import DStats from "./components/DStats";


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

  // useEffect(() => {
  //     fetchDashboardData();
  //   const fetchDashboardData = async () => {
  //   const res = await fetch('/api/dashboard/', {
  //     method: 'GET',
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   });
  //   if (res.ok) {
  //     const data = await res.json();
  //     setUserData(data);
  //   } else {
  //     console.error("Error fetching dashboard data:", res.statusText);
  //   }
  // };
  // }, []);

  return (
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
  );
}

function DashboardContent({ userData, loading }) {
  if (loading) {
    return <LoadingIndicator />;
  }
  return (
    <div className="container mx-auto pl-20">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Welcome back, {userData?.first_name || 'User'}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  Here's what's happening with your consultancy projects
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Last login: {new Date(userData?.last_login.data.timezone).toLocaleString() || 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Account Status: {userData?.account_plan?.plan_type === 'premium' ? 'Premium Client' : 'Standard'}
                </p>
              </div>
            </div>
          </div>
          <div>
                    <DStats stats={userData?.dashboard_stats} />
          </div>
           <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Support Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                </div>
                <h3 className="text-lg font-semibold text-foreground">Need Help?</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Our support team is here to assist you with any questions about your consultancy services.
              </p>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Email:</span> support@salalculinary.com
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Phone:</span> +254 729384028
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Hours:</span> Mon-Fri 9AM-6PM EST
                </p>
              </div>
            </div>

            {/* Resources Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                </div>
                <h3 className="text-lg font-semibold text-foreground">Resources</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Access your personalized compliance guides, training materials, and industry insights.
              </p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>• Food Safety Compliance Checklist</p>
                <p>• Staff Training Guidelines</p>
                <p>• Menu Costing Templates</p>
                <p>• Industry Best Practices Guide</p>
              </div>
            </div>
          </div>
    </div>

    
  );
};

export default client_index;