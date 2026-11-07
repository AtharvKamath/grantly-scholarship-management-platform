import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  GraduationCap,
  IndianRupee,
  SlidersHorizontal,
  FolderLock,
  Save,
  CheckCircle2,
  Upload,
  Trash2,
  FileText,
  ShieldCheck,
  X,
  File,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { EducationLevel, Category, StudentProfile, DocumentType } from '../../types';

export const StudentProfilePage: React.FC = () => {
  const {
    studentProfile,
    updateStudentProfile,
    profileCompletionPercentage,
    documents,
    addDocument,
    deleteDocument,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'personal' | 'academic' | 'financial' | 'preferences' | 'documents'
  >('personal');

  const [form, setForm] = useState<StudentProfile>(studentProfile);
  const [isSaving, setIsSaving] = useState(false);

  // Document upload state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<DocumentType>('Academic Marksheet');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileSize, setSelectedFileSize] = useState('1.2 MB');
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const documentCategories: DocumentType[] = [
    'Aadhaar Card',
    'Income Certificate',
    'Caste Certificate',
    'Academic Marksheet',
    'Bonafide Certificate',
    'Bank Passbook',
    'Other Documents',
  ];

  const educationLevels: EducationLevel[] = [
    'School (9th-12th)',
    'Undergraduate',
    'Postgraduate',
    'Diploma / Polytechnic',
    'PhD / Doctoral',
  ];

  const categories: Category[] = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority'];

  const statesList = [
    'Karnataka',
    'Maharashtra',
    'Delhi',
    'Tamil Nadu',
    'Uttar Pradesh',
    'Telangana',
    'Gujarat',
    'West Bengal',
    'Rajasthan',
    'Kerala',
    'Madhya Pradesh',
    'Other / Outside India',
  ];

  const scholarshipTypesList = [
    'Merit-based',
    'Need-based (Financial)',
    'Government (State / Central)',
    'Corporate CSR',
    'Girls & Women Empowerment',
    'STEM & Engineering',
    'Minority & Reserved Categories',
    'Study Abroad / Overseas',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateStudentProfile(form);
      setIsSaving(false);
    }, 400);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        showToast('File size exceeds 10MB limit. Please upload a smaller file.', 'error');
        return;
      }
      setSelectedFileName(file.name);
      setSelectedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
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

    setUploadingDoc(true);
    setTimeout(() => {
      addDocument({
        documentName: docName.trim(),
        documentType: docType,
        fileName: selectedFileName || `${docName.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        fileSize: selectedFileSize || '1.1 MB',
      });
      setUploadingDoc(false);
      setIsUploadModalOpen(false);
      setDocName('');
      setSelectedFileName('');
    }, 500);
  };

  const toggleScholarshipTypePref = (type: string) => {
    const current = form.preferredScholarshipTypes || [];
    if (current.includes(type)) {
      setForm({ ...form, preferredScholarshipTypes: current.filter((t) => t !== type) });
    } else {
      setForm({ ...form, preferredScholarshipTypes: [...current, type] });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
            Student Profile Hub
          </span>
          <h1 className="text-2xl font-extrabold text-[#142B4F] tracking-tight mt-1">
            My Student Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Keep your personal, academic, financial records and documents up to date for precise AI scholarship matching.
          </p>
        </div>

        {/* Profile Completeness Gauge */}
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[11px] font-semibold text-purple-900 block">Completeness</span>
            <span className="text-lg font-black text-[#6546E8] tabular-nums">
              {profileCompletionPercentage}%
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-[#6546E8] flex items-center justify-center font-bold text-xs text-[#6546E8]">
            ✓
          </div>
        </div>
      </div>

      {/* 5-Section Tab Selector */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-2 gap-1 overflow-x-auto shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('personal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'personal'
              ? 'bg-[#142B4F] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>1. Personal Information</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('academic')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'academic'
              ? 'bg-[#142B4F] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>2. Academic Information</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('financial')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'financial'
              ? 'bg-[#142B4F] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          <span>3. Financial Information</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'preferences'
              ? 'bg-[#142B4F] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>4. Scholarship Preferences</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'documents'
              ? 'bg-[#142B4F] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FolderLock className="w-4 h-4" />
          <span>5. Documents Vault ({documents.length})</span>
        </button>
      </div>

      {/* Form Content for Tab 1, 2, 3, 4 */}
      {activeTab !== 'documents' ? (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* TAB 1: PERSONAL INFORMATION */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Personal & Identity Details</h3>
                <p className="text-xs text-slate-500">Provide official identity details as per your Aadhaar card or government ID.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={form.gender || 'Prefer not to say'}
                    onChange={(e) => setForm({ ...form, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Social Category / Reservation <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
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
                    State of Domicile <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  >
                    {statesList.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    District <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    placeholder="e.g. Bengaluru Urban"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC INFORMATION */}
          {activeTab === 'academic' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Academic Status & Qualifications</h3>
                <p className="text-xs text-slate-500">Accurate CGPA and course details unlock merit-based government and corporate awards.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    College / University Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.collegeName}
                    onChange={(e) => setForm({ ...form, collegeName: e.target.value })}
                    placeholder="e.g. B.M.S. College of Engineering"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Education Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.educationLevel}
                    onChange={(e) => setForm({ ...form, educationLevel: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  >
                    {educationLevels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Degree / Course <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.course}
                    onChange={(e) => setForm({ ...form, course: e.target.value })}
                    placeholder="e.g. B.Tech Computer Science & Engineering"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Academic Year <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.currentYear}
                    onChange={(e) => setForm({ ...form, currentYear: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Final Year">Final Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CGPA / Cumulative Percentage <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={form.cgpa}
                    onChange={(e) => setForm({ ...form, cgpa: parseFloat(e.target.value) || 0 })}
                    placeholder="8.4"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] font-mono tabular-nums bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FINANCIAL INFORMATION */}
          {activeTab === 'financial' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Family Financial Profile</h3>
                <p className="text-xs text-slate-500">Government schemes (NSP, SSP) filter eligibility by official Tahsildar income slabs.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual Family Income (INR ₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="5000"
                    required
                    value={form.annualIncome}
                    onChange={(e) => setForm({ ...form, annualIncome: parseInt(e.target.value, 10) || 0 })}
                    placeholder="240000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] font-mono tabular-nums bg-white"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Current: ₹{form.annualIncome ? form.annualIncome.toLocaleString('en-IN') : '0'} / annum
                  </span>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200/80 text-xs text-slate-700 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#6546E8] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-[#142B4F] block">Income Verification Guideline</span>
                    <span>
                      Most need-based scholarships require family income below ₹2,50,000 to ₹6,00,000 per annum supported by a valid Income Certificate.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SCHOLARSHIP PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Scholarship Discovery Preferences</h3>
                <p className="text-xs text-slate-500">Tell GRANTLY AI which scholarship types and awards you prioritize.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Target Scholarship Categories (Select all that apply):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {scholarshipTypesList.map((st) => {
                    const isChecked = (form.preferredScholarshipTypes || []).includes(st);
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => toggleScholarshipTypePref(st)}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? 'bg-purple-50/80 border-[#6546E8] text-[#142B4F]'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span>{st}</span>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isChecked ? 'bg-[#6546E8] border-[#6546E8] text-white' : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Save button footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* TAB 5: DOCUMENTS VAULT (Integrated inside Profile) */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Encrypted Document Vault</h3>
                <p className="text-xs text-slate-500">
                  Upload verification documents (Aadhaar, Income, Caste, Marksheet, Bonafide). Re-use seamlessly across applications.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload New Document</span>
              </button>
            </div>

            {/* Document List */}
            {documents.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <FolderLock className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No documents uploaded yet</p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Upload your Aadhaar Card, Income Certificate, and latest Semester Marksheet to verify eligibility.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-purple-700 text-[11px]">{doc.documentType}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <ShieldCheck className="w-3 h-3" />
                          {doc.status}
                        </span>
                      </div>

                      <div className="flex items-start gap-2.5 pt-1">
                        <div className="w-9 h-9 rounded-lg bg-purple-50 text-[#6546E8] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{doc.documentName}</h4>
                          <p className="text-[11px] text-slate-400 font-mono truncate">{doc.fileName}</p>
                        </div>
                      </div>

                      <div className="pt-2 text-[10px] text-slate-500 flex items-center justify-between">
                        <span>Size: {doc.fileSize}</span>
                        <span>Date: {doc.uploadedAt}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => showToast(`Previewing verified file: ${doc.fileName}`, 'info')}
                        className="text-xs font-semibold text-[#6546E8] hover:underline cursor-pointer"
                      >
                        View File
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDocument(doc.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Upload to Document Vault</h3>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Type:
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                >
                  {documentCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Title:
                </label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. 5th Sem Grade Card or Income Certificate"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select File (PDF / JPEG / PNG, Max 10MB):
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-[#6546E8] transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">
                      {selectedFileName ? selectedFileName : 'Click to choose certificate file'}
                    </p>
                    <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingDoc}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl disabled:opacity-50 cursor-pointer"
                >
                  {uploadingDoc ? 'Encrypting & Storing...' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
