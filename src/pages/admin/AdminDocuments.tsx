import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FolderLock,
  Search,
  FileCheck2,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Clock,
  Trash2,
  User,
  Eye,
} from 'lucide-react';

export const AdminDocuments: React.FC = () => {
  const { documents, deleteDocument, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filtered = documents.filter((doc) => {
    if (filterType !== 'All' && doc.documentType !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        doc.documentName.toLowerCase().includes(q) ||
        doc.fileName.toLowerCase().includes(q) ||
        doc.documentType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
            Verification & Compliance
          </span>
          <h1 className="text-2xl font-extrabold text-[#142B4F] tracking-tight mt-1">
            Student Document Audits
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Audit student uploaded certificates (Income, Marksheets, Bonafide, Caste) to guarantee authentic eligibility verification.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl font-mono tabular-nums">
          Total Vault Files: {documents.length}
        </span>
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
              placeholder="Search documents by title or filename..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="All">All Categories</option>
            <option value="Academic Marksheet">Academic Marksheet</option>
            <option value="Income Certificate">Income Certificate</option>
            <option value="Caste Certificate">Caste Certificate</option>
            <option value="Aadhaar Card">Aadhaar Card</option>
            <option value="Bonafide Certificate">Bonafide Certificate</option>
            <option value="Bank Passbook">Bank Passbook</option>
          </select>
        </div>

        <p className="text-slate-500 font-medium">
          Showing <strong className="text-slate-900 font-mono tabular-nums">{filtered.length}</strong> audited files
        </p>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">File Name & Size</th>
                <th className="py-3 px-4">Uploaded Date</th>
                <th className="py-3 px-4">Audit Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{doc.documentName}</td>
                  <td className="py-3.5 px-4 text-purple-700 font-semibold">{doc.documentType}</td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="block text-slate-800">{doc.fileName}</span>
                    <span className="text-[10px] text-slate-400 tabular-nums">{doc.fileSize}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums">{doc.uploadedAt}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <ShieldCheck className="w-3 h-3" />
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => showToast(`Opening secure preview for: ${doc.fileName}`, 'info')}
                      className="p-1.5 text-slate-500 hover:text-[#6546E8] rounded-lg"
                      title="Inspect document"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      title="Delete document"
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
    </div>
  );
};
