import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Sparkles,
  Bookmark,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FolderLock,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

export const StudentOverview: React.FC = () => {
  const {
    user,
    studentProfile,
    scholarships,
    savedScholarshipIds,
    applications,
    profileCompletionPercentage,
    setCurrentView,
    setSelectedScholarshipId,
  } = useApp();

  const now = new Date('2026-11-07');

  // Filter urgent deadlines
  const urgentScholarships = scholarships
    .filter((s) => {
      const dDate = new Date(s.deadline);
      const days = Math.ceil((dDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return days >= 0 && days <= 14;
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);

  // Status chart distribution data
  const statusCounts: Record<string, number> = {
    Interested: 0,
    'Preparing Documents': 0,
    Applied: 0,
    'Under Review': 0,
    Approved: 0,
  };
  applications.forEach((a) => {
    if (statusCounts[a.status] !== undefined) {
      statusCounts[a.status] += 1;
    }
  });

  const chartData = [
    { name: 'Interested', count: statusCounts['Interested'] || 0, color: '#94A3B8' },
    { name: 'Preparing', count: statusCounts['Preparing Documents'] || 0, color: '#F59E0B' },
    { name: 'Applied', count: statusCounts['Applied'] || 0, color: '#6546E8' },
    { name: 'Under Review', count: statusCounts['Under Review'] || 0, color: '#3B82F6' },
    { name: 'Approved', count: statusCounts['Approved'] || 0, color: '#10B981' },
  ];

  const totalApplicationValue = applications.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-[#142B4F] to-[#1e3c6c] text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider">
              Student Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {studentProfile.fullName || 'Scholar'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              You are currently enrolled in <strong>{studentProfile.course}</strong> at{' '}
              {studentProfile.collegeName}. You have {savedScholarshipIds.length} saved grants and{' '}
              {urgentScholarships.length} deadlines closing in 14 days.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('ai-recommendations')}
              className="px-4 py-2.5 bg-[#6546E8] hover:bg-[#5337ca] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Recommendations</span>
            </button>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-300">
              Profile Completeness: <strong className="text-white tabular-nums">{profileCompletionPercentage}%</strong>
            </span>
            {profileCompletionPercentage < 100 && (
              <button
                onClick={() => setCurrentView('profile')}
                className="text-purple-200 hover:text-white underline font-medium"
              >
                Complete Remaining Details →
              </button>
            )}
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${profileCompletionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          onClick={() => setCurrentView('discover')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#6546E8]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Available Schemes</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-purple-50 text-slate-700 group-hover:text-[#6546E8] flex items-center justify-center transition-colors">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">
            {scholarships.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Verified across India</span>
        </div>

        <div
          onClick={() => setCurrentView('ai-recommendations')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#6546E8]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">AI Recommendations</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#6546E8] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#6546E8] mt-2 font-mono tabular-nums">
            {scholarships.filter((s) => s.educationLevel === 'Undergraduate' || s.educationLevel === 'All').length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Matches your degree</span>
        </div>

        <div
          onClick={() => setCurrentView('saved')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#6546E8]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Saved Scholarships</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">
            {savedScholarshipIds.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">In your personal shortlist</span>
        </div>

        <div
          onClick={() => setCurrentView('applications')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#6546E8]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Applications Tracked</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">
            {applications.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block tabular-nums">
            ₹{totalApplicationValue.toLocaleString('en-IN')} pipeline
          </span>
        </div>
      </div>

      {/* Main Grid: Application Chart + Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chart Column */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Application Progress Status</h3>
              <p className="text-xs text-slate-500">Distribution across your tracked grant lifecycle</p>
            </div>
            <button
              onClick={() => setCurrentView('applications')}
              className="text-xs font-semibold text-[#6546E8] hover:underline"
            >
              Manage Applications →
            </button>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6546E8]" />
              <span>Applied: {statusCounts['Applied']}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Under Review: {statusCounts['Under Review']}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Approved: {statusCounts['Approved']}</span>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines Column */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">Closing Soon (&lt; 14 Days)</h3>
            </div>
            <button
              onClick={() => setCurrentView('calendar')}
              className="text-xs font-semibold text-[#6546E8] hover:underline"
            >
              View Calendar →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {urgentScholarships.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No urgent deadlines closing soon.</p>
            ) : (
              urgentScholarships.map((sch) => {
                const dDate = new Date(sch.deadline);
                const days = Math.ceil((dDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

                return (
                  <div key={sch.id} className="py-3 flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{sch.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{sch.organization}</p>
                      <span className="text-[10px] text-slate-400 tabular-nums">
                        Amount: {sch.amountDisplay}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-800 border border-amber-200 tabular-nums">
                        {days} days left
                      </span>
                      <button
                        onClick={() => setSelectedScholarshipId(sch.id)}
                        className="block text-[11px] font-semibold text-[#6546E8] hover:underline mt-1.5"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Application Activity */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Recent Applications</h3>
          <button
            onClick={() => setCurrentView('applications')}
            className="text-xs font-semibold text-[#6546E8] hover:underline"
          >
            All Applications ({applications.length}) →
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {applications.slice(0, 3).map((app) => (
            <div
              key={app.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{app.scholarshipName}</h4>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      app.status === 'Applied'
                        ? 'bg-purple-50 text-[#6546E8]'
                        : app.status === 'Under Review'
                        ? 'bg-blue-50 text-blue-700'
                        : app.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {app.organization} · Applied on: {app.appliedDate} · Deadline: {app.deadline}
                </p>
                {app.notes && (
                  <p className="text-xs text-slate-600 italic">Note: "{app.notes}"</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedScholarshipId(app.scholarshipId)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  View Scheme
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setCurrentView('eligibility')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#6546E8] text-left transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6546E8] flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#6546E8]">
            Eligibility Checker
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Compare any scheme’s requirements against your saved marks and income.
          </p>
        </button>

        <button
          onClick={() => setCurrentView('documents')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#6546E8] text-left transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6546E8] flex items-center justify-center mb-3">
            <FolderLock className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#6546E8]">
            Document Vault
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Store and organize marksheets, income slips, and caste certificates.
          </p>
        </button>

        <button
          onClick={() => setCurrentView('discover')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#6546E8] text-left transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6546E8] flex items-center justify-center mb-3">
            <Compass className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#6546E8]">
            Scholarship Discovery
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Filter by state domicile, course, income limit, and grant amount.
          </p>
        </button>
      </div>
    </div>
  );
};
