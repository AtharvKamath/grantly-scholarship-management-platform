import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  StudentProfile,
  Scholarship,
  ApplicationRecord,
  DocumentItem,
  NotificationItem,
  ApplicationStatus,
} from '../types';
import {
  INITIAL_SCHOLARSHIPS,
  INITIAL_STUDENT_PROFILE,
  INITIAL_APPLICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/scholarships';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  setStudentProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  loginStudent: (email: string, password?: string) => void;
  loginAdmin: (email: string, password?: string) => void;
  loginAsStudent: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
  registerUser: (name: string, email: string, role?: 'student' | 'admin') => void;
  navigateTo: (view: string, path?: string) => void;

  // Student Profile
  studentProfile: StudentProfile;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  profileCompletionPercentage: number;

  // Scholarships
  scholarships: Scholarship[];
  addScholarship: (scholarship: Omit<Scholarship, 'id' | 'createdAt'>) => void;
  updateScholarship: (id: string, scholarship: Partial<Scholarship>) => void;
  deleteScholarship: (id: string) => void;
  toggleVerifyScholarship: (id: string) => void;

  // Saved Scholarships
  savedScholarshipIds: string[];
  toggleSaveScholarship: (id: string) => void;
  isScholarshipSaved: (id: string) => boolean;

  // Applications
  applications: ApplicationRecord[];
  addApplication: (scholarshipId: string, status?: ApplicationStatus, notes?: string) => void;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus, notes?: string) => void;
  deleteApplication: (applicationId: string) => void;

  // Documents
  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadedAt' | 'studentId' | 'status'>) => void;
  deleteDocument: (documentId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationCount: number;

  // Navigation
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedScholarshipId: string | null;
  setSelectedScholarshipId: (id: string | null) => void;

  // AI Assistant Drawer
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;

  // Toast System
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User state
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('grantly_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    // Default logged in as demo student for immediate hackathon review
    return {
      id: 'user-001',
      fullName: 'Atharv Kulkarni',
      email: 'atharv.kulkarni@student.edu',
      role: 'student',
      createdAt: '2026-08-01',
    };
  });

  // Profile state
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('grantly_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_STUDENT_PROFILE;
  });

  // Scholarships state
  const [scholarships, setScholarships] = useState<Scholarship[]>(() => {
    const saved = localStorage.getItem('grantly_scholarships');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_SCHOLARSHIPS;
  });

  // Saved scholarships IDs
  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('grantly_saved_ids');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return ['sch-001', 'sch-003', 'sch-011'];
  });

  // Applications
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    const saved = localStorage.getItem('grantly_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_APPLICATIONS;
  });

  // Documents
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('grantly_documents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_DOCUMENTS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('grantly_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Initial view determined by URL path
  const [currentView, setCurrentView] = useState<string>(() => {
    const path = window.location.pathname.toLowerCase();
    if (path === '/' || path === '') return 'home';
    if (path === '/explore') return 'explore';
    if (path === '/how-it-works') return 'how-it-works';
    if (path === '/about') return 'about';
    if (path === '/contact') return 'contact';
    if (path === '/login') return 'login';
    if (path === '/register') return 'register';
    if (path === '/admin/login' || path === '/admin-login') return 'admin-login';
    if (path.startsWith('/student/')) {
      const sub = path.replace('/student/', '');
      if (sub === 'dashboard') return 'dashboard';
      if (sub === 'profile') return 'profile';
      if (sub === 'discover') return 'discover';
      if (sub === 'recommendations' || sub === 'ai-recommendations') return 'ai-recommendations';
      if (sub === 'assistant' || sub === 'ai-assistant') return 'ai-assistant';
      if (sub === 'saved') return 'saved';
      if (sub === 'applications') return 'applications';
      if (sub === 'calendar') return 'calendar';
      if (sub === 'settings') return 'settings';
      return 'dashboard';
    }
    if (path.startsWith('/admin/')) {
      const sub = path.replace('/admin/', '');
      if (sub === 'dashboard' || sub === 'overview') return 'admin-overview';
      if (sub === 'scholarships') return 'admin-scholarships';
      if (sub === 'students') return 'admin-students';
      if (sub === 'applications') return 'admin-applications';
      if (sub === 'reports') return 'admin-reports';
      if (sub === 'settings') return 'admin-settings';
      return 'admin-overview';
    }
    return 'home';
  });

  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string | null>(null);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/' || path === '') setCurrentView('home');
      else if (path === '/explore') setCurrentView('explore');
      else if (path === '/how-it-works') setCurrentView('how-it-works');
      else if (path === '/about') setCurrentView('about');
      else if (path === '/contact') setCurrentView('contact');
      else if (path === '/login') setCurrentView('login');
      else if (path === '/register') setCurrentView('register');
      else if (path === '/admin/login') setCurrentView('admin-login');
      else if (path.startsWith('/student/')) {
        const sub = path.replace('/student/', '');
        if (sub === 'dashboard') setCurrentView('dashboard');
        else if (sub === 'profile') setCurrentView('profile');
        else if (sub === 'discover') setCurrentView('discover');
        else if (sub === 'recommendations' || sub === 'ai-recommendations') setCurrentView('ai-recommendations');
        else if (sub === 'assistant' || sub === 'ai-assistant') setCurrentView('ai-assistant');
        else if (sub === 'saved') setCurrentView('saved');
        else if (sub === 'applications') setCurrentView('applications');
        else if (sub === 'calendar') setCurrentView('calendar');
        else if (sub === 'settings') setCurrentView('settings');
      } else if (path.startsWith('/admin/')) {
        const sub = path.replace('/admin/', '');
        if (sub === 'dashboard') setCurrentView('admin-overview');
        else if (sub === 'scholarships') setCurrentView('admin-scholarships');
        else if (sub === 'students') setCurrentView('admin-students');
        else if (sub === 'applications') setCurrentView('admin-applications');
        else if (sub === 'reports') setCurrentView('admin-reports');
        else if (sub === 'settings') setCurrentView('admin-settings');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // LocalStorage sync
  useEffect(() => {
    if (user) {
      localStorage.setItem('grantly_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('grantly_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('grantly_profile', JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem('grantly_scholarships', JSON.stringify(scholarships));
  }, [scholarships]);

  useEffect(() => {
    localStorage.setItem('grantly_saved_ids', JSON.stringify(savedScholarshipIds));
  }, [savedScholarshipIds]);

  useEffect(() => {
    localStorage.setItem('grantly_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('grantly_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('grantly_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // URL pathname sync helper
  const navigateTo = (view: string, path?: string) => {
    setCurrentView(view);
    const targetPath = path || (
      view === 'home' ? '/' :
      view === 'explore' ? '/explore' :
      view === 'how-it-works' ? '/how-it-works' :
      view === 'about' ? '/about' :
      view === 'contact' ? '/contact' :
      view === 'login' ? '/login' :
      view === 'register' ? '/register' :
      view === 'admin-login' ? '/admin/login' :
      view === 'dashboard' ? '/student/dashboard' :
      view === 'profile' ? '/student/profile' :
      view === 'discover' ? '/student/discover' :
      view === 'ai-recommendations' ? '/student/recommendations' :
      view === 'ai-assistant' ? '/student/assistant' :
      view === 'saved' ? '/student/saved' :
      view === 'applications' ? '/student/applications' :
      view === 'calendar' ? '/student/calendar' :
      view === 'settings' ? '/student/settings' :
      view === 'admin-overview' ? '/admin/dashboard' :
      view === 'admin-scholarships' ? '/admin/scholarships' :
      view === 'admin-students' ? '/admin/students' :
      view === 'admin-applications' ? '/admin/applications' :
      view === 'admin-reports' ? '/admin/reports' :
      view === 'admin-settings' ? '/admin/settings' :
      `/${view}`
    );
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  // Auth Helpers
  const loginStudent = (email: string, _password?: string) => {
    const studentUser: User = {
      id: `std-${Date.now().toString().slice(-4)}`,
      fullName: studentProfile.fullName || 'Student Scholar',
      email: email.trim(),
      role: 'student',
      createdAt: new Date().toISOString(),
    };
    setUser(studentUser);
    setStudentProfile((prev) => ({
      ...prev,
      email: email.trim(),
      fullName: prev.fullName || 'Student Scholar',
    }));
    navigateTo('dashboard', '/student/dashboard');
    showToast(`Signed in to Student Portal as ${email}`, 'success');
  };

  const loginAdmin = (email: string, _password?: string) => {
    const adminUser: User = {
      id: `adm-${Date.now().toString().slice(-4)}`,
      fullName: 'System Administrator',
      email: email.trim(),
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    setUser(adminUser);
    navigateTo('admin-overview', '/admin/dashboard');
    showToast(`Administrator authenticated successfully (${email})`, 'success');
  };

  // Backwards compatibility aliases if components still reference loginAsStudent/loginAsAdmin
  const loginAsStudent = () => loginStudent('student@grantly.edu');
  const loginAsAdmin = () => loginAdmin('admin@grantly.edu');

  const logout = () => {
    setUser(null);
    navigateTo('home', '/');
    showToast('Signed out of GRANTLY session', 'info');
  };

  const registerUser = (name: string, email: string, role: 'student' | 'admin' = 'student') => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: name.trim(),
      email: email.trim(),
      role,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    if (role === 'admin') {
      navigateTo('admin-overview', '/admin/dashboard');
    } else {
      setStudentProfile((prev) => ({
        ...prev,
        fullName: name.trim(),
        email: email.trim(),
      }));
      navigateTo('dashboard', '/student/dashboard');
    }
    showToast(`Welcome to GRANTLY, ${name}! Your account has been created.`, 'success');
  };

  // Profile update
  const updateStudentProfile = (newFields: Partial<StudentProfile>) => {
    setStudentProfile((prev) => ({
      ...prev,
      ...newFields,
    }));
    showToast('Profile information saved and updated successfully', 'success');
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = (): number => {
    const requiredKeys: (keyof StudentProfile)[] = [
      'fullName',
      'email',
      'phone',
      'dob',
      'state',
      'district',
      'collegeName',
      'educationLevel',
      'course',
      'currentYear',
      'cgpa',
      'annualIncome',
      'category',
    ];
    let filled = 0;
    requiredKeys.forEach((key) => {
      const val = studentProfile[key];
      if (val !== undefined && val !== null && val !== '') {
        filled += 1;
      }
    });
    return Math.round((filled / requiredKeys.length) * 100);
  };

  const profileCompletionPercentage = calculateProfileCompletion();

  // Scholarship actions
  const addScholarship = (newSch: Omit<Scholarship, 'id' | 'createdAt'>) => {
    const created: Scholarship = {
      ...newSch,
      id: `sch-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setScholarships((prev) => [created, ...prev]);
    showToast(`Scholarship "${created.name}" added to catalog`, 'success');
  };

  const updateScholarship = (id: string, updated: Partial<Scholarship>) => {
    setScholarships((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
    showToast('Scholarship updated successfully', 'success');
  };

  const deleteScholarship = (id: string) => {
    const toDelete = scholarships.find((s) => s.id === id);
    setScholarships((prev) => prev.filter((s) => s.id !== id));
    showToast(`Scholarship "${toDelete?.name || id}" removed`, 'info');
  };

  const toggleVerifyScholarship = (id: string) => {
    setScholarships((prev) =>
      prev.map((s) => (s.id === id ? { ...s, verified: !s.verified } : s))
    );
    showToast('Verification status updated', 'success');
  };

  // Saved scholarships
  const toggleSaveScholarship = (id: string) => {
    setSavedScholarshipIds((prev) => {
      if (prev.includes(id)) {
        showToast('Scholarship removed from your saved list', 'info');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Scholarship saved to your bookmarks!', 'success');
        return [...prev, id];
      }
    });
  };

  const isScholarshipSaved = (id: string) => savedScholarshipIds.includes(id);

  // Applications
  const addApplication = (scholarshipId: string, status: ApplicationStatus = 'Interested', notes?: string) => {
    const sch = scholarships.find((s) => s.id === scholarshipId);
    if (!sch) return;

    // Check if already in applications
    const existing = applications.find((a) => a.scholarshipId === scholarshipId);
    if (existing) {
      showToast(`Already tracked in your applications with status: ${existing.status}`, 'info');
      return;
    }

    const newApp: ApplicationRecord = {
      id: `app-${Date.now()}`,
      studentId: user?.id || 'user-001',
      scholarshipId: sch.id,
      scholarshipName: sch.name,
      organization: sch.organization,
      amount: sch.amount,
      amountDisplay: sch.amountDisplay,
      status,
      appliedDate: new Date().toISOString().split('T')[0],
      deadline: sch.deadline,
      notes: notes || 'Tracking on GRANTLY.',
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setApplications((prev) => [newApp, ...prev]);
    showToast(`Added "${sch.name}" to your application tracker (${status})`, 'success');
  };

  const updateApplicationStatus = (applicationId: string, status: ApplicationStatus, notes?: string) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              status,
              notes: notes !== undefined ? notes : a.notes,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : a
      )
    );
    showToast(`Application status updated to "${status}"`, 'success');
  };

  const deleteApplication = (applicationId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== applicationId));
    showToast('Application record removed', 'info');
  };

  // Documents
  const addDocument = (doc: Omit<DocumentItem, 'id' | 'uploadedAt' | 'studentId' | 'status'>) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      studentId: user?.id || 'user-001',
      status: 'Verified',
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setDocuments((prev) => [newDoc, ...prev]);
    showToast(`Document "${newDoc.documentName}" uploaded securely`, 'success');
  };

  const deleteDocument = (documentId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== documentId));
    showToast('Document removed from your vault', 'info');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        setStudentProfile,
        loginStudent,
        loginAdmin,
        loginAsStudent,
        loginAsAdmin,
        logout,
        registerUser,
        navigateTo,
        studentProfile,
        updateStudentProfile,
        profileCompletionPercentage,
        scholarships,
        addScholarship,
        updateScholarship,
        deleteScholarship,
        toggleVerifyScholarship,
        savedScholarshipIds,
        toggleSaveScholarship,
        isScholarshipSaved,
        applications,
        addApplication,
        updateApplicationStatus,
        deleteApplication,
        documents,
        addDocument,
        deleteDocument,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationCount,
        currentView,
        setCurrentView,
        selectedScholarshipId,
        setSelectedScholarshipId,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
