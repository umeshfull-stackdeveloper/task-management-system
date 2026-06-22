import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Settings, User, Bell, Database, ShieldAlert, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [dbType, setDbType] = useState('Checking...');
  const [saving, setSaving] = useState(false);

  // App preference configurations
  const [defaultPriority, setDefaultPriority] = useState(user?.defaultPriority || 'Medium');
  const [emailAlerts, setEmailAlerts] = useState(user?.emailAlerts !== undefined ? user?.emailAlerts : true);
  const [dueReminders, setDueReminders] = useState(user?.dueReminders !== undefined ? user?.dueReminders : true);

  // Synchronize state when user is fetched/loaded
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setDefaultPriority(user.defaultPriority || 'Medium');
      setEmailAlerts(user.emailAlerts !== undefined ? user.emailAlerts : true);
      setDueReminders(user.dueReminders !== undefined ? user.dueReminders : true);
    }
  }, [user]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get('/auth/me');
        setDbType(response.data.dbType || 'Local JSON Database');
      } catch (err) {
        setDbType('Disconnected');
      }
    };
    fetchStatus();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Name cannot be empty', 'error');
      return;
    }
    setSaving(true);
    const result = await updateProfile({ name });
    setSaving(false);
    if (result.success) {
      addToast('Profile changes saved successfully', 'success');
    } else {
      addToast(result.error || 'Failed to save profile changes', 'error');
    }
  };

  const handleSystemSave = async () => {
    setSaving(true);
    const result = await updateProfile({
      defaultPriority,
      emailAlerts,
      dueReminders,
    });
    setSaving(true); // Let it finish and toast
    setTimeout(() => setSaving(false), 300);
    if (result.success) {
      addToast('System preferences updated', 'success');
    } else {
      addToast(result.error || 'Failed to update preferences', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Page Title */}
      <div className="shrink-0">
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Settings size={18} className="text-indigo-500" />
          <span>Workspace Preferences</span>
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Configure profile details, default parameters, and review system configuration properties
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Form card */}
          <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/50 space-y-4">
            <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3 dark:border-slate-800/50">
              <User size={15} className="text-indigo-500" />
              <span>Personal Account Details</span>
            </h4>

            <form onSubmit={handleProfileSave} className="space-y-4.5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-850 dark:bg-slate-950/40 dark:text-slate-200 dark:focus:border-indigo-400 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-455 dark:text-slate-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full rounded-xl border border-slate-200 bg-slate-100/50 px-3.5 py-2.5 text-xs font-semibold text-slate-400 cursor-not-allowed dark:border-slate-850 dark:bg-slate-950/20 dark:text-slate-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow shadow-indigo-600/10 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>

          {/* Preferences Settings */}
          <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/50 space-y-4">
            <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3 dark:border-slate-800/50">
              <Bell size={15} className="text-purple-500" />
              <span>Workspace Configurations</span>
            </h4>

            <div className="space-y-4 pt-2 text-xs font-semibold text-slate-650 dark:text-slate-350">
              {/* Dropdowns */}
              <div className="flex items-center justify-between">
                <div>
                  <p>Default Task Priority</p>
                  <span className="text-[10px] text-slate-400 block font-normal">Pre-filled status for new board entries</span>
                </div>
                <select
                  value={defaultPriority}
                  onChange={(e) => setDefaultPriority(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300 dark:focus:border-indigo-400 transition-all"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60 my-2"></div>

              {/* Checkbox settings */}
              <div className="flex items-center justify-between">
                <div>
                  <p>Enable Email Notifications</p>
                  <span className="text-[10px] text-slate-400 block font-normal">Get weekly activity summaries of task cards</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500 dark:border-slate-800"
                />
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60 my-2"></div>

              <div className="flex items-center justify-between">
                <div>
                  <p>Due Date Reminders</p>
                  <span className="text-[10px] text-slate-400 block font-normal">Display warning banner icons if deadlines expire</span>
                </div>
                <input
                  type="checkbox"
                  checked={dueReminders}
                  onChange={(e) => setDueReminders(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500 dark:border-slate-800"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-dashed border-slate-100 dark:border-slate-800/50">
                <button
                  onClick={handleSystemSave}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 dark:border-slate-800 dark:hover:bg-slate-800/50 dark:text-slate-400 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Updating...' : 'Update Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Database Health widgets */}
        <div className="space-y-6">
          
          {/* DB details */}
          <div className="rounded-3xl border border-slate-200/50 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/50 flex flex-col justify-between space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-2.5 dark:border-slate-800/50">
              <Database size={13} className="text-emerald-500" />
              <span>Database Connection</span>
            </h4>

            <div className="space-y-3 pt-1 text-xs">
              <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850/50 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Active Driver
                </p>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow shadow-emerald-500/50"></span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-300">
                    {dbType}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-indigo-50/20 p-3 border border-indigo-100/30 text-[11px] text-slate-450 dark:bg-indigo-950/10 dark:text-indigo-400/90 leading-relaxed font-medium">
                Once a MongoDB cluster URL is configured in `/server/.env`, the system will automatically transfer active requests to the cloud.
              </div>
            </div>
          </div>

          {/* System version info */}
          <div className="rounded-3xl border border-slate-200/50 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/50 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-2.5 dark:border-slate-800/50">
              <Cpu size={13} className="text-purple-500" />
              <span>System Metadata</span>
            </h4>

            <div className="text-[11px] font-semibold text-slate-550 dark:text-slate-400 space-y-2">
              <div className="flex justify-between">
                <span>Application Version:</span>
                <span className="text-slate-700 dark:text-slate-200">1.0.0 Enterprise</span>
              </div>
              <div className="flex justify-between">
                <span>Node.js Env:</span>
                <span className="text-slate-700 dark:text-slate-200">Development</span>
              </div>
              <div className="flex justify-between">
                <span>Framework:</span>
                <span className="text-slate-700 dark:text-slate-200">React 18 + Vite</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
