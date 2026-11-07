import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/ToastContainer';
import { Navbar } from './components/Navbar';
import { DashboardSidebar } from './components/DashboardSidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { ScholarshipDetailModal } from './components/ScholarshipDetailModal';
import { AIAssistantWidget } from './components/AIAssistantWidget';

// Public pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuthPage } from './pages/AuthPage';

// Student Dashboard pages
import { StudentOverview } from './pages/student/StudentOverview';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { AIRecommendationsPage } from './pages/student/AIRecommendationsPage';
import { GrantlyAIAssistantPage } from './pages/student/GrantlyAIAssistantPage';
import { SavedScholarshipsPage } from './pages/student/SavedScholarshipsPage';
import { ApplicationsTrackerPage } from './pages/student/ApplicationsTrackerPage';
import { DeadlineCalendarPage } from './pages/student/DeadlineCalendarPage';
import { StudentSettingsPage } from './pages/student/StudentSettingsPage';

// Admin Dashboard pages
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminScholarships } from './pages/admin/AdminScholarships';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminApplications } from './pages/admin/AdminApplications';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';

import { Shield, Lock } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, currentView, navigateTo } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const publicViews = ['home', 'explore', 'how-it-works', 'about', 'contact'];
  const isPublic = publicViews.includes(currentView);

  // Strict Role-Based Authorization
  const isAdminView = currentView.startsWith('admin-') && currentView !== 'admin-login';
  const isStudentView = [
    'dashboard',
    'profile',
    'discover',
    'ai-recommendations',
    'ai-assistant',
    'saved',
    'applications',
    'calendar',
    'settings',
  ].includes(currentView);

  // If user is logged in as student and attempts to access admin pages -> 403 Forbidden
  const isForbiddenAdminAccess = isAdminView && user?.role !== 'admin';

  // If user is logged in as admin and attempts to access student dashboard -> direct to admin hub
  const isForbiddenStudentAccess = isStudentView && user?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col font-sans">
      {/* Global Toast Feedback */}
      <ToastContainer />

      {/* Global Scholarship Details Modal */}
      <ScholarshipDetailModal />

      {/* Redesigned 48px Floating GRANTLY AI Assistant */}
      <AIAssistantWidget />

      {/* Route Rendering */}
      {isPublic ? (
        <>
          <Navbar />
          <main className="flex-1">
            {currentView === 'home' && <HomePage />}
            {currentView === 'explore' && <ExplorePage />}
            {currentView === 'how-it-works' && <HowItWorksPage />}
            {currentView === 'about' && <AboutPage />}
            {currentView === 'contact' && <ContactPage />}
          </main>
        </>
      ) : currentView === 'login' ? (
        <AuthPage initialMode="login" />
      ) : currentView === 'register' ? (
        <AuthPage initialMode="register" />
      ) : currentView === 'admin-login' ? (
        <AuthPage initialMode="admin-login" />
      ) : (
        /* Authenticated Dashboard View */
        <div className="flex-1 flex min-h-screen">
          {/* Desktop Left Sidebar */}
          <div className="hidden md:block">
            <DashboardSidebar />
          </div>

          {/* Mobile Slide-over Sidebar Drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex">
              <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="relative z-10">
                <DashboardSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          )}

          {/* Right Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <DashboardHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {/* 403 Forbidden Access Guard for Admin Views */}
              {isForbiddenAdminAccess ? (
                <div className="bg-white rounded-2xl p-8 border border-rose-200 text-center space-y-4 max-w-md mx-auto my-12 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">403 Forbidden - Access Denied</h2>
                  <p className="text-xs text-slate-600">
                    Administrator credentials are required to view this portal. You are signed in as a student ({user?.email}).
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                    <button
                      onClick={() => navigateTo('dashboard', '/student/dashboard')}
                      className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      Return to Student Dashboard
                    </button>
                    <button
                      onClick={() => navigateTo('admin-login', '/admin/login')}
                      className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl transition-colors cursor-pointer"
                    >
                      Admin Sign In
                    </button>
                  </div>
                </div>
              ) : isForbiddenStudentAccess ? (
                <div className="bg-white rounded-2xl p-8 border border-amber-200 text-center space-y-4 max-w-md mx-auto my-12 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Administrator Session Active</h2>
                  <p className="text-xs text-slate-600">
                    You are currently logged into the Administrator Hub. Student features are reserved for verified student accounts.
                  </p>
                  <button
                    onClick={() => navigateTo('admin-overview', '/admin/dashboard')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl transition-colors cursor-pointer"
                  >
                    Return to Administrator Hub
                  </button>
                </div>
              ) : (
                <>
                  {/* Student Views */}
                  {currentView === 'dashboard' && <StudentOverview />}
                  {currentView === 'profile' && <StudentProfilePage />}
                  {currentView === 'discover' && <ExplorePage />}
                  {currentView === 'ai-recommendations' && <AIRecommendationsPage />}
                  {currentView === 'ai-assistant' && <GrantlyAIAssistantPage />}
                  {currentView === 'saved' && <SavedScholarshipsPage />}
                  {currentView === 'applications' && <ApplicationsTrackerPage />}
                  {currentView === 'calendar' && <DeadlineCalendarPage />}
                  {currentView === 'settings' && <StudentSettingsPage />}

                  {/* Admin Views */}
                  {currentView === 'admin-overview' && <AdminOverview />}
                  {currentView === 'admin-scholarships' && <AdminScholarships />}
                  {currentView === 'admin-students' && <AdminStudents />}
                  {currentView === 'admin-applications' && <AdminApplications />}
                  {currentView === 'admin-reports' && <AdminReports />}
                  {currentView === 'admin-settings' && <AdminSettings />}
                </>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
