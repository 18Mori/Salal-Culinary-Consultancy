import { useState, useEffect } from "react";
import DNavigation from "./components/DNavigation";
import LoadingIndicator from "../../components/LoadingIndicator";
import DStats from "./components/DStats";
import BookingList from "./components/page/BookingList";


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
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/";
    const token = localStorage.getItem("token");
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
      <DNavigation 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        setLogout={setLogout} 
      />
      <main className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} p-4 transition-all duration-300`}>
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
    <div className="container mx-auto pl-5">
          <div className="mb-8">
            <div className="flex items-center justify-between">
            </div>
          </div>
          {/* <div>
              <DStats />
          </div> */}
          <div>
            <BookingList />
          </div>
           <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Support Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M476-280q21 0 35.5-14.5T526-330q0-21-14.5-35.5T476-380q-21 0-35.5 14.5T426-330q0 21 14.5 35.5T476-280Zm-36-154h74q0-17 1.5-29t6.5-23q5-11 12.5-20.5T556-530q35-35 49.5-58.5T620-642q0-53-36-85.5T487-760q-55 0-93.5 27T340-658l66 26q7-27 28-43.5t49-16.5q27 0 45 14.5t18 38.5q0 17-11 36t-37 42q-17 14-27.5 27.5T453-505q-7 15-10 31.5t-3 39.5Zm40 394L360-160H200q-33 0-56.5-23.5T120-240v-560q0-33 23.5-56.5T200-880h560q33 0 56.5 23.5T840-800v560q0 33-23.5 56.5T760-160H600L480-40ZM200-240h192l88 88 88-88h192v-560H200v560Zm280-280Z"/></svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6q47 0 91.5 10.5T440-278Zm40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q74 0 126 17t112 52q11 6 16.5 14t5.5 21v418q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-481q15 5 29.5 11t28.5 14q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm140-240v-440l120-40v440l-120 40Zm-340-99Z"/></svg>
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
}

export default client_index;