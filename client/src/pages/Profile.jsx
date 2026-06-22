import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { User, Mail, Calendar, Activity, CheckSquare, Sparkles, Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, inProgress: 0 });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '/avatars/avatar1.png');
  const [updating, setUpdating] = useState(false);

  const availableAvatars = [
    '/avatars/avatar1.png',
    '/avatars/avatar2.png',
    '/avatars/avatar3.png',
    '/avatars/avatar4.png',
  ];

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setSelectedAvatar(user.avatar || '/avatars/avatar1.png');
    }
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/tasks');
        const tasks = response.data;
        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === 'Completed').length;
        const pending = tasks.filter((t) => t.status === 'Pending').length;
        const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
        setStats({ total, completed, pending, inProgress });
      } catch (err) {
        console.error('Failed to load profile stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getJoinDate = () => {
    if (!user || !user.createdAt) return 'Recent';
    const date = new Date(user.createdAt);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
      day: 'numeric',
    });
  };

  const getCompletionRatio = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  const getProductivityTier = () => {
    const ratio = getCompletionRatio();
    if (stats.total === 0) return 'Beginner';
    if (ratio > 80) return 'Elite Achiever';
    if (ratio > 50) return 'Productive Builder';
    return 'Task Explorer';
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 size={30} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center gap-6">
        
        {/* Glow behind profile */}
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-2xl pointer-events-none"></div>

        {/* User Avatar / Avatar Editor */}
        <div className="relative">
          {user?.avatar || selectedAvatar ? (
            <img
              src={selectedAvatar || user?.avatar}
              alt="Profile Avatar"
              className="h-20 w-20 rounded-3xl object-cover border-2 border-indigo-500 shadow-lg shadow-indigo-500/10"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white text-3xl font-black shadow-lg shadow-indigo-500/20">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* User Info details */}
        <div className="text-center sm:text-left flex-1 space-y-2">
          {isEditing ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full sm:w-64 block rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200 dark:focus:border-indigo-400 transition-all"
                  placeholder="Name"
                  autoFocus
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Select Avatar</label>
                <div className="flex items-center gap-2">
                  {availableAvatars.map((av) => (
                    <button
                      key={av}
                      onClick={() => setSelectedAvatar(av)}
                      className={`h-11 w-11 rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                        selectedAvatar === av
                          ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-500/20'
                          : 'border-transparent hover:border-slate-355 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Avatar option" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  {user?.name}
                </h3>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30 flex items-center gap-1">
                  <Sparkles size={10} />
                  {getProductivityTier()}
                </span>
              </div>
              <p className="text-sm text-slate-400 dark:text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail size={14} />
                {user?.email}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-550 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                <Calendar size={14} />
                Joined on {getJoinDate()}
              </p>
            </>
          )}
        </div>

        {/* Edit Actions buttons */}
        <div className="shrink-0 flex items-center gap-2 self-center sm:self-auto sm:ml-auto">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditName(user?.name || '');
                  setSelectedAvatar(user?.avatar || '/avatars/avatar1.png');
                }}
                disabled={updating}
                className="rounded-xl border border-slate-200 hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-500 dark:border-slate-800 dark:hover:bg-slate-800/50 dark:text-slate-400 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!editName.trim()) {
                    addToast('Name cannot be empty', 'error');
                    return;
                  }
                  setUpdating(true);
                  const result = await updateProfile({
                    name: editName,
                    avatar: selectedAvatar,
                  });
                  setUpdating(false);
                  if (result.success) {
                    setIsEditing(false);
                    addToast('Profile updated successfully', 'success');
                  } else {
                    addToast(result.error || 'Failed to update profile', 'error');
                  }
                }}
                disabled={updating}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4.5 py-2 text-xs font-bold text-white shadow shadow-indigo-600/10 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
              >
                {updating ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 px-4.5 py-2 text-xs font-bold text-slate-500 dark:border-slate-800 dark:hover:bg-slate-800/50 dark:text-slate-400 transition-all"
            >
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Completion Progress Bar */}
        <div className="md:col-span-2 rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/50 space-y-4">
          <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Activity size={15} className="text-indigo-500" />
            <span>Productivity Ratio</span>
          </h4>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-black text-slate-800 dark:text-slate-100">
                {getCompletionRatio()}%
              </span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                {stats.completed} of {stats.total} Tasks Completed
              </span>
            </div>

            {/* Slider bar */}
            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${getCompletionRatio()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Small numeric widgets */}
        <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/50 flex flex-col justify-between">
          <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <CheckSquare size={15} className="text-emerald-500" />
            <span>Status Summary</span>
          </h4>

          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="rounded-2xl bg-amber-50/50 p-2.5 dark:bg-amber-950/15 border border-amber-100/30 dark:border-amber-950/30">
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">Pending</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{stats.pending}</p>
            </div>
            <div className="rounded-2xl bg-indigo-50/50 p-2.5 dark:bg-indigo-950/15 border border-indigo-100/30 dark:border-indigo-950/30">
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">Active</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{stats.inProgress}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50/50 p-2.5 dark:bg-emerald-950/15 border border-emerald-100/30 dark:border-emerald-950/30">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Done</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
