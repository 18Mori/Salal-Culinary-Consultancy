import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../../constants';

const AdminNavigation = ({ onToggleCollapse }) => {
  const location = useLocation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [userInitials, setUserInitials] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setFullName('');
        setEmail('');
        setUserInitials('');
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
          setEmail(user.email || '');

          const initials = 
            (user.first_name?.charAt(0) || '') + 
            (user.last_name?.charAt(0) || '');
          setUserInitials(initials || 'U');
        } else if (res.status === 401) {
          localStorage.removeItem(ACCESS_TOKEN);
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
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
    if (onToggleCollapse) {
      onToggleCollapse(isCollapsed);
    }
  }, [isCollapsed, onToggleCollapse]);

  // Determines if link is active
  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    if (onToggleCollapse) {
      onToggleCollapse(nextState);
    }
  };

  return (
    <nav className={`fixed left-0 top-0 h-screen z-50 flex flex-col bg-white shadow-lg transition-all duration-300 ease-out ${
      isCollapsed ? 'w-16' : 'w-60'
    }`}>
      <div className="flex items-center justify-between pt-4 pb-4 border-b border-gray-200">
        {!isCollapsed ? (
          <div className="flex items-center space-x-2 mx-auto">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <img src="chef-hat.png" alt="Chef Hat" className="w-full h-full object-contain" />
            </div>
            <div className="cursor-default flex flex-col">
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

      <div className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">

        <Link
          to="/admin-dashboard"
          className={`flex items-center px-3 py-3 rounded-r-xl border-l-4 transition-all duration-200 ${
            isActive('/admin-dashboard')
              ? 'bg-charcoal text-brass border-brass shadow-md font-bold scale-[1.02] translate-x-1'
              : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-charcoal'
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="24px" 
            viewBox="0 -960 960 960" 
            width="24px" 
            fill="currentColor"
            className={isActive('/admin-dashboard') ? 'text-brass' : 'text-gray-500'}
          >
            <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
          </svg>
          {!isCollapsed && <span className="ml-3 tracking-wide">Admin Dashboard</span>}
        </Link>

        <Link
          to="/logout"
          className="flex items-center px-3 py-3 rounded-r-xl border-l-4 border-transparent text-red-600 hover:bg-red-50 hover:border-red-500 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
          </svg>
          {!isCollapsed && <span className="ml-3 tracking-wide">Logout</span>}
        </Link>
      </div>

      {/* Footer for User Info */}
      <div className="p-4 border-t border-gray-200">
        {isCollapsed ? (
          <div className="flex items-center justify-center">
            <div className=" cursor-default w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-medium">
              {userInitials}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="cursor-default flex items-center space-x-3">
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
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavigation;