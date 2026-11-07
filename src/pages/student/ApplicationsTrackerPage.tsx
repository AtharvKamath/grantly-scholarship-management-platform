import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Clock,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ExternalLink,
  Edit3,
  Trash2,
  X,
  FileCheck2,
} from 'lucide-react';
import { ApplicationStatus, ApplicationRecord } from '../../types';

export const ApplicationsTrackerPage: React.FC = () => {
  const {
    applications,
    scholarships,
    updateApplicationStatus,
    deleteApplication,
    addApplication,
    setSelectedScholarshipId,
    showToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');

  // Edit modal state
  const [editingApp, setEditingApp] = useState<ApplicationRecord | null>(null);
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('Applied');
  const [editNotes, setEditNotes] = useState('');

  // Add new modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSchId, setNewSchId] = useState(scholarships[0]?.id || '');
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Interested');
  const [newNotes, setNewNotes] = useState('');

  const statuses: ApplicationStatus[] = [
    'Interested',
    'Preparing Documents',
    'Applied',
    'Under Review',
    'Approved',
    'Rejected',
  ];

  const filteredApps = applications.filter((app) => {
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

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;
    updateApplicationStatus(editingApp.id, editStatus, editNotes);
    setEditingApp(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchId) return;
    addApplication(newSchId, newStatus, newNotes);
    setIsAddOpen(false);
    setNewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
            Grant Lifecycle Management
          </span>
          <h1 className="text-2xl font-extrabold text-[#142B4F] tracking-tight mt-1">
            My Applications Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Track and update progress on your active scholarship applications. Note: Final submissions must be completed on official provider portals.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application Record</span>
        </button>
      </div>

      {/* Filter and View Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applications..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="All">All Statuses ({applications.length})</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-0.5">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'table' ? 'bg-white text-[#6546E8] shadow-xs' : 'text-slate-500'
            }`}
            aria-label="Table view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'card' ? 'bg-white text-[#6546E8] shadow-xs' : 'text-slate-500'
            }`}
            aria-label="Card view"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredApps.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No application records found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You are not tracking any scholarships matching your filter. Browse our catalog and click "Track Application" to start monitoring your pipeline.
          </p>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#142B4F] rounded-xl hover:bg-[#6546E8]"
          >
            Add Record
          </button>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && filteredApps.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Scholarship Name</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">
                      {app.scholarshipName}
                      {app.notes && (
                        <span className="block text-[11px] text-slate-400 font-normal truncate mt-0.5">
                          "{app.notes}"
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{app.organization}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono tabular-nums">
                      {app.amountDisplay}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums">{app.deadline}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                          app.status === 'Applied'
                            ? 'bg-purple-50 text-[#6546E8]'
                            : app.status === 'Under Review'
                            ? 'bg-blue-50 text-blue-700'
                            : app.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : app.status === 'Preparing Documents'
                            ? 'bg-amber-50 text-amber-700'
                            : app.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingApp(app);
                          setEditStatus(app.status);
                          setEditNotes(app.notes || '');
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#6546E8] hover:bg-purple-50 transition-colors"
                        title="Update status"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedScholarshipId(app.scholarshipId)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#142B4F] hover:bg-slate-100 transition-colors"
                        title="View scholarship details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteApplication(app.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete application record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Card View */}
      {viewMode === 'card' && filteredApps.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-500 truncate">{app.organization}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                      app.status === 'Applied'
                        ? 'bg-purple-50 text-[#6546E8]'
                        : app.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700'
                        : app.status === 'Under Review'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{app.scholarshipName}</h3>

                <div className="my-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Grant Amount</span>
                  <span className="font-extrabold text-[#142B4F] tabular-nums">{app.amountDisplay}</span>
                </div>

                {app.notes && (
                  <p className="text-xs text-slate-600 italic bg-purple-50/50 p-2 rounded-lg">
                    "{app.notes}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono tabular-nums">Deadline: {app.deadline}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingApp(app);
                      setEditStatus(app.status);
                      setEditNotes(app.notes || '');
                    }}
                    className="p-1.5 text-slate-500 hover:text-[#6546E8] rounded-lg"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedScholarshipId(app.scholarshipId)}
                    className="p-1.5 text-slate-500 hover:text-[#142B4F] rounded-lg"
                    title="View details"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Status Modal */}
      {editingApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Update Application Progress</h3>
              <button
                onClick={() => setEditingApp(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Scholarship: <strong>{editingApp.scholarshipName}</strong>
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lifecycle Status:
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Personal Notes / Reference ID:
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Uploaded bonafide; awaiting college e-attestation confirmation..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#6546E8] hover:bg-[#5337ca] rounded-xl"
                >
                  Save Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Application Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Track New Scholarship</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Choose from Catalog:
                </label>
                <select
                  value={newSchId}
                  onChange={(e) => setNewSchId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                >
                  {scholarships.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.amountDisplay})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Stage:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes:</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Planning to apply after mid-terms..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl"
                >
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
