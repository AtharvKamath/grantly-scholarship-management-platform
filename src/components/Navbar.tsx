import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, X, ArrowRight, UserCircle, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, currentView, navigateTo } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', view: 'home', path: '/' },
    { label: 'Explore Scholarships', view: 'explore', path: '/explore' },
    { label: 'How It Works', view: 'how-it-works', path: '/how-it-works' },
    { label: 'About', view: 'about', path: '/about' },
    { label: 'Contact', view: 'contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => navigateTo('home', '/')}
          className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#142B4F] flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-[#6546E8] transition-colors">
            G
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-[#142B4F]">GRANTLY</span>
            <span className="hidden sm:inline-block text-[11px] font-medium text-slate-500 ml-2 border-l border-slate-200 pl-2">
              Scholarship Platform
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => navigateTo(link.view, link.path)}
              className={`whitespace-nowrap transition-colors hover:text-[#142B4F] relative py-1 cursor-pointer ${
                currentView === link.view
                  ? 'text-[#142B4F] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#6546E8]'
                  : ''
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Auth Actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  user.role === 'admin'
                    ? navigateTo('admin-overview', '/admin/dashboard')
                    : navigateTo('dashboard', '/student/dashboard')
                }
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#1a3866] rounded-xl transition-all shadow-sm whitespace-nowrap cursor-pointer"
              >
                {user.role === 'admin' ? (
                  <Shield className="w-4 h-4 text-purple-300" />
                ) : (
                  <UserCircle className="w-4 h-4 text-purple-300" />
                )}
                <span>Go to {user.role === 'admin' ? 'Admin Hub' : 'My Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('login', '/login')}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-[#142B4F] transition-colors whitespace-nowrap cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigateTo('register', '/register')}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#6546E8] hover:bg-[#5337ca] rounded-xl transition-all shadow-sm whitespace-nowrap cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => {
                navigateTo(link.view, link.path);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                currentView === link.view
                  ? 'bg-purple-50 text-[#6546E8] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  if (user.role === 'admin') {
                    navigateTo('admin-overview', '/admin/dashboard');
                  } else {
                    navigateTo('dashboard', '/student/dashboard');
                  }
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#142B4F] rounded-xl"
              >
                <span>Open {user.role === 'admin' ? 'Admin Hub' : 'Student Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigateTo('login', '/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigateTo('register', '/register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#6546E8] rounded-xl"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
