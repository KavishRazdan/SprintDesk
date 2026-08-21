import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { Lock, Eye, EyeOff, Sparkles, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'username' | 'phone'>('username');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsSubmitting(true);
    const success = await login(username, password);
    setIsSubmitting(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  const handleFillDemo = () => {
    setUsername('emilys');
    setPassword('emilyspass');
  };

  return (
    <div className="w-full min-h-screen bg-[#020B09] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-[#00F5A0] selection:text-[#020B09]">
      {/* Background Radial Emerald Illumination */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-radial-emerald opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-glow-blob opacity-40 pointer-events-none" />

      {/* Main Split Container */}
      <div className="w-full max-w-5xl bg-[#050C0A] border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[580px] relative z-10 my-auto">
        
        {/* LEFT SIDE: Futuristic Typography & Watermark */}
        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative bg-gradient-to-b from-[#071410] to-[#030A08] border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
          {/* Top Headline */}
          <div className="relative z-10 space-y-1 mt-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight leading-none text-[#00F5A0] drop-shadow-[0_0_20px_rgba(0,245,160,0.3)]">
              LET’S CONNECT
            </h1>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight leading-none text-white">
              WITH OUR SPRINT
            </h2>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight leading-none text-[#71717A]/60">
              ECOSYSTEM
            </h2>
          </div>

          {/* Giant Bottom Watermark */}
          <div className="absolute bottom-0 left-6 select-none pointer-events-none opacity-[0.06] font-heading font-extrabold text-8xl lg:text-9xl text-white tracking-widest leading-none">
            SPRINT
          </div>
        </div>

        {/* RIGHT SIDE: Form & Authentication */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between items-center bg-[#050C0A]">
          <div className="w-full max-w-md my-auto space-y-5">
            {/* Heading */}
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs text-[#71717A]">
                Sign Up With Your Account To Start Explore Our Future Ecosystem
              </p>
            </div>

            {/* Form Card Box */}
            <div className="bg-[#0A1513]/90 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-4">
              {/* Tab Selector Pills */}
              <div className="grid grid-cols-2 p-1 bg-[#041F18]/80 border border-white/10 rounded-full text-xs font-heading font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('username')}
                  className={`py-2 rounded-full transition-all text-center ${
                    activeTab === 'username'
                      ? 'bg-[#0A1513] text-[#00F5A0] border border-[#00F5A0]/40 shadow-[0_0_15px_rgba(0,245,160,0.2)]'
                      : 'text-[#71717A] hover:text-white'
                  }`}
                >
                  Email account
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('phone')}
                  className={`py-2 rounded-full transition-all text-center ${
                    activeTab === 'phone'
                      ? 'bg-[#0A1513] text-[#00F5A0] border border-[#00F5A0]/40 shadow-[0_0_15px_rgba(0,245,160,0.2)]'
                      : 'text-[#71717A] hover:text-white'
                  }`}
                >
                  Phone number
                </button>
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-heading font-semibold text-[#A1A1AA] block">
                    Email or Username
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 absolute left-3.5 text-[#71717A]" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your email or username here"
                      className="w-full h-10 pl-10 pr-4 text-xs bg-[#041F18] text-white border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00F5A0] focus:border-[#00F5A0] transition-all placeholder:text-[#71717A]"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-heading font-semibold text-[#A1A1AA] block">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 absolute left-3.5 text-[#71717A]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 pl-10 pr-10 text-xs bg-[#041F18] text-white border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00F5A0] focus:border-[#00F5A0] transition-all placeholder:text-[#71717A]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-[#71717A] hover:text-[#00F5A0] transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex items-center justify-end text-[11px]">
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="font-semibold text-[#00F5A0] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Sign In CTA Button */}
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full h-10 rounded-full bg-gradient-to-r from-[#00F5A0] to-[#22C55E] hover:from-[#00F5A0] hover:to-[#00F5A0] text-[#020B09] font-heading font-extrabold text-xs shadow-[0_0_20px_rgba(0,245,160,0.35)] hover:shadow-[0_0_30px_rgba(0,245,160,0.5)] border-none transition-all duration-200"
                >
                  Sign In Now
                </Button>
              </form>

              {/* Demo Fill Helper Pill */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="inline-flex items-center gap-1.5 text-[11px] text-[#A1A1AA] hover:text-white transition-colors bg-[#041F18] px-3 py-1 rounded-full border border-white/10"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00F5A0]" />
                  <span>Auto-fill Demo: <strong className="text-[#00F5A0]">emilys / emilyspass</strong></span>
                </button>
              </div>

              {/* Sign Up Footer Prompt */}
              <div className="text-center pt-0.5 text-[11px] text-[#71717A]">
                Don’t have access yet?{' '}
                <Link
                  to="/signup"
                  className="font-bold text-[#00F5A0] hover:underline ml-1"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright Footer */}
          <div className="text-center pt-4 text-[10px] text-[#71717A]">
            Copyright © 2026 SprintDesk. All Rights Reserved.
          </div>
        </div>

      </div>
    </div>
  );
};
