import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';

const HomeNav = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    setIsAuthenticated(!!token);
  }, []);


  const navigationItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/portfolio", label: "Portfolio" },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream border-b border-sage-200">
      <nav className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-8 h-8 bg-terracotta rounded-sm flex items-center justify-center">
              <img src="chef-hat.png" alt="Chef Hat" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-semibold text-charcoal leading-tight">
                Salal Culinary
              </span>
              <span className="font-caption text-xs text-sage leading-tight">
                Consultancy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`font-sans font-medium text-sm transition-colors duration-200 hover:text-brass ${
                  isActivePath(item?.path)
                    ? 'text-brass border-b-2 border-brass pb-1' :'text-sage'
                }`}
              >
                {item?.label}
              </Link>
            ))}
          </div>
          <div>
          {isAuthenticated ? (
          <Link
            to="/client_index"
            className="px-4 py-2 bg-brass text-charcoal rounded-md text-sm font-medium hover:bg-terracotta/90 transition-colors duration-200"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-brass text-charcoal rounded-md text-sm font-medium hover:bg-terracotta/90 transition-colors duration-200"
          >
            Login
          </Link>
        )}
        {isAuthenticated && (
  <Link to="/admin-dashboard" className="ml-4">
    Admin Dashboard
  </Link>
)}
          </div>
        </div>
      </nav>
      </header>
    </>
  );
};

export default HomeNav;