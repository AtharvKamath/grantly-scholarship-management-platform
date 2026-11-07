import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Shield,
  Server,
  Database,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { showToast } = useApp();

  const [portalOpen, setPortalOpen] = useState(true);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [requireAadhaar, setRequireAadhaar] = useState(true);
  const [autoVerifyGovt, setAutoVerifyGovt] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Platform governance policies saved successfully.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
          System Governance
        </span>
        <h1 className="text-2xl font-extrabold text-[#142B4F] tracking-tight mt-1">
          Platform Architecture & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor system health, AI server integration, database persistence layer, and student registration policies.
        </p>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>AI Model Engine</span>
            <Cpu className="w-4 h-4 text-[#6546E8]" />
          </div>
          <p className="text-sm font-bold text-slate-900">Google Gemini 3.8 Flash</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Server Proxy Active</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Data Storage Layer</span>
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-sm font-bold text-slate-900">LocalStorage Demo State</p>
          <div className="flex items-center gap-1.5 text-xs text-purple-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Firebase Ready Architecture</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>API Key Security</span>
            <Shield className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-sm font-bold text-slate-900">Zero Client Exposure</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Server-side /api/ai/*</span>
          </div>
        </div>
      </div>

      {/* Policies Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#6546E8]" />
          <span>Institutional Policies & Controls</span>
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800">Public Portal Availability</span>
              <p className="text-slate-500">Allow students to discover and check scholarship eligibility.</p>
            </div>
            <input
              type="checkbox"
              checked={portalOpen}
              onChange={(e) => setPortalOpen(e.target.checked)}
              className="w-4 h-4 accent-[#6546E8]"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800">New Student Registrations</span>
              <p className="text-slate-500">Permit new applicants to register and create academic profiles.</p>
            </div>
            <input
              type="checkbox"
              checked={allowRegistration}
              onChange={(e) => setAllowRegistration(e.target.checked)}
              className="w-4 h-4 accent-[#6546E8]"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800">Enforce Aadhaar Seeding Check</span>
              <p className="text-slate-500">Flag alert if candidate bank account is not linked to NPCI mapper.</p>
            </div>
            <input
              type="checkbox"
              checked={requireAadhaar}
              onChange={(e) => setRequireAadhaar(e.target.checked)}
              className="w-4 h-4 accent-[#6546E8]"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800">Automated Central NSP Sync</span>
              <p className="text-slate-500">Poll National Scholarship Portal for updated e-attestation deadlines.</p>
            </div>
            <input
              type="checkbox"
              checked={autoVerifyGovt}
              onChange={(e) => setAutoVerifyGovt(e.target.checked)}
              className="w-4 h-4 accent-[#6546E8]"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl transition-colors cursor-pointer"
          >
            Save Administrative Policies
          </button>
        </div>
      </form>
    </div>
  );
};
