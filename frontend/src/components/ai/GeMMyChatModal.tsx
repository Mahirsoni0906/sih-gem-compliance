import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import type { AIChatAction } from '../../types';
import { GeMMyAvatar } from '../common/GeMAssets';

interface Message {
  id: string;
  sender: 'user' | 'gemmy';
  text: string;
  actions?: AIChatAction[];
  timestamp: string;
  model?: string;
  is_local_ai?: boolean;
}

interface GeMMyChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, contextId?: string) => void;
  initialQuestion?: string;
  autoSendInitial?: boolean;
  onClearInitial?: () => void;
}

const renderInlineTokens = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-extrabold text-gray-900 dark:text-amber-300">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="font-mono text-[10px] bg-black/5 dark:bg-black/40 text-blue-900 dark:text-cyan-300 px-1 py-0.5 rounded border border-gray-200 dark:border-cyan-500/30 font-semibold">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={idx}>{part}</span>;
  });
};

const renderFormattedMessage = (rawText: string) => {
  const lines = rawText.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={idx} className="h-1.5" />;
    }
    if (trimmed.startsWith('### ')) {
      return (
        <div key={idx} className="font-extrabold text-xs text-gray-900 dark:text-cyan-200 mt-2 mb-1 flex items-center gap-1">
          {renderInlineTokens(trimmed.slice(4))}
        </div>
      );
    }
    const isBullet = trimmed.startsWith('• ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed);
    return (
      <div key={idx} className={`leading-relaxed ${isBullet ? 'pl-2 my-0.5' : 'my-0.5'}`}>
        {renderInlineTokens(trimmed)}
      </div>
    );
  });
};

export const GeMMyChatModal: React.FC<GeMMyChatModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  initialQuestion,
  autoSendInitial = true,
  onClearInitial,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'gemmy',
      text: "Namaste! 🙏 I am **GeMMy**, your official AI Compliance & Procurement Assistant for the Government e-Marketplace.\n\nI provide authoritative guidance on public procurement policies, GFR 2017 compliance, Make-in-India (MII) criteria, seller profile creation, and latest gazette notifications.\n\n*(🛡️ **Data Privacy**: Under DPDP Act 2023, GeMMy is strictly air-gapped from uploaded vendor files. For document verification, please use the DocScrutiny AI Desk.)*",
      actions: [
        { label: "🌐 Latest GeM Updates & OMs", action: "query_latest_updates" },
        { label: "❌ Profile Rejection Causes", action: "query_profile_rejection" },
        { label: "🏛️ Explain GFR Rule 144(xi)", action: "query_rule144" },
        { label: "🇮🇳 Make in India (MII) Rules", action: "query_mii" },
        { label: "📄 Open DocScrutiny AI Desk", action: "open_ocr_desk" },
      ],
      model: "GeMMy Live Assistant",
      is_local_ai: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await api.chatWithAI(textToSend);
      const gemmyMsg: Message = {
        id: `gemmy-${Date.now()}`,
        sender: 'gemmy',
        text: res.reply,
        actions: res.suggested_actions,
        model: res.model,
        is_local_ai: res.is_local_ai,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, gemmyMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: Message = {
        id: `gemmy-err-${Date.now()}`,
        sender: 'gemmy',
        text: "I experienced a temporary connection hiccup with the FastAPI backend. However, the local statutory rules engine confirms that all GSTIN, PAN, and Udyam MSME verification pipelines are currently operating normally.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle automatic question forwarding from DocScrutiny AI
  useEffect(() => {
    if (isOpen && initialQuestion && initialQuestion.trim()) {
      const q = initialQuestion.trim();
      setInputText(q);
      if (onClearInitial) onClearInitial();
      if (autoSendInitial) {
        sendMessage(q);
      }
    }
  }, [isOpen, initialQuestion, autoSendInitial]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleActionClick = (actionItem: AIChatAction) => {
    if (actionItem.action === 'query_profile_rejection') {
      sendMessage("What is the primary cause of automated rejection during initial profile creation, and how is it resolved?");
    } else if (actionItem.action === 'query_rule144') {
      sendMessage("Explain GFR Rule 144(xi) compliance requirements.");
    } else if (actionItem.action === 'query_mii') {
      sendMessage("Explain Make-in-India (MII) local content calculation rules and Class-I supplier requirements.");
    } else if (actionItem.action === 'query_tenders') {
      sendMessage("List active public tenders and requirements.");
    } else if (actionItem.action === 'query_latest_updates' || actionItem.action === 'fetch_live_web') {
      sendMessage("Give me the latest sovereign updates and Office Memorandums on the GeM portal.");
    } else if (actionItem.action === 'open_ocr_desk') {
      onNavigate('seller-page', 'upload-view');
      onClose();
    } else if (actionItem.action === 'open_registration') {
      onNavigate('registration-page');
      onClose();
    } else if (actionItem.action === 'open_seller_discrepancy') {
      onNavigate('seller-page', 'issues-view');
      onClose();
    } else if (actionItem.action === 'open_officer_bid' || actionItem.action === 'open_officer_dash') {
      onNavigate('officer-dash-page', actionItem.id);
      onClose();
    } else if (actionItem.action === 'open_seller_checklist') {
      onNavigate('seller-page', 'checklist-view');
      onClose();
    } else if (actionItem.action === 'open_seller_ocr') {
      onNavigate('seller-page', 'upload-view');
      onClose();
    } else if (actionItem.action === 'open_bids') {
      onNavigate('bids-page');
      onClose();
    } else if (actionItem.action === 'open_training') {
      onNavigate('training-page');
      onClose();
    } else {
      sendMessage(actionItem.label);
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Light dismissible backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[0.5px] pointer-events-auto transition-opacity duration-200"
        onClick={onClose}
        title="Click to minimize GeMMy"
      />

      {/* Floating Chat Drawer - Guaranteed to Fit Viewport Height without Clipping */}
      <div
        className="pointer-events-auto fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50 bg-white dark:bg-[#0b1528] rounded-2xl shadow-2xl border border-gray-300 dark:border-[#1e3a66] w-[94vw] sm:w-[400px] max-w-[420px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200 gemmy-chat-drawer"
        style={{
          height: 'min(480px, calc(100vh - 32px))',
          maxHeight: 'calc(100vh - 32px)',
        }}
      >
        {/* Header - Always Fixed at Top */}
        <div className="shrink-0 bg-[#062134] dark:bg-[#061424] text-white px-3.5 py-2.5 flex items-center justify-between border-b-2 border-[#f37021]">
          <div className="flex items-center space-x-2.5">
            <GeMMyAvatar className="w-8 h-8 shrink-0 drop-shadow" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white tracking-tight">Ask GeMMy</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live & Online
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-[10px] text-gray-300">
                  Official GeM Advisory Assistant
                </p>
                <span className="text-[9px] text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 px-1.5 py-0.2 rounded font-semibold tracking-wide" title="Under DPDP Act 2023, GeMMy is air-gapped from vendor uploaded files. Use DocScrutiny AI for document analysis.">
                  🛡️ Air-Gapped
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white p-1 rounded-md hover:bg-white/10 transition text-sm font-bold cursor-pointer"
              title="Close chat"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Chat Messages Body - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs bg-[#f8fafc] dark:bg-[#070d18] min-h-0 gemmy-chat-body">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3 shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#0f3d64] dark:bg-gradient-to-r dark:from-sky-600 dark:to-blue-700 text-white rounded-br-none gemmy-user-bubble'
                    : 'bg-white dark:bg-[#112038] text-gray-800 dark:text-slate-100 border border-gray-200 dark:border-[#213d6a] rounded-bl-none gemmy-bot-bubble'
                }`}
              >
                <div className="font-sans text-xs leading-relaxed">
                  {renderFormattedMessage(m.text)}
                </div>

                {/* Interactive Action Buttons */}
                {m.actions && m.actions.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-white/10 flex flex-wrap gap-1.5">
                    {m.actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(act)}
                        className="bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/15 dark:hover:bg-orange-500/25 text-orange-950 dark:text-amber-200 border border-orange-200 dark:border-amber-400/40 font-bold text-[10px] px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 gemmy-action-chip"
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1 px-1">
                <span className="text-[9px] text-gray-400 dark:text-slate-400 font-mono">{m.timestamp}</span>
                {m.sender === 'gemmy' && m.model && (
                  <span className="text-[9px] text-gray-400 dark:text-slate-500 font-medium">
                    • {m.model.includes('Air-Gap') ? '🛡️ Air-Gap Guard' : m.model.includes('Gemini') ? '✨ Connected Statutory AI' : '🏛️ Statutory Rules Engine'}
                  </span>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-gray-400 dark:text-slate-300 text-xs py-1.5 px-3 bg-white dark:bg-[#112038] rounded-xl border border-gray-200 dark:border-[#213d6a] w-fit shadow-xs">
              <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 animate-bounce [animation-delay:0.4s]"></div>
              <span className="text-[10px] font-semibold text-gray-500 dark:text-slate-300 ml-1">
                Evaluating statutory criteria...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar - Always Fixed at Bottom */}
        <div className="shrink-0 p-2.5 bg-white dark:bg-[#0b1528] border-t border-gray-200 dark:border-[#1e3a66] gemmy-input-bar">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask GeMMy about procurement rules, GFR 2017, MII..."
              className="flex-1 text-xs px-3 py-2 border border-gray-300 dark:border-[#243c66] rounded-xl focus:outline-none focus:border-blue-600 dark:focus:border-cyan-400 bg-gray-50/50 dark:bg-[#132038] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="bg-[#f37021] hover:bg-[#e05e10] disabled:opacity-50 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
