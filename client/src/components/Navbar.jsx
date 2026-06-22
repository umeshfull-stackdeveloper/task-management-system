import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Calendar,
  Sparkles,
} from 'lucide-react';

const Navbar = ({ toggleSidebar, globalSearch, setGlobalSearch }) => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Mock Notifications list
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Task "Design Landing Page" is due tomorrow', unread: true, time: '2h ago' },
    { id: 2, text: 'Welcome to TaskFlow SaaS workspace!', unread: false, time: '1d ago' },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Overview Dashboard';
      case '/tasks':
        return 'Tasks Manager';
      case '/kanban':
        return 'Kanban Workspace';
      case '/analytics':
        return 'Metrics & Performance';
      case '/profile':
        return 'Account Profile';
      case '/settings':
        return 'Workspace Settings';
      default:
        return 'TaskFlow';
    }
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="relative flex h-16 shrink-0 items-center justify-between border-b border-slate-200/50 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/80 z-30">
      
      {/* Title & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu size={18} />
        </button>
        <h2 className="hidden text-base font-extrabold text-slate-800 dark:text-slate-100 sm:block">
          {getPageTitle()}
        </h2>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search size={14} />
          </div>
          <input
            type="text"
            value={globalSearch || ''}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              // Auto-redirect to Tasks page if they start searching from somewhere else
              if (location.pathname !== '/tasks' && location.pathname !== '/kanban') {
                navigate('/tasks');
              }
            }}
            placeholder="Type / to search tasks globally..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:bg-slate-950 transition-all"
          />
        </div>
      </div>

      {/* Right Control Widgets */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-650 dark:hover:bg-slate-800 dark:hover:text-slate-250 transition-colors"
          title="Toggle Theme"
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="relative rounded-xl p-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-650 dark:hover:bg-slate-800 dark:hover:text-slate-250 transition-colors"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white ring-2 ring-white dark:ring-slate-900 animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-xl dark:border-slate-800/80 dark:bg-slate-900 overflow-hidden z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800/60">
                <span className="text-xs font-black text-slate-800 dark:text-slate-205">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`rounded-xl p-2.5 text-xs transition-colors border border-transparent ${
                      n.unread
                        ? 'bg-indigo-50/40 dark:bg-indigo-950/10 border-indigo-100/30 dark:border-indigo-950/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <p className="font-semibold text-slate-700 dark:text-slate-350">{n.text}</p>
                    <span className="text-[9px] text-slate-400 block mt-1">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown Trigger */}
        <div className="relative border-l border-slate-200/50 pl-3 dark:border-slate-800/50">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-1.5 rounded-xl hover:bg-slate-50 p-1 dark:hover:bg-slate-800/40 transition-colors"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Navbar Avatar"
                className="h-7.5 w-7.5 shrink-0 rounded-xl object-cover border border-slate-250/30 dark:border-slate-750/30 shadow shadow-indigo-500/5"
              />
            ) : (
              <div className="flex h-7.5 w-7.5 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-[11px] font-black text-white shadow shadow-indigo-500/10">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {/* Profile Menu options */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200/60 bg-white p-2 shadow-xl dark:border-slate-800/80 dark:bg-slate-900 z-50">
              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/profile');
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800/40 transition-colors"
              >
                <User size={14} />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/settings');
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800/40 transition-colors"
              >
                <Settings size={14} />
                <span>Settings</span>
              </button>
              <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
