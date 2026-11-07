import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  GraduationCap,
  MapPin,
  IndianRupee,
  Calendar,
  X,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { StudentProfile } from '../../types';

export const AdminStudents: React.FC = () => {
  const { studentProfile, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  // List of demo registered students
  const studentsList: (StudentProfile & { id: string; registeredAt: string; applicationsCount: number })[] = [
    {
      id: 'stu-001',
      fullName: studentProfile.fullName || 'Atharv Kulkarni',
      email: studentProfile.email || 'atharv.kulkarni@student.edu',
      phone: studentProfile.phone || '+91 98765 43210',
      dob: studentProfile.dob || '2004-05-14',
      state: studentProfile.state || 'Karnataka',
      district: studentProfile.district || 'Bengaluru Urban',
      collegeName: studentProfile.collegeName || 'B.M.S. College of Engineering, Bengaluru',
      educationLevel: studentProfile.educationLevel || 'Undergraduate',
      course: studentProfile.course || 'B.Tech Computer Science & Engineering',
      currentYear: studentProfile.currentYear || '3rd Year',
      cgpa: studentProfile.cgpa || 8.4,
      annualIncome: studentProfile.annualIncome || 240000,
      category: studentProfile.category || 'OBC',
      gender: studentProfile.gender || 'Male',
      registeredAt: '2026-08-01',
      applicationsCount: 4,
    },
    {
      id: 'stu-002',
      fullName: 'Priya Sharma',
      email: 'priya.sharma@du.ac.in',
      phone: '+91 91234 56780',
      dob: '2005-02-19',
      state: 'Delhi',
      district: 'Central Delhi',
      collegeName: 'Miranda House, Delhi University',
      educationLevel: 'Undergraduate',
      course: 'B.Sc Mathematics & Computer Science',
      currentYear: '2nd Year',
      cgpa: 9.1,
      annualIncome: 180000,
      category: 'General',
      gender: 'Female',
      registeredAt: '2026-08-15',
      applicationsCount: 3,
    },
    {
      id: 'stu-003',
      fullName: 'Vikramaditya Naik',
      email: 'vikram.naik@coep.ac.in',
      phone: '+91 98220 11223',
      dob: '2003-11-28',
      state: 'Maharashtra',
      district: 'Pune',
      collegeName: 'COEP Technological University, Pune',
      educationLevel: 'Undergraduate',
      course: 'B.Tech Mechanical Engineering',
      currentYear: '4th Year',
      cgpa: 7.8,
      annualIncome: 320000,
      category: 'OBC',
      gender: 'Male',
      registeredAt: '2026-08-20',
      applicationsCount: 2,
    },
    {
      id: 'stu-004',
      fullName: 'Ananya Roy',
      email: 'ananya.roy@jadavpuruniversity.in',
      phone: '+91 97480 33445',
      dob: '2002-07-08',
      state: 'West Bengal',
      district: 'Kolkata',
      collegeName: 'Jadavpur University, Kolkata',
      educationLevel: 'Postgraduate',
      course: 'M.Sc Applied Physics',
      currentYear: '1st Year',
      cgpa: 8.9,
      annualIncome: 150000,
      category: 'SC',
      gender: 'Female',
      registeredAt: '2026-09-02',
      applicationsCount: 3,
    },
  ];

  const filtered = studentsList.filter((s) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.collegeName.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q)
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
            User Management
          </span>
          <h1 className="text-2xl font-extrabold text-[#142B4F] tracking-tight mt-1">
            Registered Students Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Inspect verified candidate profiles, academic records, and monitor application volume by collegiate institution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            Total Students: <strong className="text-slate-900 font-mono">1,420 Active</strong>
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name, college, degree, or state..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">College & Degree</th>
                <th className="py-3 px-4">Domicile</th>
                <th className="py-3 px-4">CGPA / Income</th>
                <th className="py-3 px-4">Active Apps</th>
                <th className="py-3 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{stu.fullName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{stu.email}</p>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-semibold text-slate-800 truncate">{stu.course}</p>
                    <p className="text-[11px] text-slate-500 truncate">{stu.collegeName}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span>{stu.state}</span>
                    <span className="block text-[10px] text-slate-400">{stu.district}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums">
                    <span className="font-bold text-[#142B4F]">{stu.cgpa} CGPA</span>
                    <span className="block text-[11px] text-slate-500">
                      ₹{stu.annualIncome.toLocaleString('en-IN')}/yr
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#6546E8] font-bold text-[10px] tabular-nums">
                      {stu.applicationsCount} schemes
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedStudent(stu)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#142B4F] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile Detail Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#142B4F] text-white flex items-center justify-center font-bold text-base">
                  {selectedStudent.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedStudent.fullName}</h3>
                  <span className="text-xs text-slate-500">{selectedStudent.email}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Degree Program</span>
                <span className="font-bold text-slate-800">{selectedStudent.course}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Academic Performance</span>
                <span className="font-bold text-slate-800 font-mono">{selectedStudent.cgpa} CGPA</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Annual Family Income</span>
                <span className="font-bold text-slate-800 font-mono">
                  ₹{selectedStudent.annualIncome.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Category / Quota</span>
                <span className="font-bold text-slate-800">{selectedStudent.category}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">College / University</span>
                <span className="font-bold text-slate-800">{selectedStudent.collegeName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Domicile Location</span>
                <span className="font-bold text-slate-800">
                  {selectedStudent.district}, {selectedStudent.state}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#142B4F] rounded-xl hover:bg-[#6546E8]"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
