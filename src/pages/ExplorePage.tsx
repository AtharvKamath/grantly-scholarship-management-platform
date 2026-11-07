import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  Building2,
  Calendar,
  GraduationCap,
  Clock,
  ShieldCheck,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Grid,
  List,
} from 'lucide-react';
import { EducationLevel, Category } from '../types';

export const ExplorePage: React.FC = () => {
  const {
    scholarships,
    setSelectedScholarshipId,
    toggleSaveScholarship,
    isScholarshipSaved,
    setCurrentView,
  } = useApp();

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxIncomeFilter, setMaxIncomeFilter] = useState<string>('Any');
  const [sortBy, setSortBy] = useState<'deadline' | 'amount' | 'newest'>('deadline');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deadlineFilter, setDeadlineFilter] = useState<'all' | 'active' | 'urgent'>('active');

  // Filter options
  const stateOptions = ['All', 'All India', 'Karnataka', 'Maharashtra', 'Delhi', 'Uttar Pradesh', 'Tamil Nadu'];
  const levelOptions = ['All', 'School (9th-12th)', 'Undergraduate', 'Postgraduate', 'Diploma / Polytechnic', 'PhD / Doctoral'];
  const categoryOptions = ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'];

  const filteredScholarships = useMemo(() => {
    const now = new Date('2026-11-07');

    return scholarships.filter((sch) => {
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = sch.name.toLowerCase().includes(q);
        const matchesOrg = sch.organization.toLowerCase().includes(q);
        const matchesDesc = sch.description.toLowerCase().includes(q);
        const matchesCourses = sch.eligibleCourses.some((c) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesOrg && !matchesDesc && !matchesCourses) {
          return false;
        }
      }

      // State
      if (selectedState !== 'All') {
        if (!sch.states.includes('All India') && !sch.states.includes(selectedState)) {
          return false;
        }
      }

      // Level
      if (selectedLevel !== 'All' && sch.educationLevel !== selectedLevel && sch.educationLevel !== 'All') {
        return false;
      }

      // Category
      if (selectedCategory !== 'All' && sch.category !== 'All' && sch.category !== selectedCategory) {
        return false;
      }

      // Max Income
      if (maxIncomeFilter !== 'Any' && sch.maxFamilyIncome) {
        const ceiling = parseInt(maxIncomeFilter, 10);
        if (sch.maxFamilyIncome < ceiling) {
          // If scholarship allows less than ceiling, that's fine
        }
      }

      // Deadline filter
      const dDate = new Date(sch.deadline);
      const daysLeft = Math.ceil((dDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      if (deadlineFilter === 'active' && daysLeft < 0) {
        return false;
      }
      if (deadlineFilter === 'urgent' && (daysLeft < 0 || daysLeft > 14)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === 'amount') {
        return b.amount - a.amount;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    scholarships,
    searchTerm,
    selectedState,
    selectedLevel,
    selectedCategory,
    maxIncomeFilter,
    sortBy,
    deadlineFilter,
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedState('All');
    setSelectedLevel('All');
    setSelectedCategory('All');
    setMaxIncomeFilter('Any');
    setSortBy('deadline');
    setDeadlineFilter('active');
  };

  const activeFiltersCount =
    (selectedState !== 'All' ? 1 : 0) +
    (selectedLevel !== 'All' ? 1 : 0) +
    (selectedCategory !== 'All' ? 1 : 0) +
    (maxIncomeFilter !== 'Any' ? 1 : 0) +
    (deadlineFilter !== 'active' ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#F7F8FC] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
              Verified Opportunities Catalog
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142B4F] tracking-tight mt-1">
              Explore & Filter Scholarships
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Discover verified central, state, and corporate philanthropic grants. Filter by your degree, state domicile, and financial criteria with real-time deadline indicators.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by scholarship name, organization, course (e.g. B.Tech, MBBS)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
              >
                <option value="deadline">Sort: Deadline Approaching</option>
                <option value="amount">Sort: Highest Grant Amount</option>
                <option value="newest">Sort: Newly Listed</option>
              </select>

              <div className="hidden sm:flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-[#6546E8] shadow-xs' : 'text-slate-500'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white text-[#6546E8] shadow-xs' : 'text-slate-500'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            {/* State filter */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium"
            >
              <option value="All">State: All States</option>
              {stateOptions.slice(1).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* Education level */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium"
            >
              <option value="All">Level: All Levels</option>
              {levelOptions.slice(1).map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium"
            >
              <option value="All">Category: All</option>
              {categoryOptions.slice(1).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Deadline status */}
            <select
              value={deadlineFilter}
              onChange={(e) => setDeadlineFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium"
            >
              <option value="active">Status: Open Now</option>
              <option value="urgent">Status: Closing in 14 Days</option>
              <option value="all">Status: All (Include Expired)</option>
            </select>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 ml-auto px-2 py-1 rounded bg-rose-50"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter & Fast AI Match Prompt */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 px-1">
          <p>
            Showing <strong className="text-slate-900 tabular-nums">{filteredScholarships.length}</strong> verified scholarships
          </p>

          <button
            onClick={() => setCurrentView('ai-recommendations')}
            className="flex items-center gap-1.5 text-[#6546E8] hover:underline font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Want automatic AI ranking for your profile? Check AI Recommendations →</span>
          </button>
        </div>

        {/* Empty state */}
        {filteredScholarships.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No scholarships match your filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try loosening your state, course, or income restrictions, or reset all active filters to view all available schemes.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#142B4F] rounded-xl hover:bg-[#1a3866]"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((sch) => {
              const now = new Date('2026-11-07');
              const dDate = new Date(sch.deadline);
              const daysLeft = Math.ceil((dDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
              const isSaved = isScholarshipSaved(sch.id);

              return (
                <div
                  key={sch.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Unboxed metadata line */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#6546E8]">{sch.educationLevel}</span>
                        {sch.verified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => toggleSaveScholarship(sch.id)}
                        className={`p-1 rounded-md transition-colors ${
                          isSaved ? 'text-[#6546E8] bg-purple-50' : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title={isSaved ? 'Saved to bookmarks' : 'Save scholarship'}
                        aria-label="Save scholarship"
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                      {sch.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{sch.organization}</span>
                    </p>

                    {/* Grant amount card */}
                    <div className="my-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Grant Amount
                      </span>
                      <span className="text-sm font-extrabold text-[#142B4F] tabular-nums">
                        {sch.amountDisplay}
                      </span>
                    </div>

                    {/* Clean unboxed tags */}
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{sch.eligibleCourses.join(', ')}</span>
                      </div>
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

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedScholarshipId(sch.id)}
                      className="flex-1 py-2 text-xs font-semibold text-[#142B4F] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
                    >
                      View Details
                    </button>
                    <a
                      href={sch.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-500 hover:text-[#6546E8] hover:bg-purple-50 rounded-xl border border-slate-200 transition-colors"
                      title="Open verified application portal"
                      aria-label="Open verified application portal"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
            {filteredScholarships.map((sch) => {
              const now = new Date('2026-11-07');
              const dDate = new Date(sch.deadline);
              const daysLeft = Math.ceil((dDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
              const isSaved = isScholarshipSaved(sch.id);

              return (
                <div
                  key={sch.id}
                  className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-[#6546E8]">{sch.educationLevel}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">{sch.organization}</span>
                      {sch.verified && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                          Verified
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">{sch.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-1">{sch.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span>Courses: {sch.eligibleCourses.slice(0, 3).join(', ')}</span>
                      <span>·</span>
                      <span>Domicile: {sch.states.join(', ')}</span>
                      <span>·</span>
                      <span className="tabular-nums">
                        Deadline: {sch.deadline} ({daysLeft > 0 ? `${daysLeft}d left` : 'Expired'})
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Grant</span>
                      <span className="text-base font-extrabold text-[#142B4F] tabular-nums">
                        {sch.amountDisplay}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSaveScholarship(sch.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          isSaved ? 'text-[#6546E8] border-purple-200 bg-purple-50' : 'text-slate-400 border-slate-200'
                        }`}
                        aria-label="Save"
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setSelectedScholarshipId(sch.id)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
