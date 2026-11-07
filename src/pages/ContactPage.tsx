import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mail,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  MapPin,
  HelpCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useApp();

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState<{ recipient?: string; messageId?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!form.name.trim()) {
      showToast('Please enter your full name.', 'error');
      return;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    if (!form.message.trim() || form.message.trim().length < 5) {
      showToast('Message must be at least 5 characters.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to deliver message.');
      }

      setSubmitted(true);
      setDeliveryInfo({ recipient: data.recipient, messageId: data.messageId });
      showToast(`Message delivered to ${data.recipient || 'business.atharvk@gmail.com'}`, 'success');
    } catch (err: any) {
      console.error('Contact error:', err);
      setErrorMessage(err.message || 'Failed to send your message. Please try again.');
      showToast(err.message || 'Delivery failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8]">
            We Are Here To Help
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142B4F] tracking-tight">
            Contact & Student Support
          </h1>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Have questions about scholarship eligibility, document attestation, or platform features? Our dedicated team is available to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Contact Information & Help Cards */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Student Help Desk</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#6546E8] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-slate-900">Direct Recipient</span>
                    <span className="text-slate-700 font-mono text-[11px]">business.atharvk@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#6546E8] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-slate-900">Operating Hours</span>
                    <span className="text-slate-500">Monday – Saturday: 9:00 AM – 6:00 PM IST</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#6546E8] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-slate-900">Hackathon Headquarters</span>
                    <span className="text-slate-500">THE OUTPOST · Frontend Arena Virtual Lab</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50/70 rounded-2xl p-6 border border-purple-100 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#6546E8] font-bold">
                <HelpCircle className="w-4 h-4" />
                <span>Instant Answers via AI</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Need quick answers regarding document formats or B.Tech/MBBS schemes? Try clicking the floating <strong>GRANTLY AI</strong> icon at the bottom right corner of your screen!
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            {submitted ? (
              <div className="text-center py-8 space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Message Delivered!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Your message regarding <strong>{form.subject}</strong> has been securely delivered to{' '}
                  <strong className="text-slate-800">business.atharvk@gmail.com</strong>.
                </p>
                {deliveryInfo.messageId && (
                  <p className="text-[11px] font-mono text-slate-400">
                    Dispatch Reference: {deliveryInfo.messageId}
                  </p>
                )}
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', subject: 'General Inquiry', message: '' });
                    setDeliveryInfo({});
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#6546E8] bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Send Us a Message</h2>

                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="student@college.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Scholarship Eligibility Question">Scholarship Eligibility Question</option>
                    <option value="Document Attestation Guidance">Document Attestation Guidance</option>
                    <option value="Report Broken Scholarship Link">Report Outdated Scholarship Link</option>
                    <option value="Institutional Partnership">College / University Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your query or the scholarship scheme you need assistance with..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 text-xs sm:text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Delivering to business.atharvk@gmail.com...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
