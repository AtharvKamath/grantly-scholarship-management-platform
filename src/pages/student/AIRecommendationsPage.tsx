import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  RefreshCw,
  Building2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { AIRecommendation } from '../../types';

export const AIRecommendationsPage: React.FC = () => {
  const {
    studentProfile,
    scholarships,
    setSelectedScholarshipId,
    addApplication,
    showToast,
  } = useApp();

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [source, setSource] = useState<'gemini' | 'rule-based-fallback' | 'cached'>('cached');
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'HIGH MATCH' | 'POSSIBLE MATCH' | 'NOT ELIGIBLE'>('ALL');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Progressive loading messages as required by prompt
  const loadingMessages = [
    'Analysing your profile...',
    'Checking eligibility requirements...',
    'Finding matching scholarships...',
    'Preparing your recommendations...',
  ];

  const fetchRecommendations = async () => {
    setLoading(true);
    setErrorMsg(null);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 1800);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s max timeout

    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: studentProfile,
          scholarships,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
      setSource(data.source || 'gemini');
      showToast('AI recommendations calculated successfully!', 'success');
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('AI match error:', err);

      // Perform deterministic eligibility comparisons using verified application logic
      const fallbackResults: AIRecommendation[] = scholarships.map((sch) => {
        let score = 50;
        const reasons: string[] = [];
        const missing: string[] = [];

        // Education Level comparison
        if (
          sch.educationLevel === 'All' ||
          sch.educationLevel.toLowerCase() === studentProfile.educationLevel.toLowerCase()
        ) {
          score += 20;
          reasons.push(`Degree matches ${studentProfile.educationLevel}.`);
        } else {
          score -= 25;
          missing.push(`Requires ${sch.educationLevel} degree enrollment.`);
        }

        // Course comparison
        const courses = sch.eligibleCourses || [];
        const courseMatch =
          courses.includes('All') ||
          courses.some((c) => studentProfile.course?.toLowerCase().includes(c.toLowerCase()));
        if (courseMatch) {
          score += 15;
          reasons.push(`Open to ${studentProfile.course} students.`);
        } else {
          score -= 20;
          missing.push(`Specific academic disciplines required.`);
        }

        // Income comparison
        if (sch.maxFamilyIncome && studentProfile.annualIncome) {
          if (studentProfile.annualIncome <= sch.maxFamilyIncome) {
            score += 15;
            reasons.push(`Annual income ₹${studentProfile.annualIncome.toLocaleString('en-IN')} within limit.`);
          } else {
            score -= 30;
            missing.push(`Annual income exceeds ceiling of ₹${sch.maxFamilyIncome.toLocaleString('en-IN')}.`);
          }
        }

        // State domicile comparison
        if (sch.states.includes('All India') || sch.states.includes(studentProfile.state)) {
          score += 10;
          reasons.push(`Available in ${studentProfile.state} state.`);
        } else {
          score -= 25;
          missing.push(`Restricted to domicile of: ${sch.states.join(', ')}.`);
        }

        // CGPA comparison
        if (sch.minCGPA && studentProfile.cgpa) {
          if (studentProfile.cgpa >= sch.minCGPA) {
            score += 10;
            reasons.push(`CGPA (${studentProfile.cgpa}) meets minimum requirement (${sch.minCGPA}).`);
          } else {
            score -= 20;
            missing.push(`Minimum CGPA of ${sch.minCGPA} required.`);
          }
        }

        const matchPct = Math.min(Math.max(score, 15), 98);
        let matchCat: 'HIGH MATCH' | 'POSSIBLE MATCH' | 'NOT ELIGIBLE' = 'POSSIBLE MATCH';
        if (matchPct >= 75) matchCat = 'HIGH MATCH';
        if (matchPct < 45) matchCat = 'NOT ELIGIBLE';

        return {
          scholarshipId: sch.id,
          matchCategory: matchCat,
          matchPercentage: matchPct,
          whyItMatches: reasons.length > 0 ? reasons.join(' ') : 'General educational funding.',
          missingRequirements: missing.length > 0 ? missing : ['Standard document verification.'],
          actionTips: 'Verify domicile certificate and keep academic marksheets ready.',
        };
      });

      setRecommendations(fallbackResults);
      setSource('rule-based-fallback');

      if (err.name === 'AbortError') {
        setErrorMsg('The AI service timed out after 120 seconds. Loaded verified catalog fallback analysis.');
      } else {
        setErrorMsg('Unable to connect to Gemini AI API directly. Loaded verified catalog fallback analysis.');
      }
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const displayedRecs = recommendations
    .filter((r) => {
      if (filterCategory === 'ALL') return true;
      return r.matchCategory === filterCategory;
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
              Powered by Google Gemini
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Engine: {source === 'gemini' ? 'Gemini 3.8 Flash' : 'Verified Rule-Based Engine'}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#142B4F] tracking-tight">
            AI Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Our intelligent engine cross-analyzes your <strong>{studentProfile.course}</strong> degree,{' '}
            <strong>₹{studentProfile.annualIncome.toLocaleString('en-IN')}</strong> family income, and{' '}
            <strong>{studentProfile.state}</strong> domicile against every verified scheme in the database.
          </p>
        </div>

        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#6546E8] hover:bg-[#5337ca] rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing...' : 'Re-run AI Analysis'}</span>
        </button>
      </div>

      {/* Filter Tabs for Match Categories */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filterCategory === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            All Schemes ({recommendations.length})
          </button>
          <button
            onClick={() => setFilterCategory('HIGH MATCH')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filterCategory === 'HIGH MATCH'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:text-emerald-800'
            }`}
          >
            High Match ({recommendations.filter((r) => r.matchCategory === 'HIGH MATCH').length})
          </button>
          <button
            onClick={() => setFilterCategory('POSSIBLE MATCH')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filterCategory === 'POSSIBLE MATCH'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-700 hover:text-amber-800'
            }`}
          >
            Possible Match ({recommendations.filter((r) => r.matchCategory === 'POSSIBLE MATCH').length})
          </button>
          <button
            onClick={() => setFilterCategory('NOT ELIGIBLE')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filterCategory === 'NOT ELIGIBLE'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 hover:text-rose-800'
            }`}
          >
            Not Eligible ({recommendations.filter((r) => r.matchCategory === 'NOT ELIGIBLE').length})
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          Evaluated against <strong>{studentProfile.fullName}</strong> ({studentProfile.category} Category, CGPA {studentProfile.cgpa})
        </p>
      </div>

      {/* Error state with retry */}
      {errorMsg && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={fetchRecommendations}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Progressive Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-[#6546E8] animate-spin mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">{loadingMessages[loadingStep]}</h3>
            <p className="text-xs text-slate-500">Evaluating your academic profile against live scholarship regulations.</p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            {loadingMessages.map((step, idx) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx <= loadingStep ? 'w-8 bg-[#6546E8]' : 'w-3 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations Cards Grid */}
      {!loading && (
        <div className="space-y-4">
          {displayedRecs.map((rec) => {
            const sch = scholarships.find((s) => s.id === rec.scholarshipId);
            if (!sch) return null;

            const isHigh = rec.matchCategory === 'HIGH MATCH';
            const isPossible = rec.matchCategory === 'POSSIBLE MATCH';

            return (
              <div
                key={rec.scholarshipId}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-purple-700">{sch.educationLevel}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">{sch.organization}</span>
                      {sch.verified && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                          Verified
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">{sch.name}</h3>
                    <p className="text-xs text-slate-500 font-mono tabular-nums">
                      Application Deadline: {sch.deadline} · Scholarship Amount: <strong className="text-slate-900">{sch.amountDisplay}</strong>
                    </p>
                  </div>

                  {/* Match Category Badge & Percentage */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-lg tabular-nums ${
                        isHigh
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : isPossible
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {rec.matchCategory} · {rec.matchPercentage}%
                    </span>
                    <span className="text-[10px] text-slate-400">Eligibility Comparison</span>
                  </div>
                </div>

                {/* AI Explanation & Missing requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  {/* Why it matches */}
                  <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100/80 space-y-1">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      Why It Matches
                    </span>
                    <p className="text-slate-700 leading-relaxed">{rec.whyItMatches}</p>
                  </div>

                  {/* Missing or verification items */}
                  <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100/80 space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      Missing Requirements to Verify
                    </span>
                    <ul className="text-slate-700 space-y-0.5 list-disc pl-4">
                      {rec.missingRequirements.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom action bar */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    <strong>Action Tip:</strong> {rec.actionTips}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addApplication(sch.id, 'Interested')}
                      className="px-3.5 py-1.5 text-xs font-semibold text-[#142B4F] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Apply Now (Track)
                    </button>
                    <button
                      onClick={() => setSelectedScholarshipId(sch.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
