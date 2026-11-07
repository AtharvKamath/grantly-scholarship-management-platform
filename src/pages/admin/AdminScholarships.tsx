import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  X,
  CheckCircle2,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { Scholarship, EducationLevel, Category } from '../../types';

export const AdminScholarships: React.FC = () => {
  const {
    scholarships,
    addScholarship,
    updateScholarship,
    deleteScholarship,
    toggleVerifyScholarship,
    setSelectedScholarshipId,
  } = useApp();

  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete confirm dialog
  const [deletingSch, setDeletingSch] = useState<Scholarship | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [amount, setAmount] = useState(50000);
  const [amountDisplay, setAmountDisplay] = useState('₹50,000 / year');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('Undergraduate');
  const [eligibleCoursesStr, setEligibleCoursesStr] = useState('B.Tech, BE, B.Sc');
  const [statesStr, setStatesStr] = useState('All India');
  const [category, setCategory] = useState<Category>('All');
  const [maxFamilyIncome, setMaxFamilyIncome] = useState<number | undefined>(600000);
  const [minCGPA, setMinCGPA] = useState<number | undefined>(7.0);
  const [deadline, setDeadline] = useState('2026-12-31');
  const [applicationUrl, setApplicationUrl] = useState('https://scholarships.gov.in');
  const [description, setDescription] = useState('');
  const [verified, setVerified] = useState(true);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setOrganization('');
    setAmount(50000);
    setAmountDisplay('₹50,000 / year');
    setEducationLevel('Undergraduate');
    setEligibleCoursesStr('B.Tech, BE, B.Sc');
    setStatesStr('All India');
    setCategory('All');
    setMaxFamilyIncome(600000);
    setMinCGPA(7.0);
    setDeadline('2026-12-31');
    setApplicationUrl('https://scholarships.gov.in');
    setDescription('');
    setVerified(true);
    setIsModalOpen(true);
  };

  const openEditModal = (sch: Scholarship) => {
    setEditingId(sch.id);
    setName(sch.name);
    setOrganization(sch.organization);
    setAmount(sch.amount);
    setAmountDisplay(sch.amountDisplay);
    setEducationLevel(sch.educationLevel);
    setEligibleCoursesStr(sch.eligibleCourses.join(', '));
    setStatesStr(sch.states.join(', '));
    setCategory(sch.category);
    setMaxFamilyIncome(sch.maxFamilyIncome);
    setMinCGPA(sch.minCGPA);
    setDeadline(sch.deadline);
    setApplicationUrl(sch.applicationUrl);
    setDescription(sch.description);
    setVerified(sch.verified);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const coursesArray = eligibleCoursesStr
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    const statesArray = statesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingId) {
      updateScholarship(editingId, {
        name,
        organization,
        amount,
        amountDisplay,
        educationLevel,
        eligibleCourses: coursesArray,
        states: statesArray,
        category,
        maxFamilyIncome: maxFamilyIncome || undefined,
        minCGPA: minCGPA || undefined,
        deadline,
        applicationUrl,
        description,
        verified,
      });
    } else {
      addScholarship({
        name,
        organization,
        amount,
        amountDisplay,
        educationLevel,
        eligibleCourses: coursesArray,
        states: statesArray,
        category,
        maxFamilyIncome: maxFamilyIncome || undefined,
        minCGPA: minCGPA || undefined,
        deadline,
        applicationUrl,
        description,
        verified,
        eligibilityCriteria: [
          `Open to students enrolled in ${educationLevel} programs.`,
          `Family annual income ceiling: ${maxFamilyIncome ? `₹${maxFamilyIncome.toLocaleString('en-IN')}` : 'Open'}.`,
          `Minimum score required: ${minCGPA ? `${minCGPA} CGPA` : 'Satisfactory passing'}.`,
        ],
        requiredDocuments: [
          'Academic Marksheet',
          'Income Certificate',
          'Bonafide Certificate',
          'Aadhaar Card',
          'Bank Passbook',
        ],
        benefits: [amountDisplay, 'Verified institutional recognition.'],
        applicationProcess: [
          'Register on official portal.',
          'Submit attested transcripts.',
          'Nodal officer verification.',
        ],
        importantDates: [
          { title: 'Application Closes', date: deadline },
        ],
      });
    }

    setIsModalOpen(false);
  };

  const filtered = scholarships.filter((s) => {
    if (levelFilter !== 'All' && s.educationLevel !== levelFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.organization.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
            Catalog Administration
          </span>
          <h1 className="text-2xl font-extrabold text-[#142B4F] tracking-tight mt-1">
            Manage Scholarships
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Add new funding opportunities, verify credentials, modify criteria, and ensure all official application URLs remain active.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Scholarship</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search catalog by name or trust..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
            />
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="All">All Education Levels</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Postgraduate">Postgraduate</option>
            <option value="School (9th-12th)">School (9th-12th)</option>
            <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
          </select>
        </div>

        <p className="text-slate-500 font-medium">
          Total Schemes: <strong className="text-slate-900 font-mono tabular-nums">{filtered.length}</strong>
        </p>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Scholarship & Organization</th>
                <th className="py-3 px-4">Level & Courses</th>
                <th className="py-3 px-4">Grant Amount</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Verified</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((sch) => (
                <tr key={sch.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-bold text-slate-900 truncate">{sch.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{sch.organization}</p>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <span className="font-semibold text-purple-700 block">{sch.educationLevel}</span>
                    <span className="text-[11px] text-slate-500 truncate block">
                      {sch.eligibleCourses.join(', ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono tabular-nums">
                    {sch.amountDisplay}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums">{sch.deadline}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleVerifyScholarship(sch.id)}
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        sch.verified
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {sch.verified ? (
                        <>
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3 h-3" />
                          <span>Unverified</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedScholarshipId(sch.id)}
                      className="p-1.5 text-slate-500 hover:text-[#142B4F] rounded-lg"
                      title="Preview details"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openEditModal(sch)}
                      className="p-1.5 text-slate-500 hover:text-[#6546E8] rounded-lg"
                      title="Edit scheme"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingSch(sch)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      title="Delete scheme"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingSch && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Delete Scholarship?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to permanently remove <strong>"{deletingSch.name}"</strong> from the GRANTLY public catalog?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingSch(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteScholarship(deletingSch.id);
                  setDeletingSch(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Scholarship Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingId ? 'Edit Scholarship Listing' : 'Publish New Scholarship'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Scholarship Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tata Trusts Higher Education Grant"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Awarding Organization *</label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Tata Trusts Foundation"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Education Level *</label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="School (9th-12th)">School (9th-12th)</option>
                    <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                    <option value="PhD / Doctoral">PhD / Doctoral</option>
                    <option value="All">All Levels</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grant Amount Display *</label>
                  <input
                    type="text"
                    required
                    value={amountDisplay}
                    onChange={(e) => setAmountDisplay(e.target.value)}
                    placeholder="e.g. Up to ₹1,50,000 / year"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Application Deadline *</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Eligible Courses (comma-separated)</label>
                  <input
                    type="text"
                    value={eligibleCoursesStr}
                    onChange={(e) => setEligibleCoursesStr(e.target.value)}
                    placeholder="B.Tech, BE, B.Sc, MBBS"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">States Domicile (comma-separated)</label>
                  <input
                    type="text"
                    value={statesStr}
                    onChange={(e) => setStatesStr(e.target.value)}
                    placeholder="All India, Karnataka, Maharashtra"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Annual Family Income (INR)</label>
                  <input
                    type="number"
                    value={maxFamilyIncome || ''}
                    onChange={(e) => setMaxFamilyIncome(parseInt(e.target.value, 10) || undefined)}
                    placeholder="600000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min CGPA Required</label>
                  <input
                    type="number"
                    step="0.1"
                    value={minCGPA || ''}
                    onChange={(e) => setMinCGPA(parseFloat(e.target.value) || undefined)}
                    placeholder="7.0"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Official Application URL *</label>
                  <input
                    type="url"
                    required
                    value={applicationUrl}
                    onChange={(e) => setApplicationUrl(e.target.value)}
                    placeholder="https://scholarships.gov.in"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed explanation of the scholarship..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="ver"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  className="w-4 h-4 accent-[#6546E8]"
                />
                <label htmlFor="ver" className="font-semibold text-slate-700">
                  Mark as Officially Verified Scheme
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl"
                >
                  {editingId ? 'Update Listing' : 'Publish Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
