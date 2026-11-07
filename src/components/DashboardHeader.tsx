import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Menu,
  ChevronRight,
  X,
  ExternalLink,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const DashboardHeader: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    user,
    currentView,
    setCurrentView,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsAIAssistantOpen,
    setSelectedScholarshipId,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  // Format breadcrumb text
  const getViewTitle = (view: string) => {
    switch (view) {
      case 'dashboard':
        return 'Student Overview';
      case 'profile':
        return 'My Academic Profile';
      case 'discover':
        return 'Scholarship Discovery';
      case 'ai-recommendations':
        return 'AI Scholarship Recommendations';
      case 'eligibility':
        return 'Eligibility Checker';
      case 'saved':
        return 'Saved Scholarships';
      case 'applications':
        return 'Application Tracker';
      case 'calendar':
        return 'Deadline Calendar & Reminders';
      case 'documents':
        return 'Document Vault';
      case 'ai-assistant':
        return 'GRANTLY AI Assistant';
      case 'settings':
        return 'Account & Preferences';
      case 'admin-overview':
        return 'Executive Overview';
      case 'admin-scholarships':
        return 'Manage Scholarship Catalog';
      case 'admin-students':
        return 'Registered Students';
      case 'admin-applications':
        return 'Application Review Pipeline';
      case 'admin-documents':
        return 'Verification Audits';
      case 'admin-reports':
        return 'Reports & Disbursements';
      case 'admin-settings':
        return 'Platform Governance';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>{user?.role === 'admin' ? 'Admin Portal' : 'Student Portal'}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">{getViewTitle(currentView)}</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Quick AI Advisor trigger */}
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#6546E8] bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200/60"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#6546E8]" />
          <span>Ask AI Advisor</span>
        </button>

        {/* Notifications dropdown button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                  {unreadNotificationCount > 0 && (
                    <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full">
                      {unreadNotificationCount} new
                    </span>
                  )}
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-[#6546E8] hover:underline font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">No notifications at this time.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.link) {
                          setSelectedScholarshipId(n.link);
                          setShowNotifications(false);
                        }
                      }}
                      className={`py-3 px-2 rounded-lg cursor-pointer transition-colors ${
                        !n.read ? 'bg-purple-50/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {n.type === 'deadline' && (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        )}
                        {n.type === 'status' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        )}
                        {n.type === 'match' && (
                          <Sparkles className="w-4 h-4 text-[#6546E8] shrink-0 mt-0.5" />
                        )}
                        {n.type === 'system' && (
                          <Bell className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}

                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${!n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {n.title}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#142B4F] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="hidden lg:block text-left">
            <span className="block text-xs font-bold text-slate-900 truncate max-w-[120px]">
              {user?.fullName || 'User'}
            </span>
            <span className="block text-[10px] text-slate-500 capitalize">{user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
