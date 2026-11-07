import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FolderLock,
  Upload,
  FileCheck2,
  Trash2,
  ShieldCheck,
  FileText,
  Clock,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  File,
} from 'lucide-react';
import { DocumentType } from '../../types';

export const DocumentManagerPage: React.FC = () => {
  const { documents, addDocument, deleteDocument, showToast } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload modal form
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<DocumentType>('Academic Marksheet');
  const [mockFileName, setMockFileName] = useState('');
  const [mockFileSize, setMockFileSize] = useState('1.2 MB');
  const [uploading, setUploading] = useState(false);

  const categories: DocumentType[] = [
    'Academic Marksheet',
    'Income Certificate',
    'Caste Certificate',
    'Aadhaar Card',
    'Bonafide Certificate',
    'Bank Passbook',
    'Other Documents',
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMockFileName(file.name);
      setMockFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      if (!docName) {
        setDocName(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      showToast('Please provide a document title.', 'error');
      return;
    }

    setUploading(true);
    setTimeout(() => {
      addDocument({
        documentName: docName,
        documentType: docType,
        fileName: mockFileName || `${docName.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        fileSize: mockFileSize || '1.1 MB',
      });
      setUploading(false);
      setIsUploadModalOpen(false);
      setDocName('');
      setMockFileName('');
    }, 600);
  };

  const filteredDocs = documents.filter((doc) => {
    if (activeCategory !== 'All' && doc.documentType !== activeCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
            Encrypted Storage Vault
          </span>
          <h1 className="text-2xl font-extrabold text-[#142B4F] tracking-tight mt-1">
            Document Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Store and manage verification certificates (Income, Marksheet, Bonafide, Caste). Re-use seamlessly across multiple scholarship applications.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
            activeCategory === 'All'
              ? 'bg-[#142B4F] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Documents ({documents.length})
        </button>
        {categories.map((cat) => {
          const count = documents.filter((d) => d.documentType === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeCategory === cat
                  ? 'bg-[#6546E8] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{cat}</span>
              <span className="text-[10px] opacity-80 tabular-nums">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredDocs.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <FolderLock className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No documents in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload your certificate to ensure your scholarship applications pass institutional attestation checks.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#6546E8] rounded-xl hover:bg-[#5337ca]"
          >
            Upload Now
          </button>
        </div>
      )}

      {/* Documents Grid */}
      {filteredDocs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-purple-700 font-semibold">{doc.documentType}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3 h-3" />
                    {doc.status}
                  </span>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6546E8] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{doc.documentName}</h3>
                    <p className="text-xs text-slate-400 font-mono truncate">{doc.fileName}</p>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span className="tabular-nums">Size: {doc.fileSize}</span>
                  <span className="tabular-nums">Uploaded: {doc.uploadedAt}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => showToast(`Previewing verified file: ${doc.fileName}`, 'info')}
                  className="text-xs font-semibold text-[#6546E8] hover:underline"
                >
                  View File
                </button>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete certificate"
                  aria-label="Delete document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Upload Certificate</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Category:
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Name / Title:
                </label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. 5th Semester Grade Card or Income Affidavit"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                />
              </div>

              {/* File upload input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select File (PDF / JPEG / PNG):
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-[#6546E8] transition-colors relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">
                      {mockFileName ? mockFileName : 'Click or drag file here'}
                    </p>
                    <p className="text-[10px] text-slate-400">PDF, JPG up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl disabled:opacity-50"
                >
                  {uploading ? 'Encrypting & Storing...' : 'Save to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
