import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { Lock, Eye, EyeOff, Sparkles, Mail, User, Sun, Moon } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useThemeStore } from '../../store/theme.store';

export const SignUp: React.FC = () => {
  const [fullName, setFullName] = useState('Emily Johnson');
  const [email, setEmail] = useState('emily.johnson@example.com');
  const [password, setPassword] = useState('emilyspass');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'username' | 'phone'>('username');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    const success = await login('emilys', 'emilyspass');
    setIsSubmitting(false);

    if (success) {
      toast.success('Account created successfully! Welcome to SprintDesk.');
      navigate('/dashboard');
    }
  };

  const handleFillDemo = () => {
    setFullName('Emily Johnson');
    setEmail('emily.johnson@example.com');
    setPassword('emilyspass');
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F2EE] dark:bg-[#020B09] text-[#1C1C1C] dark:text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-[#728974] selection:text-white transition-colors">
      {/* Background Illumination */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-radial-emerald opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-glow-blob opacity-40 pointer-events-none" />

      {/* Theme Switcher Floating Action */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label={`Switch theme to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="w-10 h-10 p-0 rounded-full bg-white dark:bg-[#0A1513] text-[#8A8A8A] hover:text-[#728974] border border-slate-200/60 dark:border-white/10 shadow-soft"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-[#00F5A0]" />
          ) : (
            <Moon className="w-5 h-5 text-[#8A8A8A]" />
          )}
        </Button>
      </div>

      {/* Main Split Container */}
      <div className="w-full max-w-5xl bg-white dark:bg-[#050C0A] border border-slate-200/60 dark:border-white/10 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[580px] relative z-10 my-auto">
        
        {/* LEFT SIDE: Sage Green & Warm Beige Hero Panel */}
        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative bg-[#EFECE6] dark:bg-gradient-to-b dark:from-[#071410] dark:to-[#030A08] border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-white/10 overflow-hidden">
          {/* Top Headline */}
          <div className="relative z-10 space-y-1 mt-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight leading-none text-[#728974] dark:text-[#00F5A0] drop-shadow-xs dark:drop-shadow-[0_0_20px_rgba(0,245,160,0.3)]">
              LET’S CONNECT
            </h1>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight leading-none text-[#1C1C1C] dark:text-white">
              WITH OUR SPRINT
            </h2>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight leading-none text-[#8A8A8A] dark:text-[#71717A]/60">
              ECOSYSTEM
            </h2>
          </div>

          {/* Giant Bottom Watermark */}
          <div className="absolute bottom-0 left-6 select-none pointer-events-none opacity-10 dark:opacity-[0.06] font-heading font-extrabold text-8xl lg:text-9xl text-[#728974] dark:text-white tracking-widest leading-none">
            SPRINT
          </div>
        </div>

        {/* RIGHT SIDE: Form & Authentication */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between items-center bg-white dark:bg-[#050C0A]">
          <div className="w-full max-w-md my-auto space-y-5">
            {/* Heading */}
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#1C1C1C] dark:text-white tracking-tight">
                Create Account
              </h2>
              <p className="text-xs text-[#8A8A8A] dark:text-[#71717A]">
                Sign Up With Your Account To Start Explore Our Future Ecosystem
              </p>
            </div>

            {/* Form Card Box */}
            <div className="bg-[#F4F2EE] dark:bg-[#0A1513]/90 border border-slate-200/60 dark:border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-soft dark:shadow-2xl space-y-4">
              {/* Tab Selector Pills */}
              <div className="grid grid-cols-2 p-1 bg-white dark:bg-[#041F18]/80 border border-slate-200 dark:border-white/10 rounded-full text-xs font-heading font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('username')}
                  className={`py-2 rounded-full transition-all text-center ${
                    activeTab === 'username'
                      ? 'bg-[#1C1C1C] text-white shadow-xs dark:bg-[#0A1513] dark:text-[#00F5A0] dark:border dark:border-[#00F5A0]/40'
                      : 'text-[#8A8A8A] dark:text-[#71717A] hover:text-[#1C1C1C] dark:hover:text-white'
                  }`}
                >
                  Email account
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('phone')}
                  className={`py-2 rounded-full transition-all text-center ${
                    activeTab === 'phone'
                      ? 'bg-[#1C1C1C] text-white shadow-xs dark:bg-[#0A1513] dark:text-[#00F5A0] dark:border dark:border-[#00F5A0]/40'
                      : 'text-[#8A8A8A] dark:text-[#71717A] hover:text-[#1C1C1C] dark:hover:text-white'
                  }`}
                >
                  Phone number
                </button>
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full Name Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-heading font-semibold text-[#1C1C1C] dark:text-[#A1A1AA] block">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 absolute left-3.5 text-[#8A8A8A] dark:text-[#71717A]" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full h-10 pl-10 pr-4 text-xs bg-white dark:bg-[#041F18] text-[#1C1C1C] dark:text-white border border-slate-200 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#728974] focus:border-[#728974] transition-all placeholder:text-[#8A8A8A]"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-heading font-semibold text-[#1C1C1C] dark:text-[#A1A1AA] block">
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 absolute left-3.5 text-[#8A8A8A] dark:text-[#71717A]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email here"
                      className="w-full h-10 pl-10 pr-4 text-xs bg-white dark:bg-[#041F18] text-[#1C1C1C] dark:text-white border border-slate-200 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#728974] focus:border-[#728974] transition-all placeholder:text-[#8A8A8A]"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-heading font-semibold text-[#1C1C1C] dark:text-[#A1A1AA] block">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 absolute left-3.5 text-[#8A8A8A] dark:text-[#71717A]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 pl-10 pr-10 text-xs bg-white dark:bg-[#041F18] text-[#1C1C1C] dark:text-white border border-slate-200 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#728974] focus:border-[#728974] transition-all placeholder:text-[#8A8A8A]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-[#8A8A8A] dark:text-[#71717A] hover:text-[#728974] transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Sign Up CTA Button */}
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full h-10 rounded-full bg-[#728974] hover:bg-[#5E7160] text-white font-heading font-bold text-xs shadow-md border-none transition-all duration-200 mt-2"
                >
                  Create Account Now
                </Button>
              </form>

              {/* Demo Fill Helper Pill */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="inline-flex items-center gap-1.5 text-[11px] text-[#1C1C1C] dark:text-[#A1A1AA] hover:text-[#728974] transition-colors bg-white dark:bg-[#041F18] px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#728974] dark:text-[#00F5A0]" />
                  <span>Auto-fill Demo: <strong className="text-[#728974] dark:text-[#00F5A0]">Emily Johnson</strong></span>
                </button>
              </div>

              {/* Sign In Footer Prompt */}
              <div className="text-center pt-0.5 text-[11px] text-[#8A8A8A] dark:text-[#71717A]">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-[#728974] dark:text-[#00F5A0] hover:underline ml-1"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright Footer */}
          <div className="text-center pt-4 text-[10px] text-[#8A8A8A] dark:text-[#71717A]">
            Copyright © 2026 SprintDesk. All Rights Reserved.
          </div>
        </div>

      </div>
    </div>
  );
};
