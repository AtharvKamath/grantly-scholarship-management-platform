import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  User,
  Compass,
  Sparkles,
  Bookmark,
  FileText,
  Calendar,
  Settings,
  LogOut,
  Users,
  BarChart3,
  Globe,
  Bot,
} from 'lucide-react';

interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  highlight?: boolean;
}

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const DashboardSidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const {
    user,
    currentView,
    navigateTo,
    logout,
    savedScholarshipIds,
    applications,
    profileCompletionPercentage,
  } = useApp();

  const isStudent = user?.role === 'student';

  // Strict Student Navigation:
  // - Dashboard
  // - My Profile
  // - Discover Scholarships
  // - AI Recommendations (Feature 1)
  // - GRANTLY AI Assistant (Feature 2)
  // - Saved Scholarships
  // - My Applications
  // - Deadline Calendar
  // - Settings
  // - Logout
  const studentNav: NavItem[] = [
    { id: 'dashboard', path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', path: '/student/profile', label: 'My Profile', icon: User, badge: `${profileCompletionPercentage}%` },
    { id: 'discover', path: '/student/discover', label: 'Discover Scholarships', icon: Compass },
    { id: 'ai-recommendations', path: '/student/recommendations', label: 'AI Recommendations', icon: Sparkles, highlight: true },
    { id: 'ai-assistant', path: '/student/assistant', label: 'GRANTLY AI Assistant', icon: Bot },
    { id: 'saved', path: '/student/saved', label: 'Saved Scholarships', icon: Bookmark, badge: savedScholarshipIds.length > 0 ? savedScholarshipIds.length : undefined },
    { id: 'applications', path: '/student/applications', label: 'My Applications', icon: FileText, badge: applications.length > 0 ? applications.length : undefined },
    { id: 'calendar', path: '/student/calendar', label: 'Deadline Calendar', icon: Calendar },
    { id: 'settings', path: '/student/settings', label: 'Settings', icon: Settings },
  ];

  // Strict Admin Navigation:
  // - Overview
  // - Manage Scholarships
  // - Manage Students
  // - Manage Applications
  // - Reports and Analytics
  // - Settings
  // - Logout
  const adminNav: NavItem[] = [
    { id: 'admin-overview', path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin-scholarships', path: '/admin/scholarships', label: 'Manage Scholarships', icon: Compass },
    { id: 'admin-students', path: '/admin/students', label: 'Manage Students', icon: Users },
    { id: 'admin-applications', path: '/admin/applications', label: 'Manage Applications', icon: FileText },
    { id: 'admin-reports', path: '/admin/reports', label: 'Reports and Analytics', icon: BarChart3 },
    { id: 'admin-settings', path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const navItems = isStudent ? studentNav : adminNav;

  return (
    <aside className="w-68 bg-[#142B4F] text-slate-200 flex flex-col h-screen sticky top-0 border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <button
          onClick={() => navigateTo('home', '/')}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#6546E8] flex items-center justify-center text-white font-bold text-base shadow-sm">
            G
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">GRANTLY</span>
            <span className="block text-[10px] text-purple-300 font-medium">
              {isStudent ? 'Student Workspace' : 'Administrator Portal'}
            </span>
          </div>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {isStudent ? 'Student Navigation' : 'Admin Navigation'}
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                navigateTo(item.id, item.path);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#6546E8] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? 'text-white'
                      : item.highlight
                      ? 'text-purple-400'
                      : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md tabular-nums ${
                    isActive
                      ? 'bg-purple-900/60 text-purple-100'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info & Logout (Strictly NO Switch Profile Button) */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <button
          onClick={() => {
            navigateTo('home', '/');
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Globe className="w-4 h-4" />
          <span>Back to Public Website</span>
        </button>

        <button
          onClick={() => {
            logout();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
