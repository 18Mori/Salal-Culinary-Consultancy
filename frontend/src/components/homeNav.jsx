import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const HomeNav = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []);


  const navigationItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
  ];

   const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <nav className="bg-white shadow-md px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <img src="chef-hat.png" alt="Chef Hat" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-semibold text-lg text-foreground leading-tight">
                Salal Culinary
              </span>
              <span className="font-caption text-xs text-muted-foreground leading-tight">
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
                className={`font-sans font-medium text-sm transition-colors duration-200 hover:text-primary ${
                  isActivePath(item?.path)
                    ? 'text-primary border-b-2 border-primary pb-1' :'text-foreground'
                }`}
              >
                {item?.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-border lg:border-t-0 lg:pt-0">
            <Link
              to="/login"
              className="px-4 py-2 bg-primary text-black rounded-md text-sm font-medium hover:bg-primary/90 transition-colors duration-200"
            >
              Login
            </Link>
          </div>
          </div>
      </nav>
      </header>
    </>
  );
};

export default HomeNav;