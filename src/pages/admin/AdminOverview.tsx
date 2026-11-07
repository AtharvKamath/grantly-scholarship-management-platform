import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Compass,
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AdminOverview: React.FC = () => {
  const { scholarships, applications, setCurrentView, setSelectedScholarshipId } = useApp();

  // Statistics
  const totalStudents = 1420; // Demo platform counter
  const totalScholarships = scholarships.length;
  const totalApplications = applications.length;
  const approvedApplications = applications.filter((a) => a.status === 'Approved').length;
  const pendingApplications = applications.filter(
    (a) => a.status === 'Applied' || a.status === 'Under Review' || a.status === 'Preparing Documents'
  ).length;

  const totalFundingCataloged = scholarships.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  // Distribution by Education Level
  const levelCounts: Record<string, number> = {};
  scholarships.forEach((s) => {
    levelCounts[s.educationLevel] = (levelCounts[s.educationLevel] || 0) + 1;
  });

  const levelChartData = Object.keys(levelCounts).map((lvl, idx) => ({
    name: lvl.replace(' (9th-12th)', '').replace(' / Polytechnic', ''),
    count: levelCounts[lvl],
    fill: ['#6546E8', '#142B4F', '#10B981', '#F59E0B', '#6366F1'][idx % 5],
  }));

  // Application Pipeline Chart Data
  const appPipelineData = [
    { name: 'Interested', count: applications.filter((a) => a.status === 'Interested').length },
    { name: 'Preparing', count: applications.filter((a) => a.status === 'Preparing Documents').length },
    { name: 'Applied', count: applications.filter((a) => a.status === 'Applied').length },
    { name: 'Review', count: applications.filter((a) => a.status === 'Under Review').length },
    { name: 'Approved', count: approvedApplications },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-[#142B4F] to-[#0a182c] text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Administrative Command Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Executive Governance Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Monitor scholarship catalog verification, track application disbursements across institutions, and audit student verification documents.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('admin-scholarships')}
              className="px-4 py-2.5 bg-[#6546E8] hover:bg-[#5337ca] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
            >
              Manage Catalog ({scholarships.length})
            </button>
          </div>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Registered Students</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">
            {totalStudents.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Active across India</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Total Scholarships</span>
            <Compass className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">
            {totalScholarships}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {scholarships.filter((s) => s.verified).length} verified
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Tracked Pipeline</span>
            <FileText className="w-4 h-4 text-[#6546E8]" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">
            {totalApplications}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Student records</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Approved Grants</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2 font-mono tabular-nums">
            {approvedApplications}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Disbursed successfully</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2 font-mono tabular-nums">
            {pendingApplications}
          </p>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">Awaiting attestation</span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Application Stage Distribution */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Application Pipeline Volume</h3>
              <p className="text-xs text-slate-500">Live stages across all monitored student records</p>
            </div>
            <button
              onClick={() => setCurrentView('admin-applications')}
              className="text-xs font-semibold text-[#6546E8] hover:underline"
            >
              Review Pipeline →
            </button>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appPipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar dataKey="count" fill="#6546E8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Catalog by Degree Level */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Catalog by Education Tier</h3>
              <p className="text-xs text-slate-500">Breakdown of indexed schemes</p>
            </div>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {levelChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
            {levelChartData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                <span>
                  {d.name}: {d.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Tables */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Latest Scholarship Listings</h3>
          <button
            onClick={() => setCurrentView('admin-scholarships')}
            className="text-xs font-semibold text-[#6546E8] hover:underline"
          >
            Manage All Scholarships →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Scheme Name</th>
                <th className="py-2.5 px-3">Organization</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Deadline</th>
                <th className="py-2.5 px-3">Verification</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {scholarships.slice(0, 5).map((sch) => (
                <tr key={sch.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900 truncate max-w-xs">{sch.name}</td>
                  <td className="py-2.5 px-3">{sch.organization}</td>
                  <td className="py-2.5 px-3 font-mono tabular-nums">{sch.amountDisplay}</td>
                  <td className="py-2.5 px-3 font-mono tabular-nums">{sch.deadline}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        sch.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {sch.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedScholarshipId(sch.id)}
                      className="text-xs font-semibold text-[#6546E8] hover:underline"
                    >
                      Inspect
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
