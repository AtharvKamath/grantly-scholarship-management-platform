import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Lock,
  Download,
  Trash2,
  CheckCircle2,
  Shield,
  Smartphone,
  Mail,
  RotateCcw,
} from 'lucide-react';

export const StudentSettingsPage: React.FC = () => {
  const { studentProfile, applications, showToast } = useApp();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPw || !newPw) {
      showToast('Please fill in password fields.', 'error');
      return;
    }
    if (newPw !== confirmPw) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    showToast('Password updated successfully (Demo Mode simulated).', 'success');
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
  };

  const exportData = () => {
    const payload = {
      exportDate: new Date().toISOString(),
      studentProfile,
      trackedApplications: applications,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grantly_profile_${studentProfile.fullName.replace(/\s+/g, '_')}.json`;
    a.click();
    showToast('Profile and applications exported successfully.', 'success');
  };

  const handleResetDemo = () => {
    if (confirm('Are you sure you want to reset demo data back to default initial values?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
          Preferences & Security
        </span>
        <h1 className="text-2xl font-extrabold text-[#142B4F] tracking-tight mt-1">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure deadline alerts, notification frequencies, and manage your stored data.
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#6546E8]" />
          <span>Notification & Deadline Alerts</span>
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800">Email Deadline Warnings</span>
              <p className="text-slate-500">Receive email alerts 7 days and 48 hours before official portal closure.</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => {
                setEmailAlerts(e.target.checked);
                showToast('Email preference updated', 'info');
              }}
              className="w-4 h-4 accent-[#6546E8]"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800">SMS / WhatsApp Verification Alerts</span>
              <p className="text-slate-500">Instant notification when college nodal officer approves your application.</p>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => {
                setSmsAlerts(e.target.checked);
                showToast('SMS preference updated', 'info');
              }}
              className="w-4 h-4 accent-[#6546E8]"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800">New AI Match Recommendations</span>
              <p className="text-slate-500">Notify me when a new scholarship matching my course and state is listed.</p>
            </div>
            <input
              type="checkbox"
              checked={inAppAlerts}
              onChange={(e) => {
                setInAppAlerts(e.target.checked);
                showToast('AI notification preference updated', 'info');
              }}
              className="w-4 h-4 accent-[#6546E8]"
            />
          </div>
        </div>
      </div>

      {/* Security: Password Simulator */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#6546E8]" />
          <span>Security Credentials</span>
        </h3>

        <form onSubmit={handlePasswordUpdate} className="space-y-3 max-w-md text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl transition-colors cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Data Management & Export */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Download className="w-4 h-4 text-[#6546E8]" />
          <span>Data Portability & Reset</span>
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed">
          Download a complete backup of your academic profile, saved scholarships, and application notes.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={exportData}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data (JSON)</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Storage to Initial Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
