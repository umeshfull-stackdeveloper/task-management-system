import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CheckSquare,
  Columns,
  BarChart3,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Layers,
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Kanban Board', path: '/kanban', icon: Columns },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200/50 bg-white/85 backdrop-blur-md transition-all duration-300 dark:border-slate-800/50 dark:bg-slate-900/85 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
            <Layers size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-850 dark:text-slate-100">
              Task<span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Flow</span>
            </h1>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              SaaS Suite
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 dark:from-indigo-950/20 dark:to-purple-950/20 dark:text-indigo-400 shadow-sm border border-slate-100/50 dark:border-slate-900/40'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-250 border border-transparent'
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Actions & Profile Footer */}
        <div className="border-t border-slate-200/50 p-4 dark:border-slate-800/50 space-y-4">
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-200 transition-colors duration-200"
          >
            <span className="flex items-center gap-3">
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow shadow-emerald-500/50"></span>
          </button>

          {/* User Widget Card */}
          {user && (
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50/50 p-3 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/50">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="h-10 w-10 shrink-0 rounded-xl object-cover border border-slate-250/30 dark:border-slate-750/30 shadow-md shadow-indigo-500/5"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 font-bold text-white shadow-md shadow-indigo-500/10">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-extrabold text-slate-800 dark:text-slate-350">
                  {user.name}
                </p>
                <p className="truncate text-[10px] text-slate-450 dark:text-slate-500">
                  {user.email}
                </p>
              </div>
              <button
                onClick={logout}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/30 dark:hover:text-rose-450 transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
