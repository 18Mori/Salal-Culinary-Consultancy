import { useState, useEffect } from "react";
import DNavigation from "../DNavigation";
import Loader from "../../../../components/Loader";
import MobileDrawer from "../../../../components/MobileDrawer";

function Bill() {
  const [logout, setLogout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (logout) {
      localStorage.clear();
      window.location.href = "/login";
    }
  }, [logout]);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token") || localStorage.getItem("access");
    if (token) {
      fetch("/api/user/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network error");
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
        className="p-6 transition-all duration-300 ease-out"
        style={{ marginLeft: isCollapsed ? '4rem' : '15rem' }}
      >
        <BillingContent loading={loading} userData={userData} />
      </main>
      {drawerOpen && <MobileDrawer isOpen={drawerOpen} onToggle={() => setDrawerOpen(false)}/>}
    </div>
  );
}

function BillingContent({ loading }) {
  // Sample invoices state for layout blueprint
  const [invoices] = useState([
    { id: "INV-2026-001", date: "Aug 12, 2026", service: "Food Safety Consultation", amount: "$150.00", status: "Paid" },
    { id: "INV-2026-002", date: "Aug 20, 2026", service: "Menu Development Review", amount: "$220.00", status: "Pending" }
  ]);

  if (loading) {
    return <Loader.Section />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8"> 
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing & Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">Manage payment history, payment methods, and download transaction statements.</p>
        </div>
        <button className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
          Payment Settings
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Billed</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">$370.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Paid Outstanding</span>
          <p className="text-2xl font-bold text-emerald-600 mt-2">$150.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Due</span>
          <p className="text-2xl font-bold text-amber-600 mt-2">$220.00</p>
        </div>
      </div>

      {/* Invoices Blueprint Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Invoices</h2>
          <span className="text-xs font-medium text-slate-400">{invoices.length} entries</span>
        </div>

        {invoices.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
              &#128189;
            </div>
            <p className="text-sm font-semibold text-slate-700">No Invoices Found</p>
            <p className="text-xs text-slate-400 mt-1">When you make booking payments, statements will show up here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                <tr>
                  <th className="p-4 pl-6">Invoice ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-slate-900">{inv.id}</td>
                    <td className="p-4 text-slate-600">{inv.date}</td>
                    <td className="p-4 text-slate-800">{inv.service}</td>
                    <td className="p-4 font-semibold text-slate-900">{inv.amount}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        inv.status === 'Paid' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button className="text-amber-600 hover:text-amber-700 text-xs font-semibold">
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bill;