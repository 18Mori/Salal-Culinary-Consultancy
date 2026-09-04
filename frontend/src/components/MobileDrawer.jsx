import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileDrawer = ({ isOpen, onToggle, userRole }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const routes = userRole === 'admin'
    ? [
        { path: '/admin-dashboard', label: 'Admin Dashboard' },
        { path: '/logout', label: 'Logout' }
      ]
    : [
        { path: '/client_dashboard', label: 'Dashboard' },
        { path: '/booking', label: 'Bookings' },
        { path: '/bill', label: 'Bills' },
        { path: '/logout', label: 'Logout' }
      ];
  const navigationItems = [
      [
        {path: '/Home', label:'Home'},
        {path: '/About', label:'About'},
        {path: '/Services', label:'Services'},
        {path: '/Portfolio', label:'Portfolio'},
        {path: '/client_dashboard', label: 'Client Dashboard'}
      ]
    ];

  return (
    <div
      className={`fixed inset-0 z-40 bg-slate-950/90 backdrop-blur-xl transition-all duration-300 ${
        isOpen ? 'visible' : 'hidden'
      }`}
      onClick={onToggle}
    >
      <div
        className="fixed top-0 right-0 inset-0 w-full max-w-md mx-auto flex flex-col items-center justify-center gap-8 p-6 transform transition-all duration-300 ${
          isOpen ? 'translateX(0) scale(1)' : 'translateX(-100%) scale(0.96)'
        }"
      >
        <button
          onClick={onToggle}
          className="absolute top-4 right-4 text-white text-2xl hover:text-amber-400 transition-colors"
          aria-label="Close menu"
        >
          X
        </button>

        {routes.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className={`text-white text-base font-medium text-center w-full mb-4 px-4 py-3 rounded-lg border border-slate-800/50 ${
              isActive(route.path) ? 'bg-amber-400/20 text-amber-400' : 'text-slate-300 hover:text-slate-200'
            }`}
          >
            {route.label}
          </Link>
        ))}
        
        {navigationItems[0].map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className={`text-white text-base font-medium text-center w-full mb-4 px-4 py-3 rounded-lg border border-slate-800/50 ${
              isActive(route.path) ? 'bg-amber-400/20 text-amber-400' : 'text-slate-300 hover:text-slate-200'
            }`}
          >
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileDrawer;