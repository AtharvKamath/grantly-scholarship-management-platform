import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  IndianRupee,
  Clock,
  Award,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export const AdminReports: React.FC = () => {
  const { scholarships, applications, showToast } = useApp();

  const monthlyDisbursementData = [
    { month: 'Jun', amount: 12 },
    { month: 'Jul', amount: 18 },
    { month: 'Aug', amount: 28 },
    { month: 'Sep', amount: 45 },
    { month: 'Oct', amount: 62 },
    { month: 'Nov', amount: 84 },
  ];

  const streamDemandData = [
    { stream: 'B.Tech / BE', count: 420 },
    { stream: 'MBBS / Med', count: 180 },
    { stream: 'B.Sc Sciences', count: 240 },
    { stream: 'Commerce / CA', count: 150 },
    { stream: 'Postgraduate', count: 190 },
  ];

  const handleExportReport = () => {
    showToast('Exporting executive disbursement & analytics report (PDF/CSV)...', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
            Intelligence & Projections
          </span>
          <h1 className="text-2xl font-extrabold text-[#142B4F] tracking-tight mt-1">
            Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Audit scholarship disbursement velocity, student application retention, and high-demand degree streams.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Average Review Time</span>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">
            12.4 Days
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">↓ 2.1 days from last cycle</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Eligibility Match Accuracy</span>
          <p className="text-2xl font-black text-[#6546E8] mt-2 font-mono tabular-nums">
            96.8%
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Gemini 3.8 Flash Engine</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Application Success Rate</span>
          <p className="text-2xl font-black text-emerald-700 mt-2 font-mono tabular-nums">
            78.4%
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Attestation verified</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Catalog Value</span>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">
            ₹52.4 Cr
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Indexed schemes</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Monthly Application Inflow (Lakhs INR Disbursed)
          </h3>
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyDisbursementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#6546E8"
                  strokeWidth={3}
                  dot={{ fill: '#6546E8', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Student Demand by Degree</h3>
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={streamDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="stream" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="count" fill="#142B4F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
