import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../../constants';

const DNavigation = ({ onToggleCollapse }) => {
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

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    if (onToggleCollapse) {
      onToggleCollapse(nextState);
    }
  };

  return (
    <nav className={`fixed left-0 top-0 h-screen z-50 flex flex-col bg-slate-950/90 backdrop-blur-xl border-r border-slate-800/80 shadow-2xl transition-all duration-300 ease-out font-sans ${
      isCollapsed ? 'w-16' : 'w-60'
}`}>
      {/* Header */}
      <div className="flex items-center justify-between pt-5 pb-5 border-b border-slate-800/80 px-3">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center p-1.5 shrink-0">
              <img src="chef-hat.png" alt="Chef Hat" className="w-full h-full object-contain filter invert opacity-90" />
            </div>
            <div className="cursor-default flex flex-col">
              <span className="font-light text-base text-white tracking-wide leading-tight">
                Salal <span className="font-serif italic text-amber-200">Culinary</span>
              </span>
              <span className="text-[10px] text-amber-400/80 uppercase tracking-widest font-semibold leading-tight">
                Client Portal
              </span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center p-1.5 mx-auto">
            <img src="chef-hat.png" alt="Chef Hat" className="w-full h-full object-contain filter invert opacity-90" />
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
          aria-label="Toggle sidebar"
        >
          <svg
            className={`w-4 h-4 transform transition-transform duration-300 ${
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

      {/* Navigation Links */}
      <div className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        <Link
          to="/client_dashboard"
          className={`flex items-center px-3 py-3 rounded-xl border transition-all duration-200 ${
            isActive('/client_dashboard')
              ? 'bg-slate-900 border-amber-400/40 text-amber-400 shadow-lg shadow-amber-400/5 font-medium'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="22px" 
            viewBox="0 -960 960 960" 
            width="22px" 
            fill="currentColor"
            className={isActive('/client_dashboard') ? 'text-amber-400' : 'text-slate-400'}
          >
            <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
          </svg>
          {!isCollapsed && <span className="ml-3 text-sm tracking-wide">Dashboard</span>}
        </Link>

        <Link
          to="/booking"
          className={`flex items-center px-3 py-3 rounded-xl border transition-all duration-200 ${
            isActive('/booking')
              ? 'bg-slate-900 border-amber-400/40 text-amber-400 shadow-lg shadow-amber-400/5 font-medium'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="22px" 
            viewBox="0 -960 960 960" 
            width="22px" 
            fill="currentColor"
            className={isActive('/booking') ? 'text-amber-400' : 'text-slate-400'}
          >
            <path d="M280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z" />
          </svg>
          {!isCollapsed && <span className="ml-3 text-sm tracking-wide">Bookings</span>}
        </Link>

        <Link
          to="/bill"
          className={`flex items-center px-3 py-3 rounded-xl border transition-all duration-200 ${
            isActive('/bill')
              ? 'bg-slate-900 border-amber-400/40 text-amber-400 shadow-lg shadow-amber-400/5 font-medium'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="22px" 
            viewBox="0 -960 960 960" 
            width="22px" 
            fill="currentColor"
            className={isActive('/bill') ? 'text-amber-400' : 'text-slate-400'}
          >
            <path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z" />
          </svg>
          {!isCollapsed && <span className="ml-3 text-sm tracking-wide">Bills</span>}
        </Link>

        <Link
          to="/logout"
          className="flex items-center px-3 py-3 rounded-xl border border-transparent text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
          </svg>
          {!isCollapsed && <span className="ml-3 text-sm tracking-wide">Logout</span>}
        </Link>
      </div>

      {/* User Info Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/30">
        {isCollapsed ? (
          <div className="flex items-center justify-center">
            <div className="cursor-default w-9 h-9 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 font-mono text-xs font-semibold">
              {userInitials}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 font-mono text-xs font-semibold shrink-0">
              {userInitials}
            </div>
            <div className="overflow-hidden">
              <span className="block text-sm font-medium text-slate-200 truncate">
                {fullName || 'User Account'}
              </span>
              <span className="block text-xs text-slate-500 truncate font-light">
                {email}
              </span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DNavigation;