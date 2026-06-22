import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Layers,
  CheckSquare,
  Columns,
  Activity,
  Shield,
  Moon,
  ArrowRight,
  PlusCircle,
  TrendingUp,
  Star,
  Users,
  Calendar,
  Sparkles,
} from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: 'Smart Task Management',
      desc: 'Create, details-enrich, and track individual tasks with customizable priority weights and categories.',
      icon: CheckSquare,
      color: 'text-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/15',
    },
    {
      title: 'Kanban Workflow Board',
      desc: 'Drag and drop cards between statuses Pending, In Progress, and Completed with native smooth gestures.',
      icon: Columns,
      color: 'text-purple-500 bg-purple-50/50 dark:bg-purple-950/15',
    },
    {
      title: 'Timeline Activity Logs',
      desc: 'Keep audits of all task actions and modifications in a chronological feed to monitor updates.',
      icon: Activity,
      color: 'text-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/15',
    },
    {
      title: 'Recharts Metrics Analytics',
      desc: 'Visualize team productivity charts, task splits, and velocity curves instantly on your dashboard.',
      icon: TrendingUp,
      color: 'text-blue-500 bg-blue-50/50 dark:bg-blue-950/15',
    },
    {
      title: 'JWT Auth Security',
      desc: 'Encrypt and secure your workspaces using protected JWT authorization headers and password hashes.',
      icon: Shield,
      color: 'text-rose-500 bg-rose-50/50 dark:bg-rose-950/15',
    },
    {
      title: 'Dark Mode Support',
      desc: 'Seamlessly transition between light mode and deep navy themes with persistent localStorage settings.',
      icon: Moon,
      color: 'text-amber-500 bg-amber-50/50 dark:bg-amber-950/15',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Create Your Workspace',
      desc: 'Sign up in seconds and start registering tasks under Low, Medium, or High priorities.',
    },
    {
      num: '02',
      title: 'Track Stage Progress',
      desc: 'Use the interactive Kanban board drag-and-drop system to move tasks as work progresses.',
    },
    {
      num: '03',
      title: 'Analyze Performance',
      desc: 'Review stats cards, overdue notifications, and completion trend charts to optimize workflows.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Product Lead, Acme Corp',
      comment: 'TaskFlow completely transformed how our team schedules sprints. The Kanban board is incredibly responsive.',
      rating: 5,
    },
    {
      name: 'David Chen',
      role: 'Lead Architect, DevSource',
      comment: 'The local database fallback is amazing for offline testing, and the analytics charts provide perfect team metrics.',
      rating: 5,
    },
    {
      name: 'Elena Rostova',
      role: 'Creative Director, StudioNine',
      comment: 'A clean, modern SaaS layout that feels extremely premium. The dark mode transitions are beautiful.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-700 dark:text-slate-250 transition-colors duration-200">
      
      {/* 1. Header Navigation */}
      <header className="fixed top-0 inset-x-0 h-16 border-b border-slate-200/50 bg-white/70 backdrop-blur-md dark:border-slate-800/50 dark:bg-[#0b0f19]/70 z-50 transition-colors">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/10">
              <Layers size={18} />
            </div>
            <span className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">
              Task<span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Flow</span>
            </span>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Workflow</a>
            <a href="#testimonials" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Reviews</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4.5 py-2 text-xs font-bold text-white shadow shadow-indigo-600/10 hover:brightness-110 active:scale-95 transition-all"
              >
                <span>Go to Workspace</span>
                <ArrowRight size={13} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4.5 py-2 text-xs font-bold text-white shadow shadow-indigo-600/10 hover:brightness-110 active:scale-95 transition-all"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
        
        {/* Glow orbs */}
        <div className="absolute top-10 left-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5 pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/5 pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30">
              <Sparkles size={11} />
              <span>SaaS Workspace Redefined</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-[1.12]">
              Organize Work.<br />
              Boost Productivity.<br />
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Ship Faster.</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-450 max-w-md mx-auto lg:mx-0 leading-relaxed">
              TaskFlow is a premium, smart task management workspace mapping boards, metrics charts, and audit timelines under one centralized project command center.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => navigate(user ? '/dashboard' : '/register')}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/10 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <span>Get Started Free</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate(user ? '/dashboard' : '/login')}
                className="rounded-xl border border-slate-200 hover:bg-slate-50 px-6 py-3 text-xs font-bold text-slate-500 dark:border-slate-800 dark:hover:bg-slate-800/30 dark:text-slate-400 transition-all"
              >
                View Workspace Demo
              </button>
            </div>
          </div>

          {/* Right: Glassmorphic CSS Dashboard Mock */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-lg rounded-3xl border border-slate-200/50 bg-white/70 p-5 shadow-2xl backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/40 relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>
                </div>
                <div className="h-4 w-40 rounded-lg bg-slate-100 dark:bg-slate-800"></div>
                <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800"></div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-50/50 p-3.5 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850/50 space-y-1">
                  <p className="text-[8px] text-slate-400 uppercase font-black">Tasks</p>
                  <p className="text-lg font-black text-slate-800 dark:text-slate-200">12</p>
                </div>
                <div className="rounded-xl bg-slate-50/50 p-3.5 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850/50 space-y-1">
                  <p className="text-[8px] text-slate-400 uppercase font-black">Progress</p>
                  <p className="text-lg font-black text-slate-800 dark:text-slate-200">4</p>
                </div>
                <div className="rounded-xl bg-slate-50/50 p-3.5 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850/50 space-y-1">
                  <p className="text-[8px] text-slate-400 uppercase font-black">Done</p>
                  <p className="text-lg font-black text-slate-850 dark:text-slate-200">82%</p>
                </div>
              </div>

              {/* Task card mockups */}
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-200/50 border-l-[4px] border-l-rose-500 bg-white p-3.5 shadow-sm flex items-center justify-between dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="space-y-1 flex-1">
                    <div className="h-3.5 w-3/4 rounded bg-slate-100 dark:bg-slate-800"></div>
                    <div className="h-2.5 w-1/2 rounded bg-slate-100 dark:bg-slate-805"></div>
                  </div>
                  <span className="rounded bg-rose-50 px-2 py-0.5 text-[8px] font-bold text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">High</span>
                </div>
                <div className="rounded-2xl border border-slate-200/50 border-l-[4px] border-l-indigo-500 bg-white p-3.5 shadow-sm flex items-center justify-between dark:border-slate-800 dark:bg-slate-900/50 opacity-75">
                  <div className="space-y-1 flex-1">
                    <div className="h-3.5 w-2/3 rounded bg-slate-100 dark:bg-slate-800"></div>
                    <div className="h-2.5 w-1/3 rounded bg-slate-100 dark:bg-slate-805"></div>
                  </div>
                  <span className="rounded bg-indigo-50 px-2 py-0.5 text-[8px] font-bold text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Social Proof */}
      <section className="border-y border-slate-200/50 py-10 px-6 bg-white/30 dark:border-slate-800/50 dark:bg-[#0b0f19]/30 transition-colors">
        <div className="max-w-7xl mx-auto text-center space-y-5">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Trusted by teams at forward-thinking agencies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-50 dark:opacity-40">
            {/* Acmed Corp (Slack mock logo) */}
            <span className="text-sm font-black tracking-tight">SLACK</span>
            <span className="text-sm font-black tracking-tight">FIGMA</span>
            <span className="text-sm font-black tracking-tight">STRIPE</span>
            <span className="text-sm font-black tracking-tight">VERCEL</span>
            <span className="text-sm font-black tracking-tight">SHOPIFY</span>
          </div>
        </div>
      </section>

      {/* 4. Features Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-850 dark:text-slate-100 tracking-tight">
            Unlock Peak Workspace Efficiency
          </h2>
          <p className="text-xs text-slate-450 dark:text-slate-500 max-w-md mx-auto">
            Everything you need to orchestrate sprint targets, track milestones, and ship products.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 dark:border-slate-850/80 dark:bg-slate-900/50"
              >
                <div className={`rounded-xl p-2.5 w-fit ${f.color} mb-4`}>
                  <Icon size={18} />
                </div>
                <h4 className="text-base font-extrabold text-slate-850 dark:text-slate-150 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {f.title}
                </h4>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. How It Works */}
      <section id="how-it-works" className="py-20 px-6 border-t border-slate-200/40 dark:border-slate-800/40 bg-slate-50/50 dark:bg-[#0b0f19]/20 transition-colors">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-850 dark:text-slate-100 tracking-tight">
              Simplicity in Action
            </h2>
            <p className="text-xs text-slate-450 dark:text-slate-500 max-w-sm mx-auto">
              Get running in minutes with our clean onboarding lifecycle
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.num} className="rounded-3xl bg-white p-6 border border-slate-200/40 dark:bg-slate-900/50 dark:border-slate-850/60 relative space-y-4">
                <div className="text-3xl font-black bg-gradient-to-tr from-indigo-500 to-purple-500 bg-clip-text text-transparent opacity-35">
                  {s.num}
                </div>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  {s.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-850 dark:text-slate-100 tracking-tight">
            Trusted by the Product Builders
          </h2>
          <p className="text-xs text-slate-450 dark:text-slate-500 max-w-sm mx-auto">
            See what managers and developers say about TaskFlow workspaces
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/50 flex flex-col justify-between"
            >
              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed italic">
                "{t.comment}"
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-850/50">
                <div>
                  <h5 className="text-xs font-black text-slate-850 dark:text-slate-200">{t.name}</h5>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{t.role}</span>
                </div>
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={11} fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-xl"></div>
          
          <div className="relative z-10 space-y-6 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Start managing tasks like a pro today.
            </h2>
            <p className="text-xs text-indigo-100/90 leading-relaxed">
              Create your account in seconds, configure workflows, and boost productivity immediately with our intuitive Kanban analytics dashboard.
            </p>
            <button
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="rounded-xl bg-white px-6 py-3 text-xs font-bold text-indigo-700 shadow hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="border-t border-slate-200/50 py-12 px-6 bg-white dark:border-slate-800/80 dark:bg-[#0b0f19]/80 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="space-y-3.5 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white">
                <Layers size={15} />
              </div>
              <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                TaskFlow
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              Enterprise productivity workspace built with Node.js and React.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">Product</p>
            <a href="#features" className="block font-medium hover:text-indigo-600">Features</a>
            <a href="#how-it-works" className="block font-medium hover:text-indigo-600">Workflow</a>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">Company</p>
            <span className="block font-medium">Privacy Policy</span>
            <span className="block font-medium">Terms of Use</span>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">Contact</p>
            <span className="block font-medium text-slate-400">support@taskflow.dev</span>
            <p className="text-[10px] text-slate-400 mt-2">© 2026 TaskFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
