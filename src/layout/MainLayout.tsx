import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Kanban,
  LayoutDashboard,
  BarChart3,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Search,
} from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { useThemeStore } from '../store/theme.store';
import { useBoardStore } from '../store/board.store';
import { NotificationBell } from '../components/NotificationBell';
import { Button } from '../components/Button';
import { SprintDeskLogo } from '../components/SprintDeskLogo';
import { clsx } from 'clsx';
import { useNotifications } from '../hooks/useNotifications';

export const MainLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const filters = useBoardStore((state) => state.filters);
  const setSearchQuery = useBoardStore((state) => state.setSearchQuery);
  const navigate = useNavigate();
  const location = useLocation();

  useNotifications(20000);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Sprint Board', path: '/board', icon: <Kanban className="w-5 h-5" /> },
    { label: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const mobileDrawerContent = isMobileMenuOpen ? (
    <div className="lg:hidden fixed inset-0 z-[9999] bg-slate-900/40 dark:bg-[#020B09]/85 backdrop-blur-md flex animate-fadeIn">
      <aside className="w-72 bg-white dark:bg-[#0A1513] text-[#1C1C1C] dark:text-white border-r border-slate-200/60 dark:border-white/10 h-full p-6 flex flex-col justify-between shadow-2xl animate-slideInLeft">
        <div>
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/10">
            <SprintDeskLogo iconSize={34} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
              className="w-8 h-8 p-0 rounded-full text-slate-500 dark:text-[#71717A]"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 pt-6">
            <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#8A8A8A] px-4 mb-2">
              Main Menu
            </p>
            {navItems.map((item) => {
              const isItemActive = location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-heading transition-all',
                    isItemActive
                      ? 'bg-[#1C1C1C] text-white font-bold shadow-md'
                      : 'text-[#8A8A8A] hover:bg-slate-100 dark:hover:bg-[#041F18] hover:text-[#1C1C1C] dark:hover:text-white font-medium'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile */}
        {user && (
          <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user.image}
                alt={user.firstName}
                className="w-9 h-9 rounded-full border border-slate-200 dark:border-[#00F5A0]/40 object-cover"
              />
              <div>
                <p className="text-xs font-bold text-[#1C1C1C] dark:text-white">{user.firstName} {user.lastName}</p>
                <p className="text-[10px] text-[#8A8A8A]">{user.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              title="Log out"
              className="w-8 h-8 p-0 text-[#8A8A8A] hover:text-[#EF4444]"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </aside>
      <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-[#F4F2EE] dark:bg-[#020B09] text-[#1C1C1C] dark:text-white flex flex-col relative selection:bg-[#728974] selection:text-white">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#0A1513]/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 px-4 lg:px-8 h-16 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-full text-[#8A8A8A] hover:text-[#1C1C1C] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#041F18] transition-colors"
            aria-label="Open mobile menu"
            title="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* New Custom Geometric Sunburst Logo */}
          <div onClick={() => navigate('/dashboard')} className="cursor-pointer">
            <SprintDeskLogo iconSize={36} />
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anything..."
              className="w-full h-10 pl-11 pr-4 text-xs bg-[#EFECE6] dark:bg-[#041F18] text-[#1C1C1C] dark:text-white rounded-full border border-transparent focus:border-[#728974] focus:ring-2 focus:ring-[#728974]/20 focus:outline-none transition-all placeholder:text-[#8A8A8A]"
            />
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          <NotificationBell />

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={`Switch theme to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="w-9 h-9 p-0 rounded-full text-[#8A8A8A] hover:text-[#728974] hover:bg-slate-100 dark:hover:bg-[#00F5A0]/10"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-[#00F5A0]" />
            ) : (
              <Moon className="w-5 h-5 text-[#8A8A8A]" />
            )}
          </Button>

          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-white/10">
              <img
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-9 h-9 rounded-full border border-slate-200 dark:border-[#00F5A0]/40 object-cover shadow-xs"
              />
              <span className="hidden lg:inline-block text-xs font-heading font-bold text-[#1C1C1C] dark:text-slate-200">
                {user.firstName} {user.lastName}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                title="Log out"
                aria-label="Log out"
                className="w-8 h-8 p-0 rounded-full text-[#8A8A8A] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden z-10">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-[#0A1513]/80 border-r border-slate-200/60 dark:border-white/10 p-5 shrink-0 justify-between backdrop-blur-xl transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <nav className="flex flex-col gap-2">
            <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#8A8A8A] px-4 mb-2">
              Main Menu
            </p>
            {navItems.map((item) => {
              const isItemActive = location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-3.5 px-4 py-3 rounded-full text-xs font-heading transition-all duration-200',
                    isItemActive
                      ? 'bg-[#1C1C1C] text-white font-bold shadow-md'
                      : 'text-[#8A8A8A] hover:bg-slate-50 dark:hover:bg-[#041F18] hover:text-[#1C1C1C] dark:hover:text-white font-medium border border-transparent'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Sidebar Active Sprint Summary Card */}
          <div className="p-5 rounded-3xl bg-[#EFECE6] dark:bg-[#041F18] border border-slate-200/40 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-heading font-bold text-[#1C1C1C] dark:text-white">Sprint 24 Control</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#728974] animate-pulse shadow-xs" />
            </div>
            <p className="text-[11px] text-[#8A8A8A] mb-3">
              Target: 30 Tasks (Ends Aug 27)
            </p>
            <div className="w-full bg-slate-200 dark:bg-[#0A1513] h-2 rounded-full overflow-hidden">
              <div className="bg-[#728974] h-full w-[65%] rounded-full shadow-xs" />
            </div>
          </div>
        </aside>

        {/* Portaled Mobile Navigation Drawer */}
        {typeof document !== 'undefined' && mobileDrawerContent ? createPortal(mobileDrawerContent, document.body) : null}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
