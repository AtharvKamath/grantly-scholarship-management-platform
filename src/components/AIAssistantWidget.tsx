import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  X,
  Send,
  Sparkles,
  RefreshCw,
  Minus,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  error?: boolean;
}

export const AIAssistantWidget: React.FC = () => {
  const { isAIAssistantOpen, setIsAIAssistantOpen, scholarships, studentProfile } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello ${studentProfile?.fullName || 'there'}! I am GRANTLY AI. I can guide you through scholarship discovery, verify eligibility criteria, explain required certificates, and track deadlines. How can I help today?`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAIAssistantOpen, loading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLastUserMessage(textToSend.trim());
    if (!messageText) setInput('');
    setLoading(true);
    setHasError(false);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          conversationHistory: messages.slice(-4).map((m) => ({
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
        text: data.reply || 'I am ready to help with your scholarship search.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setHasError(true);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: 'GRANTLY AI encountered a momentary connection error. You can click Retry below to try again.',
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
      handleSend(lastUserMessage);
    }
  };

  const quickPrompts = [
    { label: 'Suitable schemes', query: `Which scholarships match my ${studentProfile?.course || 'degree'} course?` },
    { label: 'Required documents', query: 'What documents do I need to prepare for scholarship applications?' },
    { label: 'Deadlines this month', query: 'Which scholarships have deadlines approaching soon?' },
  ];

  return (
    <>
      {/* Closed State: Compact 48px-52px circular logo with subtle shadow and hover animation */}
      {!isAIAssistantOpen && (
        <div className="fixed bottom-5 right-5 z-40 group">
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
            Chat with GRANTLY AI
          </div>

          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="w-12 h-12 rounded-full bg-[#6546E8] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-108 transition-all duration-200 cursor-pointer border border-white/20 active:scale-95"
            aria-label="Chat with GRANTLY AI"
          >
            <Bot className="w-6 h-6 text-white" />
          </button>
        </div>
      )}

      {/* Open State: Compact Modern Chatbot Window */}
      {isAIAssistantOpen && (
        <div
          className="fixed bottom-5 right-5 z-50 w-[360px] sm:w-[380px] h-[500px] max-h-[82vh] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Compact Header */}
          <div className="px-4 py-3 bg-[#142B4F] text-white flex items-center justify-between shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#6546E8] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold flex items-center gap-1 text-white">
                  <span>GRANTLY AI Assistant</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </h3>
                <span className="text-[10px] text-purple-200 block -mt-0.5">
                  Verified Scholarship Guide
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <button
                onClick={() => setIsAIAssistantOpen(false)}
                className="p-1 rounded-md hover:bg-white/10 hover:text-white transition-colors"
                title="Minimize window"
                aria-label="Minimize"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsAIAssistantOpen(false)}
                className="p-1 rounded-md hover:bg-white/10 hover:text-white transition-colors"
                title="Close chat"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 overflow-x-auto flex items-center gap-1.5 shrink-0">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp.query)}
                disabled={loading}
                className="whitespace-nowrap px-2 py-0.5 text-[10px] font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:border-[#6546E8] hover:text-[#6546E8] transition-colors shrink-0 disabled:opacity-50"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Scrollable Conversation History */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 bg-[#F7F8FC]/60 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#142B4F] text-white rounded-tr-xs'
                      : m.error
                      ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-tl-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs">{m.text}</p>
                  <span
                    className={`text-[9px] mt-1 block tabular-nums ${
                      m.sender === 'user' ? 'text-slate-300 text-right' : 'text-slate-400 text-left'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing / Loading Animation */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2 rounded-tl-xs shadow-2xs flex items-center gap-2 text-xs text-slate-500">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#6546E8]" />
                  <span>GRANTLY AI is thinking...</span>
                </div>
              </div>
            )}

            {/* Error with Retry button */}
            {hasError && !loading && (
              <div className="flex justify-start">
                <button
                  onClick={handleRetry}
                  className="px-3 py-1 bg-white border border-rose-300 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-50 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry Question</span>
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Compact Input Box */}
          <div className="p-2.5 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about scholarships or eligibility..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#6546E8]"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 bg-[#6546E8] hover:bg-[#5337ca] disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer shrink-0"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
