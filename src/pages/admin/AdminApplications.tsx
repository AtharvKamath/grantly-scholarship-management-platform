import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ExternalLink,
  Edit3,
  X,
  User,
  ShieldCheck,
} from 'lucide-react';
import { ApplicationStatus, ApplicationRecord } from '../../types';

export const AdminApplications: React.FC = () => {
  const { applications, updateApplicationStatus, setSelectedScholarshipId, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Review modal state
  const [reviewingApp, setReviewingApp] = useState<ApplicationRecord | null>(null);
  const [adminStatus, setAdminStatus] = useState<ApplicationStatus>('Under Review');
  const [adminNote, setAdminNote] = useState('');

  const statuses: ApplicationStatus[] = [
    'Interested',
    'Preparing Documents',
    'Applied',
    'Under Review',
    'Approved',
    'Rejected',
  ];

  const filtered = applications.filter((app) => {
    if (statusFilter !== 'All' && app.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        app.scholarshipName.toLowerCase().includes(q) ||
        app.organization.toLowerCase().includes(q) ||
        (app.notes && app.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingApp) return;

    updateApplicationStatus(
      reviewingApp.id,
      adminStatus,
      adminNote ? `Admin note: ${adminNote}` : reviewingApp.notes
    );
    showToast(`Application #${reviewingApp.id} updated to ${adminStatus}`, 'success');
    setReviewingApp(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
            Grant Verification Workflow
          </span>
          <h1 className="text-2xl font-extrabold text-[#142B4F] tracking-tight mt-1">
            Application Review Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Audit submitted scholarship claims, verify institutional attestation notes, and update official administrative statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl font-mono tabular-nums">
            Total in Pipeline: {applications.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by scholarship, student or notes..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="All">All Stages ({applications.length})</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <p className="text-slate-500 font-medium">
          Showing <strong className="text-slate-900 font-mono tabular-nums">{filtered.length}</strong> application records
        </p>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Application ID & Scheme</th>
                <th className="py-3 px-4">Awarding Body</th>
                <th className="py-3 px-4">Grant Value</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 max-w-xs">
                    <span className="text-[10px] font-mono text-purple-700 font-bold block">
                      #{app.id}
                    </span>
                    <p className="font-bold text-slate-900 truncate">{app.scholarshipName}</p>
                    {app.notes && (
                      <p className="text-[11px] text-slate-500 italic truncate mt-0.5">
                        "{app.notes}"
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{app.organization}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono tabular-nums">
                    {app.amountDisplay}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums">{app.appliedDate}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                        app.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : app.status === 'Under Review'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : app.status === 'Applied'
                          ? 'bg-purple-50 text-[#6546E8] border border-purple-200'
                          : app.status === 'Preparing Documents'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : app.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setReviewingApp(app);
                        setAdminStatus(app.status);
                        setAdminNote(app.notes || '');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-lg transition-colors"
                    >
                      Audit / Update
                    </button>
                    <button
                      onClick={() => setSelectedScholarshipId(app.scholarshipId)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg inline-block"
                      title="Inspect scheme criteria"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {reviewingApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Administrative Status Review</h3>
              <button
                onClick={() => setReviewingApp(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <p className="font-bold text-slate-900">{reviewingApp.scholarshipName}</p>
              <p className="text-slate-500">{reviewingApp.organization}</p>
              <p className="text-purple-700 font-mono font-bold">{reviewingApp.amountDisplay}</p>
            </div>

            <form onSubmit={handleStatusSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assign Administrative Status:
                </label>
                <select
                  value={adminStatus}
                  onChange={(e) => setAdminStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Verification Notes (shared with applicant):
                </label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Tahsildar certificate verified. Forwarded to State Welfare Nodal Officer for DBT disbursement."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReviewingApp(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#6546E8] hover:bg-[#5337ca] rounded-xl"
                >
                  Commit Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
