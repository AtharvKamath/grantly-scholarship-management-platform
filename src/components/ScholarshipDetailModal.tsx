import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Calendar,
  Building2,
  GraduationCap,
  IndianRupee,
  MapPin,
  Clock,
  ShieldCheck,
  FileCheck,
  ListOrdered,
  Sparkles,
} from 'lucide-react';

export const ScholarshipDetailModal: React.FC = () => {
  const {
    scholarships,
    selectedScholarshipId,
    setSelectedScholarshipId,
    isScholarshipSaved,
    toggleSaveScholarship,
    addApplication,
    applications,
    setCurrentView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'documents' | 'process' | 'dates'>('overview');

  if (!selectedScholarshipId) return null;

  const scholarship = scholarships.find((s) => s.id === selectedScholarshipId);
  if (!scholarship) return null;

  const isSaved = isScholarshipSaved(scholarship.id);
  const isApplied = applications.some((a) => a.scholarshipId === scholarship.id);

  // Calculate days remaining
  const now = new Date('2026-11-07');
  const deadlineDate = new Date(scholarship.deadline);
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-linear-to-r from-[#142B4F] to-[#1e3c6c] text-white relative">
          <button
            onClick={() => setSelectedScholarshipId(null)}
            className="absolute top-5 right-5 text-slate-300 hover:text-white p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider">
              {scholarship.educationLevel}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {scholarship.organization}
            </span>
            {scholarship.verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-md ml-auto mr-8">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white pr-10">
            {scholarship.name}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/15">
            <div>
              <span className="text-[11px] text-slate-300 block">Grant Amount</span>
              <span className="text-sm font-bold text-white tabular-nums">
                {scholarship.amountDisplay}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-300 block">Application Deadline</span>
              <span className="text-sm font-bold text-white tabular-nums flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                {scholarship.deadline} ({diffDays > 0 ? `${diffDays} days left` : 'Expired'})
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-300 block">Applicable Region</span>
              <span className="text-sm font-medium text-white truncate block">
                {scholarship.states.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 overflow-x-auto bg-slate-50/60">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'eligibility', label: 'Eligibility' },
            { id: 'documents', label: 'Required Documents' },
            { id: 'process', label: 'Application Steps' },
            { id: 'dates', label: 'Important Dates' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#6546E8] text-[#6546E8]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[50vh] overflow-y-auto space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  About this Opportunity
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">{scholarship.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Key Benefits & Support
                </h4>
                <ul className="space-y-2">
                  {scholarship.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Eligible Courses</span>
                  <span className="font-semibold text-slate-800">
                    {scholarship.eligibleCourses.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Family Income Limit</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {scholarship.maxFamilyIncome
                      ? `Up to ₹${scholarship.maxFamilyIncome.toLocaleString('en-IN')}`
                      : 'No strict income ceiling'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'eligibility' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Mandatory Eligibility Conditions
              </h4>
              <ul className="space-y-2.5">
                {scholarship.eligibilityCriteria.map((crit, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-[#6546E8] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                <strong>Official Verification Note:</strong> GRANTLY checks criteria against your profile, but final qualification and award decisions are strictly decided by {scholarship.organization}.
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Documents You Must Keep Ready
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {scholarship.requiredDocuments.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/70"
                  >
                    <FileCheck className="w-4 h-4 text-[#6546E8] shrink-0" />
                    <span className="text-xs font-semibold text-slate-800">{doc}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 pt-2">
                Tip: You can upload and organize all these files inside GRANTLY’s <strong>Document Vault</strong> for quick re-use.
              </p>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                How to Apply (Official Process)
              </h4>
              <div className="space-y-3">
                {scholarship.applicationProcess.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#142B4F] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dates' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Important Timeline & Milestones
              </h4>
              <div className="space-y-2">
                {scholarship.importantDates.map((dateItem, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50"
                  >
                    <span className="text-xs font-medium text-slate-700">{dateItem.title}</span>
                    <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                      {dateItem.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveScholarship(scholarship.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-purple-50 text-[#6546E8] border-purple-200'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedScholarshipId(null);
                setCurrentView('eligibility');
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#6546E8]" />
              <span>Check Eligibility</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {!isApplied && (
              <button
                onClick={() => addApplication(scholarship.id, 'Interested')}
                className="px-4 py-2 text-xs font-semibold text-[#142B4F] bg-accent hover:bg-blue-100 rounded-xl transition-colors"
              >
                Track Application
              </button>
            )}

            <a
              href={scholarship.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#6546E8] hover:bg-[#5337ca] rounded-xl shadow-xs transition-colors"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
