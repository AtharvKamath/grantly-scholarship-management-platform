import React from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCheck,
  Sparkles,
  FileCheck2,
  CalendarCheck2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { setCurrentView } = useApp();

  const steps = [
    {
      num: '01',
      title: 'Create Your Comprehensive Student Profile',
      subtitle: 'Accurate data yields 96%+ AI match accuracy',
      icon: UserCheck,
      details: [
        'Enter your course, current academic year, and cumulative CGPA or 12th board marks.',
        'Specify your family annual income tier and state domicile accurately.',
        'Upload verified certificate metadata to calculate your profile completion score.',
      ],
      tip: 'Do not under-report family income—government schemes check Tahsildar revenue records.',
    },
    {
      num: '02',
      title: 'Intelligent AI Scholarship Matching',
      subtitle: 'Powered by server-side Gemini 3.8 Flash',
      icon: Sparkles,
      details: [
        'Our engine continuously parses eligibility clauses across verified central, state, and private trusts.',
        'Computes match scores categorized into HIGH MATCH, POSSIBLE MATCH, and NOT ELIGIBLE.',
        'Translates bureaucratic language into plain English with itemized requirement lists.',
      ],
      tip: 'Review the "Missing Requirements" section to identify certs you can quickly obtain.',
    },
    {
      num: '03',
      title: 'Run Itemized Eligibility Checks & Prepare Documents',
      subtitle: 'Verify every clause before beginning your application',
      icon: FileCheck2,
      details: [
        'Test any scholarship against your profile in our side-by-side criteria checker.',
        'Prepare all documents in advance in the encrypted Document Vault.',
        'Access verified official portal links with zero phishing or expired redirects.',
      ],
      tip: 'Keep Aadhaar linked to your bank account for Direct Benefit Transfer (DBT).',
    },
    {
      num: '04',
      title: 'Track Deadlines & Application Milestones',
      subtitle: 'Never miss an e-attestation or scholarship renewal date',
      icon: CalendarCheck2,
      details: [
        'Log each submission into your My Applications workspace.',
        'Receive automated 7-day and 30-day alerts for portal closure.',
        'Update application status as college nodal officers approve your records.',
      ],
      tip: 'College nodal officer approvals usually take 5–7 days before final state submission.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FC] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
            Four Steps to Funding
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142B4F] tracking-tight">
            How GRANTLY Simplifies Your Scholarship Journey
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            We turn a confusing, multi-portal application maze into a clear, structured roadmap so you can secure the educational funding you deserve.
          </p>
        </div>

        {/* 4 Steps */}
        <div className="space-y-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="flex items-center gap-4 md:flex-col md:items-center shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-[#142B4F] text-white flex items-center justify-center font-black text-xl shadow-sm">
                    {s.num}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6546E8] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{s.title}</h3>
                    <p className="text-xs font-medium text-[#6546E8]">{s.subtitle}</p>
                  </div>

                  <ul className="space-y-2 pt-1">
                    {s.details.map((d, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs text-purple-950 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-[#6546E8] shrink-0 mt-0.5" />
                    <span>
                      <strong>Expert Tip:</strong> {s.tip}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="bg-linear-to-r from-[#142B4F] to-[#1e3c6c] text-white rounded-2xl p-8 text-center space-y-4 shadow-xl">
          <h2 className="text-2xl font-bold">Ready to discover your matching scholarships?</h2>
          <p className="text-sm text-slate-200 max-w-xl mx-auto">
            Join over 88,000 students across India using GRANTLY to discover, check eligibility, and track life-changing financial aid.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setCurrentView('explore')}
              className="px-6 py-3 text-xs sm:text-sm font-semibold bg-white text-[#142B4F] hover:bg-slate-100 rounded-xl transition-colors"
            >
              Explore Catalog Now
            </button>
            <button
              onClick={() => setCurrentView('register')}
              className="px-6 py-3 text-xs sm:text-sm font-semibold bg-[#6546E8] hover:bg-[#5337ca] text-white rounded-xl transition-colors flex items-center gap-2"
            >
              <span>Build My Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
