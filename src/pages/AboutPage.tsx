import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Target,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  BookOpen,
  Award,
  Layers,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-[#F7F8FC] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6546E8] text-xs font-semibold border border-purple-200">
            <span>The Outpost Hackathon Project · Frontend Arena</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142B4F] tracking-tight">
            About GRANTLY
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            "Your Future Deserves Every Opportunity." We are on a mission to ensure no deserving student drops out of college due to lack of scholarship awareness or application barriers.
          </p>
        </div>

        {/* Why was GRANTLY created? */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6546E8] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Why GRANTLY Was Created</h2>
              <span className="text-xs text-slate-500">The Problem of Fragmented Opportunity</span>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            In India and developing economies, billions of rupees in government welfare schemes, private corporate trusts, and alumni endowments remain unspent every academic year.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Meanwhile, millions of students struggle to afford semester fees, textbooks, and hostel accommodation. Why this huge disconnect?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
                The Status Quo Challenge
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                <li>Fragmented across 40+ state and central websites.</li>
                <li>Obtuse government notifications with buried income criteria.</li>
                <li>Deadlines pass silently without automated notifications.</li>
                <li>Phishing sites offering fake awards to harvest student data.</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200/60">
              <h4 className="text-xs font-bold text-[#6546E8] uppercase tracking-wider mb-1">
                The GRANTLY Solution
              </h4>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                <li>Unified discovery with 100% verified schemes.</li>
                <li>AI explanations matching student criteria in seconds.</li>
                <li>Comprehensive Deadline Guardian and notification calendar.</li>
                <li>Centralized Document Vault for effortless certificate re-use.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6546E8] flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To democratize educational funding by translating complex eligibility requirements into transparent, actionable steps, enabling every aspiring scholar to claim their rightful opportunities.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6546E8] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              A world where financial status never determines academic destiny. We envision a smart, automated higher education ecosystem where deserving talent is seamlessly matched with equitable financial support.
            </p>
          </div>
        </div>

        {/* Principles */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Our Core Principles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#142B4F]">Truth in Data</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                We never fabricate grants, dates, or application fees. Every listing is cross-referenced with authorized official authorities.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#142B4F]">Student Privacy First</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your marks, income certificates, and personal details remain private and are never sold to commercial third-party lenders.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#142B4F]">Responsible AI</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                We use Google Gemini solely to simplify criteria analysis and explain requirements, not to make opaque automated rejection decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-4">
          <button
            onClick={() => setCurrentView('explore')}
            className="px-6 py-3 text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <span>Explore Opportunities on GRANTLY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
