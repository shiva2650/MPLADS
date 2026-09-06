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
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1B3022] text-white shadow-xl hover:bg-[#284431] border border-[#C8D5B9] transition-transform hover:scale-105 cursor-pointer font-sans"
        >
          <Bot className="w-5 h-5 text-[#A3B18A]" />
          <div className="text-left">
            <div className="text-xs font-bold leading-tight">Ask MPLADS AI</div>
            <div className="text-[10px] text-[#C8D5B9] leading-tight">जन सहायता • ప్రజా సహాయం</div>
          </div>
        </button>
      )}

      {/* Slide-over Drawer */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-96 max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl border border-[#DDE5D4] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Masthead Header */}
          <div className="bg-[#1B3022] text-white p-3.5 flex items-center justify-between border-b-2 border-[#C8D5B9]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#263D2E] text-white">
                <Bot className="w-4 h-4 text-[#A3B18A]" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-tight flex items-center gap-1.5">
                  <span>MPLADS Citizen Inquiry AI</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#395C40] text-white font-mono">
                    RAG Grounded
                  </span>
                </div>
                <div className="text-[10px] text-[#A3B18A]">
                  Multilingual: English • हिन्दी • తెలుగు • தமிழ்
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-[#C8D5B9] hover:text-white hover:bg-[#263D2E] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="bg-[#F8F9F7] px-3 py-2 border-b border-[#DDE5D4] flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap">
            <span className="text-gray-400 text-[10px] font-semibold">Try:</span>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(qp.query)}
                className="px-2 py-0.5 rounded-full bg-white border border-[#C8D5B9] text-[#2D4A32] hover:bg-[#EAF0E6] transition-colors cursor-pointer"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs bg-[#FAFBF9]">
            {messages.map((m) => {
              const isBot = m.sender === 'bot';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-end justify-end'}`}
                >
                  {isBot && (
                    <div className="w-6 h-6 rounded-full bg-[#1B3022] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-2xs leading-relaxed ${
                      isBot
                        ? 'bg-white text-[#1B3022] border border-[#DDE5D4]'
                        : 'bg-[#395C40] text-white rounded-br-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.text}</div>

                    {/* Retrieved official project cards */}
                    {m.retrievedProjects && m.retrievedProjects.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-[#DDE5D4] space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#588157]">
                          Official Records Grounding ({m.retrievedProjects.length} Works)
                        </div>
                        {m.retrievedProjects.map((rp: any) => (
                          <div
                            key={rp.id}
                            className="bg-[#F8F9F7] p-2 rounded-lg border border-[#C8D5B9] text-[11px]"
                          >
                            <div className="font-bold text-[#1B3022] truncate">{rp.title}</div>
                            <div className="text-gray-500 mt-0.5 flex items-center justify-between">
                              <span>₹{rp.sanctionedAmountLakhs}L | Progress: {rp.completionPercentage}%</span>
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                  rp.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {rp.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-[9px] text-gray-400 text-right mt-1">
                      {m.timestamp}
                    </div>
                  </div>

                  {!isBot && (
                    <div className="w-6 h-6 rounded-full bg-[#395C40] text-white flex items-center justify-center text-[10px] shrink-0 mb-0.5">
                      U
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#588157] bg-white p-2.5 rounded-xl border border-[#DDE5D4] w-fit shadow-2xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Searching official MPLADS records...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-2.5 bg-white border-t border-[#DDE5D4]">
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
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#C8D5B9] bg-[#F8F9F7] text-[#1B3022] focus:outline-hidden focus:ring-1 focus:ring-[#395C40]"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || loading}
                className="p-2 rounded-lg bg-[#1B3022] text-white hover:bg-[#284431] disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <div className="text-[9px] text-gray-400 text-center mt-1">
              Grounded exclusively in open MPLADS administrative data.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
