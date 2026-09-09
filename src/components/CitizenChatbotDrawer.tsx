import React, { useState } from 'react';
import { api } from '../services/api.js';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Languages,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Info
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  language?: string;
  retrievedProjects?: any[];
  timestamp: string;
}

export const CitizenChatbotDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: 'Namaste! I am the Official MPLADS Public Transparency AI Assistant. You can ask me in English, Hindi (हिन्दी), Telugu (తెలుగు), or Tamil (தமிழ்) about any developmental project, sanction status, or expenditure in your constituency.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickPrompts = [
    { label: 'Hindi', query: 'हैदराबाद में स्कूल निर्माण परियोजनाओं की क्या स्थिति है?' },
    { label: 'Telugu', query: 'హైదరాబాద్‌లో ఎన్ని పనులు మంజూరయ్యాయి మరియు పురోగతి ఎంత?' },
    { label: 'English', query: 'Which projects are flagged as delayed or high risk?' },
    { label: 'Budget', query: 'What is the sanctioned budget for Community Hall in Ward 14?' }
  ];

  const handleSendQuery = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.queryChatbot(q);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.answer,
        language: res.detectedLanguage,
        retrievedProjects: res.retrievedProjects,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: 'Unable to retrieve records right now. Please verify network connectivity or check project code.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          id="open-chatbot-btn"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-govt-navy text-white shadow-xl hover:bg-govt-navy-light border border-white/20 transition-transform hover:scale-105 cursor-pointer font-sans"
        >
          <div className="p-1 rounded-full bg-white/10">
            <Bot className="w-5 h-5 text-govt-saffron" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold leading-tight">Ask MPLADS AI</div>
            <div className="text-[10px] text-panel-bg/80 leading-tight">जन सहायता • Citizen Assistant</div>
          </div>
        </button>
      )}

      {/* Slide-over Drawer */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-96 max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Masthead Header */}
          <div className="bg-govt-navy text-white p-3.5 flex items-center justify-between border-b border-govt-navy-dark">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-govt-navy-light text-white">
                <Bot className="w-4 h-4 text-govt-saffron" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-tight flex items-center gap-1.5">
                  <span>MPLADS Citizen Inquiry AI</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-govt-saffron text-govt-navy-dark font-bold font-mono">
                    RAG Grounded
                  </span>
                </div>
                <div className="text-[10px] text-panel-bg/80">
                  Multilingual: English • हिन्दी • తెలుగు • தமிழ்
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-panel-bg/80 hover:text-white hover:bg-govt-navy-light transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="bg-panel-bg px-3 py-2 border-b border-slate-border flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap">
            <span className="text-slate-muted text-[10px] font-semibold">Try:</span>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(qp.query)}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-border text-govt-navy hover:bg-panel-bg font-medium transition-colors cursor-pointer"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs bg-panel-bg">
            {messages.map((m) => {
              const isBot = m.sender === 'bot';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-end justify-end'}`}
                >
                  {isBot && (
                    <div className="w-6 h-6 rounded-full bg-govt-navy text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-2xs leading-relaxed ${
                      isBot
                        ? 'bg-white text-slate-body border border-slate-border'
                        : 'bg-govt-navy text-white rounded-br-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.text}</div>

                    {/* Retrieved official project cards */}
                    {m.retrievedProjects && m.retrievedProjects.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-border space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-govt-navy">
                          Official Records Grounding ({m.retrievedProjects.length} Works)
                        </div>
                        {m.retrievedProjects.map((rp: any) => (
                          <div
                            key={rp.id}
                            className="bg-panel-bg p-2 rounded-lg border border-slate-border text-[11px]"
                          >
                            <div className="font-bold text-slate-body truncate">{rp.title}</div>
                            <div className="text-slate-muted mt-0.5 flex items-center justify-between">
                              <span>₹{rp.sanctionedAmountLakhs}L | Progress: {rp.completionPercentage}%</span>
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                                  rp.status === 'Completed' ? 'bg-panel-bg text-status-verified border-status-verified/30' : 'bg-panel-bg text-status-review border-status-review/30'
                                }`}
                              >
                                {rp.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-[9px] text-slate-muted text-right mt-1">
                      {m.timestamp}
                    </div>
                  </div>

                  {!isBot && (
                    <div className="w-6 h-6 rounded-full bg-govt-saffron text-govt-navy-dark flex items-center justify-center text-[10px] font-bold shrink-0 mb-0.5">
                      U
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-govt-navy bg-white p-2.5 rounded-xl border border-slate-border w-fit shadow-2xs font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Searching official MPLADS records...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-2.5 bg-white border-t border-slate-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about projects, funds, delays..."
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-border bg-panel-bg text-slate-body focus:outline-hidden focus:ring-1 focus:ring-govt-navy"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || loading}
                className="p-2 rounded-lg bg-govt-navy text-white hover:bg-govt-navy-light disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <div className="text-[9px] text-slate-muted text-center mt-1">
              Grounded exclusively in open MPLADS administrative data.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
