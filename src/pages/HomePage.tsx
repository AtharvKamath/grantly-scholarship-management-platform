import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  FileCheck2,
  CalendarCheck2,
  CheckCircle2,
  ChevronDown,
  Building2,
  GraduationCap,
  Clock,
  Layers,
  Award,
  Zap,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setCurrentView, scholarships, setSelectedScholarshipId } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const featured = scholarships.filter((s) => s.featured).slice(0, 3);

  const stats = [
    { label: 'Scholarships Cataloged', value: '1,450+' },
    { label: 'Funding Value Discovered', value: '₹52+ Crore' },
    { label: 'Active Students Empowered', value: '88,000+' },
    { label: 'AI Eligibility Accuracy', value: '96.4%' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Build Your Student Profile',
      desc: 'Enter your education level, course, academic marks, family income, and state in under two minutes.',
    },
    {
      num: '02',
      title: 'AI Matches Scholarships',
      desc: 'Our Gemini-powered engine scans hundreds of verified schemes to compute your personalized match scores.',
    },
    {
      num: '03',
      title: 'Verify Eligibility & Prepare',
      desc: 'Get an itemized criteria check and assemble all required certificates inside the secure Document Vault.',
    },
    {
      num: '04',
      title: 'Track Deadlines & Applications',
      desc: 'Monitor submission status, receive countdown alerts, and never miss a grant disbursement again.',
    },
  ];

  const benefits = [
    {
      title: 'Zero Fragmented Portals',
      desc: 'No more checking dozens of separate state, central, and trust websites. All verified grants unified in one place.',
      icon: Layers,
    },
    {
      title: 'Grounded AI Advisory',
      desc: 'Gemini analyzes your criteria without fabricating fake awards or links, explaining exactly why you qualify.',
      icon: Sparkles,
    },
    {
      title: 'Deadline Guardian',
      desc: 'Automated 7-day and 30-day alerts ensure you submit before national portal e-attestation windows shut.',
      icon: CalendarCheck2,
    },
    {
      title: 'Centralized Document Vault',
      desc: 'Store marksheets, income affidavits, and bonafide letters once; re-use across multiple applications.',
      icon: FileCheck2,
    },
  ];

  const testimonials = [
    {
      quote:
        'I had almost given up on paying my 3rd year engineering tuition after my father’s medical emergency. GRANTLY matched me to HDFC Parivartan within seconds. I received ₹75,000 just in time.',
      name: 'Rohan Deshmukh',
      college: 'B.Tech Mechanical, COEP Pune',
      amount: 'Awarded ₹75,000',
    },
    {
      quote:
        'The eligibility checker broke down the complicated Reliance Foundation conditions into simple checkboxes. I passed the aptitude test and now my entire undergraduate degree is funded.',
      name: 'Sneha Venkatesh',
      college: 'B.Sc Data Science, BMS College Bengaluru',
      amount: 'Awarded ₹2,00,000',
    },
    {
      quote:
        'As an OBC student from Uttar Pradesh, navigating National Scholarship Portal was intimidating. GRANTLY’s Document Manager told me exactly which Tahsildar stamp was missing.',
      name: 'Aman Yadav',
      college: 'Integrated M.Sc Physics, BHU Varanasi',
      amount: 'Awarded ₹45,000/yr',
    },
  ];

  const faqs = [
    {
      q: 'Does GRANTLY charge any fees to students for finding scholarships?',
      a: 'No. GRANTLY is completely free for students. Our mission is to democratize higher education access by connecting every deserving student with authentic financial opportunities.',
    },
    {
      q: 'How does the AI Scholarship Recommendation Engine work?',
      a: 'Our engine uses the Google Gemini 3.8 Flash model on the server to analyze your academic degree, year, family income bracket, category, and domicile against our catalog of verified schemes. It explains why you match and highlights missing documents.',
    },
    {
      q: 'Does GRANTLY submit the scholarship directly to the government?',
      a: 'GRANTLY helps you discover opportunities, verify eligibility criteria, and organize required documents. To ensure transparency, your final application is submitted on the official provider portal (like National Scholarship Portal or Trust portals) via direct verified links.',
    },
    {
      q: 'Can postgraduate and diploma students also find scholarships?',
      a: 'Yes. GRANTLY indexes opportunities across School (Class 9-12), Diploma/Polytechnic, Undergraduate, Postgraduate (M.Tech, MBA, M.Sc), and Doctoral programs.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-18 lg:pb-24 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left text column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-[#6546E8] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Scholarship Intelligence</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5.5xl font-extrabold tracking-tight text-[#142B4F] leading-[1.15]">
                Your Future Deserves <br className="hidden sm:inline" />
                <span className="text-[#6546E8]">Every Opportunity.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Discover scholarships that match your dreams. Find financial support, verify eligibility in real time, and manage every application deadline from one simple platform.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentView('explore')}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#1a3866] rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Scholarships</span>
                </button>

                <button
                  onClick={() => setCurrentView('register')}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-[#6546E8] hover:bg-[#5337ca] rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Verified Schemes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#6546E8]" />
                  <span>Instant Eligibility Match</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero Spam or Fake Links</span>
                </div>
              </div>
            </div>

            {/* Right visual asset column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 group">
                <img
                  src="/src/assets/images/hero_students_scholarship_1794046695922.jpg"
                  alt="College students exploring educational opportunities on campus"
                  referrerPolicy="no-referrer"
                  className="w-full h-[360px] sm:h-[420px] object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
                  <div className="bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-lg border border-white/40">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#142B4F]">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#6546E8]" />
                        Reliance Foundation Scheme
                      </span>
                      <span className="text-emerald-700 font-bold tabular-nums">Up to ₹2,00,000</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Matched to 4,200+ undergraduate engineering and science applicants this term.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="py-12 bg-[#142B4F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, idx) => (
              <div key={idx} className="text-center sm:text-left">
                <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-mono tabular-nums">
                  {s.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Scholarships */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
              Handpicked Opportunities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B4F] tracking-tight mt-1">
              Featured Scholarships Open for Application
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('explore')}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#6546E8] hover:text-[#5337ca] transition-colors"
          >
            <span>View All {scholarships.length} Scholarships</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((sch) => {
            const now = new Date('2026-11-07');
            const dDate = new Date(sch.deadline);
            const daysLeft = Math.ceil((dDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

            return (
              <div
                key={sch.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-semibold text-purple-700">{sch.educationLevel}</span>
                    <span className="flex items-center gap-1 text-amber-700 font-medium tabular-nums">
                      <Clock className="w-3.5 h-3.5" />
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug line-clamp-2">
                    {sch.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sch.organization}</span>
                  </p>

                  <div className="my-4 p-3 bg-purple-50/70 rounded-xl border border-purple-100">
                    <span className="text-[11px] text-slate-500 block">Grant Amount</span>
                    <span className="text-base font-bold text-[#142B4F] tabular-nums">
                      {sch.amountDisplay}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {sch.description}
                  </p>
                </div>

                <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    {sch.eligibleCourses.slice(0, 2).join(', ')}
                  </span>
                  <button
                    onClick={() => setSelectedScholarshipId(sch.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B4F] tracking-tight mt-1">
              How GRANTLY Powers Your Journey
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From discovering opportunities to tracking application deadlines, we streamline every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200 bg-[#F7F8FC] hover:border-[#6546E8]/40 transition-colors"
              >
                <span className="text-2xl font-black text-[#6546E8] font-mono tabular-nums block mb-3">
                  {step.num}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose GRANTLY */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
              Purpose-Built For Students
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B4F] tracking-tight">
              Why Indian Students Trust GRANTLY
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every year, over ₹1,000 Crore in government and private educational scholarships go unclaimed simply because students do not know they qualify or miss strict deadlines.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              GRANTLY eliminates the maze of expired links and confusing eligibility criteria, giving you clear answers and structured application management.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setCurrentView('how-it-works')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#6546E8] hover:underline"
              >
                <span>Read our methodology and vision</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6546E8] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{b.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-[#142B4F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Student Success Stories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Real Impact for Real Aspirations
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Verified feedback from students who achieved their dreams with GRANTLY.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700/80 flex flex-col justify-between"
              >
                <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                  "{t.quote}"
                </p>

                <div className="pt-6 border-t border-slate-800 mt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      <p className="text-[11px] text-slate-400">{t.college}</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md tabular-nums">
                      {t.amount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B4F] tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none"
                >
                  <span className="text-sm font-bold text-slate-900 pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isOpen ? 'rotate-180 text-[#6546E8]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <div className="w-7 h-7 rounded-lg bg-[#6546E8] flex items-center justify-center text-white text-sm">
                  G
                </div>
                <span>GRANTLY</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Unified Scholarship Discovery & Management Platform. Built for THE OUTPOST by Frontend Arena hackathon.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
                Platform
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setCurrentView('explore')} className="hover:text-white">
                    Explore Scholarships
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('how-it-works')} className="hover:text-white">
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('about')} className="hover:text-white">
                    About the Project
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('contact')} className="hover:text-white">
                    Contact & Support
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
                Student Portals
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setCurrentView('dashboard')} className="hover:text-white">
                    Student Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('ai-recommendations')} className="hover:text-white">
                    AI Recommendations
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('eligibility')} className="hover:text-white">
                    Eligibility Checker
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('calendar')} className="hover:text-white">
                    Deadline Calendar
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
                Compliance & Trust
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                GRANTLY verifies all indexed scholarship opportunities with official state and central scholarship portals. Sample demo dataset ready for Firebase integration.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 GRANTLY. All rights reserved. Designed for THE OUTPOST Hackathon.</p>
            <div className="flex items-center gap-4">
              <span>Made with React & Tailwind CSS</span>
              <span>·</span>
              <span>Powered by Google Gemini</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
