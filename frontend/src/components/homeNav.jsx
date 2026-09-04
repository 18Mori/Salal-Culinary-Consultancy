import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';
import MobileDrawer from './MobileDrawer';

const HomeNav = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
  });

  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    // Check for explicit admin indicators saved during login (e.g. localStorage.setItem('is_admin', 'true'))
    // Alternatively, pull from your user profile object or JWT payload
    const adminFlag = localStorage.getItem("is_admin") === "true" || localStorage.getItem("user_role") === "admin";

    setAuthState({
      isAuthenticated: !!token,
      isAdmin: adminFlag,
    });
  }, []);

  const navigationItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/portfolio", label: "Portfolio" },
  ];

  const isActivePath = (path) => location.pathname === path;

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <img className="w-6 h-6 object-contain" src="chef-hat.png" alt="Chef Hat" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-slate-100 leading-tight tracking-wide">
                Salal Culinary
              </span>
              <span className="text-[10px] text-amber-400 tracking-widest uppercase font-semibold">
                Consultancy
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActivePath(item.path)
                    ? 'text-amber-400 border-b-2 border-amber-400 pb-1'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-amber-400 transition-all"
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

          {/* Conditional Action Logic */}
          <div className="flex items-center space-x-4">
            {!authState.isAuthenticated && (
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-sm font-semibold hover:bg-amber-300 transition-all duration-200 shadow-md shadow-amber-400/10"
              >
                Login
              </Link>
            )}

            {authState.isAuthenticated && authState.isAdmin && (
              <Link
                to="/admin-dashboard"
                className="px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition-all duration-200"
              >
                Admin Dashboard
              </Link>
            )}

            {authState.isAuthenticated && !authState.isAdmin && (
              <Link
                to="/client_dashboard"
                className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-sm font-semibold hover:bg-amber-300 transition-all duration-200 shadow-md shadow-amber-400/10"
              >
                Dashboard
              </Link>
            )}

          </div>

        </div>
        {drawerOpen && <MobileDrawer isOpen={drawerOpen} onToggle={() => setDrawerOpen(false)} userRole={authState.isAdmin}/>}
      </nav>
    </header>
  );
};

export default HomeNav;