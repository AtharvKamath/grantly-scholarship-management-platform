import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  ShieldCheck,
  Building2,
  FileCheck2,
  ArrowRight,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

export const EligibilityCheckerPage: React.FC = () => {
  const {
    scholarships,
    studentProfile,
    setSelectedScholarshipId,
    addApplication,
    setCurrentView,
  } = useApp();

  const [selectedSchId, setSelectedSchId] = useState<string>(
    scholarships[0]?.id || 'sch-001'
  );

  const selectedSch = scholarships.find((s) => s.id === selectedSchId) || scholarships[0];

  // Evaluate conditions
  const evaluateConditions = () => {
    if (!selectedSch) return { overall: 'Eligible', checks: [] };

    const checks: {
      title: string;
      status: 'Eligible' | 'Possibly Eligible' | 'Not Eligible';
      reason: string;
      studentValue: string;
      requiredValue: string;
    }[] = [];

    // 1. Education Level
    const isLevelMatch =
      selectedSch.educationLevel === 'All' ||
      selectedSch.educationLevel.toLowerCase() === studentProfile.educationLevel.toLowerCase();
    checks.push({
      title: 'Education Level',
      status: isLevelMatch ? 'Eligible' : 'Not Eligible',
      reason: isLevelMatch
        ? `Your current level (${studentProfile.educationLevel}) satisfies the requirement.`
        : `This grant requires candidates at ${selectedSch.educationLevel} level.`,
      studentValue: studentProfile.educationLevel,
      requiredValue: selectedSch.educationLevel,
    });

    // 2. Course
    const courses = selectedSch.eligibleCourses || [];
    const isCourseMatch =
      courses.includes('All') ||
      courses.some((c) => studentProfile.course?.toLowerCase().includes(c.toLowerCase()));
    checks.push({
      title: 'Course / Degree Program',
      status: isCourseMatch ? 'Eligible' : 'Possibly Eligible',
      reason: isCourseMatch
        ? `Your discipline (${studentProfile.course}) is approved under this scheme.`
        : `Please confirm with institution if ${studentProfile.course} falls under approved technical degrees.`,
      studentValue: studentProfile.course,
      requiredValue: selectedSch.eligibleCourses.join(', '),
    });

    // 3. Family Income
    let incomeStatus: 'Eligible' | 'Possibly Eligible' | 'Not Eligible' = 'Eligible';
    let incomeReason = 'No strict income ceiling mandated for this merit opportunity.';
    if (selectedSch.maxFamilyIncome) {
      if (studentProfile.annualIncome <= selectedSch.maxFamilyIncome) {
        incomeStatus = 'Eligible';
        incomeReason = `Your family income (₹${studentProfile.annualIncome.toLocaleString('en-IN')}) is below the ₹${selectedSch.maxFamilyIncome.toLocaleString('en-IN')} ceiling.`;
      } else {
        incomeStatus = 'Not Eligible';
        incomeReason = `Your reported income (₹${studentProfile.annualIncome.toLocaleString('en-IN')}) exceeds the allowable limit of ₹${selectedSch.maxFamilyIncome.toLocaleString('en-IN')}.`;
      }
    }
    checks.push({
      title: 'Annual Family Income',
      status: incomeStatus,
      reason: incomeReason,
      studentValue: `₹${studentProfile.annualIncome.toLocaleString('en-IN')}`,
      requiredValue: selectedSch.maxFamilyIncome
        ? `Max ₹${selectedSch.maxFamilyIncome.toLocaleString('en-IN')}`
        : 'Open (Merit-based)',
    });

    // 4. Academic Performance
    let cgpaStatus: 'Eligible' | 'Possibly Eligible' | 'Not Eligible' = 'Eligible';
    let cgpaReason = 'Academic score satisfies requirements.';
    if (selectedSch.minCGPA) {
      if (studentProfile.cgpa >= selectedSch.minCGPA) {
        cgpaStatus = 'Eligible';
        cgpaReason = `Your CGPA (${studentProfile.cgpa}) meets or exceeds the required ${selectedSch.minCGPA}.`;
      } else {
        cgpaStatus = 'Not Eligible';
        cgpaReason = `Your CGPA (${studentProfile.cgpa}) is below the minimum threshold (${selectedSch.minCGPA}).`;
      }
    }
    checks.push({
      title: 'Academic Performance (CGPA / %)',
      status: cgpaStatus,
      reason: cgpaReason,
      studentValue: `${studentProfile.cgpa} CGPA`,
      requiredValue: selectedSch.minCGPA ? `Min ${selectedSch.minCGPA} CGPA` : 'Satisfactory passing',
    });

    // 5. State Requirement
    const states = selectedSch.states || [];
    const isStateMatch = states.includes('All India') || states.includes(studentProfile.state);
    checks.push({
      title: 'State Domicile Requirement',
      status: isStateMatch ? 'Eligible' : 'Not Eligible',
      reason: isStateMatch
        ? `Open to scholars residing in ${studentProfile.state}.`
        : `This scheme is restricted to residents of: ${states.join(', ')}.`,
      studentValue: studentProfile.state,
      requiredValue: states.join(', '),
    });

    // Determine overall
    const hasNot = checks.some((c) => c.status === 'Not Eligible');
    const hasPossible = checks.some((c) => c.status === 'Possibly Eligible');
    let overall: 'Eligible' | 'Possibly Eligible' | 'Not Eligible' = 'Eligible';
    if (hasNot) overall = 'Not Eligible';
    else if (hasPossible) overall = 'Possibly Eligible';

    return { overall, checks };
  };

  const { overall, checks } = evaluateConditions();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
          Pre-Application Verification
        </span>
        <h1 className="text-2xl font-extrabold text-[#142B4F] tracking-tight mt-1">
          Interactive Eligibility Checker
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Select any scholarship to benchmark your saved student profile against its criteria. Verify whether you meet the mandatory eligibility benchmarks before applying.
        </p>

        {/* Dropdown Selector */}
        <div className="mt-5 max-w-xl">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Select Scholarship to Check:
          </label>
          <div className="relative">
            <select
              value={selectedSchId}
              onChange={(e) => setSelectedSchId(e.target.value)}
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6546E8] appearance-none cursor-pointer"
            >
              {scholarships.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.organization})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Selected Scholarship Summary Banner */}
      {selectedSch && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-purple-700">
                {selectedSch.educationLevel} Scheme
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">{selectedSch.name}</h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>{selectedSch.organization}</span>
              </p>
            </div>

            {/* Overall Verdict Badge */}
            <div className="text-left sm:text-right shrink-0">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider ${
                  overall === 'Eligible'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : overall === 'Possibly Eligible'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {overall === 'Eligible' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {overall === 'Possibly Eligible' && <AlertCircle className="w-4 h-4 text-amber-600" />}
                {overall === 'Not Eligible' && <XCircle className="w-4 h-4 text-rose-600" />}
                <span>Overall: {overall}</span>
              </span>
              <span className="block text-[10px] text-slate-400 mt-1">Based on student records</span>
            </div>
          </div>

          {/* Condition-by-condition comparison cards */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Itemized Condition Breakdown
            </h3>

            <div className="divide-y divide-slate-100">
              {checks.map((check, idx) => (
                <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{check.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          check.status === 'Eligible'
                            ? 'bg-emerald-50 text-emerald-700'
                            : check.status === 'Possibly Eligible'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {check.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{check.reason}</p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs shrink-0 sm:w-64 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Your Record:</span>
                      <strong className="text-slate-800 truncate ml-2 font-mono">{check.studentValue}</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-200/50 pt-1">
                      <span className="text-slate-400">Required:</span>
                      <span className="text-slate-600 truncate ml-2">{check.requiredValue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Disclaimer */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <p className="font-bold">Official Disclaimer:</p>
            <p className="leading-relaxed text-[11px] text-amber-800">
              GRANTLY’s eligibility evaluator provides guidance based on current published criteria. Final eligibility, quota reservations, and grant disbursements are solely determined by {selectedSch.organization} and competent government verifiers upon official portal review.
            </p>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setSelectedScholarshipId(selectedSch.id)}
              className="text-xs font-semibold text-[#6546E8] hover:underline"
            >
              View Full Scheme Details & Required Documents →
            </button>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => addApplication(selectedSch.id, 'Interested')}
                className="px-4 py-2 text-xs font-semibold text-[#142B4F] bg-accent hover:bg-blue-100 rounded-xl transition-colors"
              >
                Track in My Applications
              </button>
              <a
                href={selectedSch.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#6546E8] hover:bg-[#5337ca] rounded-xl transition-colors"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
