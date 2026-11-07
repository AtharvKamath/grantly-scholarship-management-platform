import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Bell,
  BellOff,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const DeadlineCalendarPage: React.FC = () => {
  const { scholarships, setSelectedScholarshipId, showToast } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | '30days' | 'expired'>('all');
  const [reminders, setReminders] = useState<Record<string, boolean>>({
    'sch-001': true,
    'sch-002': true,
    'sch-011': true,
  });

  const now = new Date('2026-11-07');

  const toggleReminder = (id: string, name: string) => {
    setReminders((prev) => {
      const isSet = !prev[id];
      showToast(
        isSet ? `Deadline reminder scheduled for ${name}` : `Reminder disabled for ${name}`,
        'info'
      );
      return { ...prev, [id]: isSet };
    });
  };

  // Process scholarships with deadline calculations
  const processed = scholarships.map((sch) => {
    const dDate = new Date(sch.deadline);
    const daysLeft = Math.ceil((dDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    return {
      ...sch,
      daysLeft,
      isUrgent: daysLeft >= 0 && daysLeft <= 7,
      is30Days: daysLeft > 7 && daysLeft <= 30,
      isExpired: daysLeft < 0,
    };
  });

  const filtered = processed.filter((s) => {
    if (activeFilter === 'urgent') return s.isUrgent;
    if (activeFilter === '30days') return s.is30Days;
    if (activeFilter === 'expired') return s.isExpired;
    return true;
  }).sort((a, b) => a.daysLeft - b.daysLeft);

  // November 2026 calendar days simulation
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
            Deadline Guardian
          </span>
          <h1 className="text-2xl font-extrabold text-[#142B4F] tracking-tight mt-1">
            Deadline Calendar & Reminders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Never miss institutional e-attestation or national scholarship closure dates. Highlight urgent submission windows and schedule alerts.
          </p>
        </div>

        {/* Urgent Alert Banner */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5 shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>{processed.filter((p) => p.isUrgent).length} schemes</strong> closing within 7 days!
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            All Milestones ({processed.length})
          </button>
          <button
            onClick={() => setActiveFilter('urgent')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeFilter === 'urgent'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-700 hover:text-amber-800'
            }`}
          >
            Urgent &lt; 7 Days ({processed.filter((p) => p.isUrgent).length})
          </button>
          <button
            onClick={() => setActiveFilter('30days')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeFilter === '30days'
                ? 'bg-[#6546E8] text-white shadow-xs'
                : 'text-purple-700 hover:text-purple-800'
            }`}
          >
            Within 30 Days ({processed.filter((p) => p.is30Days).length})
          </button>
          <button
            onClick={() => setActiveFilter('expired')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeFilter === 'expired'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Expired Schemes ({processed.filter((p) => p.isExpired).length})
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">Current Date: November 7, 2026</span>
      </div>

      {/* Calendar Grid + Deadline Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Monthly Grid (November 2026) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">November 2026</h3>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
              Current Application Cycle
            </span>
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400 pb-2 border-b border-slate-100">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-xs">
            {/* Nov 1, 2026 is Sunday */}
            {daysInMonth.map((day) => {
              const dateStr = `2026-11-${day < 10 ? '0' + day : day}`;
              const matchingSchs = scholarships.filter((s) => s.deadline === dateStr);
              const isToday = day === 7;
              const hasDeadline = matchingSchs.length > 0;

              return (
                <div
                  key={day}
                  onClick={() => {
                    if (hasDeadline) {
                      setSelectedScholarshipId(matchingSchs[0].id);
                    }
                  }}
                  className={`h-11 rounded-xl p-1 flex flex-col items-center justify-between transition-all ${
                    hasDeadline
                      ? 'bg-purple-50 border border-purple-200 cursor-pointer hover:bg-purple-100'
                      : isToday
                      ? 'bg-[#142B4F] text-white font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className={`text-[11px] ${isToday ? 'text-white' : ''}`}>{day}</span>
                  {hasDeadline && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6546E8]" title={matchingSchs[0].name} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-[#142B4F]" />
              <span>Today: November 7, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-purple-200 border border-purple-300" />
              <span>Date with verified scholarship deadline</span>
            </div>
          </div>
        </div>

        {/* Detailed Deadline Milestone List */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Tracked Deadlines & Schedules</h3>

          <div className="divide-y divide-slate-100">
            {filtered.map((sch) => (
              <div
                key={sch.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-purple-700">{sch.educationLevel}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500">{sch.organization}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">{sch.name}</h4>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="font-mono tabular-nums">Deadline: {sch.deadline}</span>
                    <span>·</span>
                    <span className="font-bold text-slate-800">{sch.amountDisplay}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg tabular-nums ${
                      sch.isUrgent
                        ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                        : sch.is30Days
                        ? 'bg-purple-50 text-[#6546E8] border border-purple-100'
                        : sch.isExpired
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {sch.daysLeft > 0 ? `${sch.daysLeft} days left` : 'Expired'}
                  </span>

                  <button
                    onClick={() => toggleReminder(sch.id, sch.name)}
                    className={`p-2 rounded-xl border transition-colors ${
                      reminders[sch.id]
                        ? 'bg-purple-50 text-[#6546E8] border-purple-200'
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
                    }`}
                    title={reminders[sch.id] ? 'Reminder active' : 'Set reminder'}
                  >
                    {reminders[sch.id] ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setSelectedScholarshipId(sch.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
