import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  Send,
  RefreshCw,
  Minus,
  AlertCircle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  FileText,
  Clock,
  ShieldCheck,
  User,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  error?: boolean;
}

export const GrantlyAIAssistantPage: React.FC = () => {
  const { studentProfile, scholarships } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello ${studentProfile?.fullName || 'Scholar'}! I am GRANTLY AI Assistant, your dedicated scholarship advisor. I can answer questions about scholarship eligibility criteria, required verification documents, official application steps, and deadlines. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState('');
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLastUserMessage(text.trim());
    if (!textToSend) setInput('');
    setLoading(true);
    setHasError(false);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          conversationHistory: messages.slice(-5).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
          context: {
            studentProfile,
            availableScholarships: scholarships.map((s) => ({
              id: s.id,
              name: s.name,
              organization: s.organization,
              amount: s.amountDisplay,
              deadline: s.deadline,
              educationLevel: s.educationLevel,
              eligibleCourses: s.eligibleCourses,
              maxFamilyIncome: s.maxFamilyIncome,
            })),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I am ready to help you discover suitable scholarships.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setHasError(true);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: 'GRANTLY AI Assistant encountered a connection error. Please click "Retry" below.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage);
    }
  };

  const quickPrompts = [
    'Which scholarships match my degree course?',
    'What documents are needed for need-based scholarships?',
    'How do I apply on the official government portal?',
    'Are there grants closing this month?',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6546E8] flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-[#6546E8]" />
            AI Scholarship Advisor
          </span>
          <h1 className="text-2xl font-extrabold text-[#142B4F] tracking-tight mt-1">
            GRANTLY AI Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Ask scholarship-related questions, verify eligibility requirements, and receive guidance based on verified database records.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active & Ready</span>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
        {/* Suggestion Chips */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Suggested Queries:
          </span>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#6546E8] hover:border-[#6546E8] transition-colors whitespace-nowrap cursor-pointer text-[11px]"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F7F8FC]">
          {messages.map((m) => {
            const isAssistant = m.sender === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${isAssistant ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                    isAssistant ? 'bg-[#6546E8] text-white' : 'bg-[#142B4F] text-white'
                  }`}
                >
                  {isAssistant ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>

                <div className={`max-w-[80%] space-y-1 ${isAssistant ? 'text-left' : 'text-right'}`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isAssistant
                        ? m.error
                          ? 'bg-rose-50 text-rose-800 border border-rose-200 shadow-xs'
                          : 'bg-white text-slate-800 border border-slate-200 shadow-xs'
                        : 'bg-[#142B4F] text-white shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 px-1">{m.timestamp}</span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#6546E8] text-white flex items-center justify-center text-xs shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 shadow-xs flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6546E8] animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#6546E8] animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#6546E8] animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px]">GRANTLY AI Assistant is consulting database...</span>
              </div>
            </div>
          )}

          {/* Error state retry */}
          {hasError && !loading && (
            <div className="flex justify-start pl-9">
              <button
                onClick={handleRetry}
                className="px-3 py-1 bg-white border border-rose-300 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-50 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry Message</span>
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Field */}
        <div className="p-3.5 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask GRANTLY AI Assistant about scholarships, documents, or eligibility..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-[#142B4F] hover:bg-[#6546E8] text-white rounded-xl transition-colors cursor-pointer disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
