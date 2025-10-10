import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../../constants';

const DNavigation = ({ onToggleCollapse, setLogout }) => {
  const location = useLocation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [userInitials, setUserInitials] = useState('');

  useEffect(() => {
  const fetchUserDetails = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setLoadingUser(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const user = await res.json();
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        setFullName(fullName || user.email || 'User Account');
        const email = `${user.email}`
        setEmail(email || 'User Email');

        const initials = 
          (user.first_name?.charAt(0) || '') + 
          (user.last_name?.charAt(0) || '');
        setUserInitials(initials || 'U');
      } else if (res.status === 401) {
        localStorage.removeItem(ACCESS_TOKEN);
        window.location.href = '/login';
      }
      } catch (error) {
      console.error('Failed to fetch user details:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  fetchUserDetails();
}, []);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Determines if link is active
  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    onToggleCollapse?.(!isCollapsed);
  };

  return (
    <nav className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 flex flex-col bg-white shadow-lg ${
      isCollapsed ? 'w-16' : 'w-60'
    }`}>
      <div className="flex items-center justify-between pt-4 pb-4 border-b border-gray-200">
        {!isCollapsed ? (
          <div className="flex items-center space-x-2 mx-auto">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <img src="chef-hat.png" alt="Chef Hat" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-semibold text-lg text-foreground leading-tight">
                Salal Culinary
              </span>
              <span className="font-caption text-xs text-muted-foreground leading-tight">
                Consultancy
              </span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto">
            <img src="chef-hat.png" alt="Chef Hat" className="w-full h-full object-contain" />
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg
            className={`w-5 h-5 text-gray-600 transform transition-transform ${
              isCollapsed ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <Link
          to="/"
          className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
            isActive('/')
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
            <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H120Zm320-350Z" />
          </svg>
          {!isCollapsed && <span className="ml-3">Home</span>}
        </Link>

        <Link
          to="/client_index"
          className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
            isActive('/client_index')
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
            <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
          </svg>
          {!isCollapsed && <span className="ml-3">Dashboard</span>}
        </Link>

        <Link
          to="/booking"
          className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
            isActive('/booking')
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
            <path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80H240Zm0-80h480v-640h-80v280l-100-60-100 60v-280H240v640Zm0 0v-640 640Zm200-360 100-60 100 60-100-60-100 60Z" />
          </svg>
          {!isCollapsed && <span className="ml-3">Booking</span>}
        </Link>

        <Link
          to="/bill"
          className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
            isActive('/bill')
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
            <path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z" />
          </svg>
          {!isCollapsed && <span className="ml-3">Bills</span>}
        </Link>
      </div>
      {/* Footer for User Info */}
<div className="p-4 border-t border-gray-200">
  {!isCollapsed ? (
    <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-medium">
                {userInitials}
              </div>
              <div>
                <span className="flex text-lg font-medium text-gray-700">
                {fullName || 'User Account'}
              </span>
              <span className="text-xs font-medium text-gray-600">
                {email}
              </span>
              </div>
            </div>
            <button
              className="bg-slate-500 hover:bg-red-500 text-white p-1 rounded-r-3xl transition-colors"
              onClick={() => setLogout(true)}
              aria-label="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-medium">
              {userInitials}
            </div>
          </div>
  )}
</div>
    </nav>
  );
};

export default DNavigation;