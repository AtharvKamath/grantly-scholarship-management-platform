import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bookmark,
  Building2,
  Clock,
  Trash2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export const SavedScholarshipsPage: React.FC = () => {
  const {
    scholarships,
    savedScholarshipIds,
    toggleSaveScholarship,
    setSelectedScholarshipId,
    addApplication,
    setCurrentView,
  } = useApp();

  const savedList = scholarships.filter((s) => savedScholarshipIds.includes(s.id));
  const now = new Date('2026-11-07');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
            Personal Shortlist
          </span>
          <h1 className="text-2xl font-extrabold text-[#142B4F] tracking-tight mt-1">
            Saved Scholarships
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Review your shortlisted opportunities, monitor approaching deadlines, and initiate applications whenever you're ready.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('discover')}
          className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0"
        >
          <Compass className="w-4 h-4" />
          <span>Explore More Grants</span>
        </button>
      </div>

      {/* Empty State */}
      {savedList.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Your saved shortlist is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any scholarship card to save it here for fast access and deadline monitoring.
          </p>
          <button
            onClick={() => setCurrentView('discover')}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#6546E8] rounded-xl hover:bg-[#5337ca] transition-colors"
          >
            Browse Scholarships
          </button>
        </div>
      )}

      {/* Saved Scholarships Grid */}
      {savedList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedList.map((sch) => {
            const dDate = new Date(sch.deadline);
            const daysLeft = Math.ceil((dDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

            return (
              <div
                key={sch.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-purple-700">{sch.educationLevel}</span>
                    <button
                      onClick={() => toggleSaveScholarship(sch.id)}
                      className="p-1 text-rose-500 hover:text-rose-700 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                    {sch.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sch.organization}</span>
                  </p>

                  <div className="my-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Grant Amount
                    </span>
                    <span className="text-sm font-extrabold text-[#142B4F] tabular-nums">
                      {sch.amountDisplay}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="tabular-nums">
                        Deadline: {sch.deadline} (
                        <strong className={daysLeft <= 7 && daysLeft >= 0 ? 'text-amber-700' : ''}>
                          {daysLeft > 0 ? `${daysLeft} days remaining` : 'Expired'}
                        </strong>
                        )
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => addApplication(sch.id, 'Interested')}
                    className="flex-1 py-2 text-xs font-semibold text-[#142B4F] bg-accent hover:bg-blue-100 rounded-xl transition-colors text-center"
                  >
                    Track Progress
                  </button>
                  <button
                    onClick={() => setSelectedScholarshipId(sch.id)}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl transition-colors text-center"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
