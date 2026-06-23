import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Layers, Mail, ArrowRight, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [devResetLink, setDevResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(true);
      if (response.data && response.data.resetUrl) {
        // Capture reset link for easy testing/demo
        setDevResetLink(response.data.resetUrl);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-[#0b0f19] px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5 pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/5 pointer-events-none"></div>

      <div className="relative w-full max-w-md">
        {/* Brand Banner */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
            <Layers size={26} />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Reset Password
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            We will help you recover access to your workspace
          </p>
        </div>

        {/* Card Wrapper */}
        <div className="mt-8 rounded-3xl border border-slate-200/50 bg-white/70 p-8 shadow-xl backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/40">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:bg-slate-950 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-5 animate-fade-in">
              <div className="flex justify-center text-emerald-500 dark:text-emerald-450">
                <CheckCircle size={48} className="animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-250">Link Generated</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  A password reset link has been successfully logged to the server terminal. Please check the logs.
                </p>
              </div>

              {/* Dev mode assistant */}
              {devResetLink && (
                <div className="mt-4 rounded-2xl bg-indigo-50/50 p-4 dark:bg-indigo-950/20 border border-indigo-150 dark:border-indigo-900/35 text-left space-y-3">
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
                    🛠️ Local Developer Helper
                  </span>
                  <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
                    Click the button below to navigate directly to the reset password page for testing.
                  </p>
                  <a
                    href={devResetLink.replace('http://localhost:5173', '')}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 text-white py-2 text-xs font-bold hover:bg-indigo-500 shadow transition-all duration-150"
                  >
                    Go to Reset Page
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Footer Link */}
          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800/50 flex justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-350 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
