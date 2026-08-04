'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, User, Bot, Loader2, Sparkles, Minus } from 'lucide-react';
import { useCurrentTheme } from '@/utils/useCurrentTheme';

const adminPrefixes = [
  "/admin",
  "/Dashboard",
  "/addCategory",
  "/addCertificate",
  "/addExperience",
  "/addHeader",
  "/addProject",
  "/addSkill",
  "/allCategories",
  "/allCertificates",
  "/allExperiences",
  "/allFeedbacks",
  "/allHeaders",
  "/allProjects",
  "/allSkills",
  "/blog/create-post-open",
  "/blog/admin-posts",
  "/contacts",
  "/pending-questions",
  "/Subscribe-Page",
  "/updateCategory",
  "/updateCertificates",
  "/updateExperience",
  "/updateHeader",
  "/updateProject",
  "/updateSkill",
  "/visits",
];

export default function AIChatWidget() {
  const pathname = usePathname();
  const theme = useCurrentTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [lastReplyContent, setLastReplyContent] = useState('');
  const messagesEndRef = useRef(null);

  const logoSrc = theme === 'dark' ? '/new-logo.png' : '/red-logo.png';

  const isAdmin = adminPrefixes.some(
    (prefix) => pathname === prefix || pathname?.startsWith(prefix + "/")
  );

  if (isAdmin) return null;

  const playNotificationSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 830.61; // Ab5
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, []);

  // Initialize session
  useEffect(() => {
    let storedSession = localStorage.getItem('chatSessionId');
    if (!storedSession) {
      storedSession = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatSessionId', storedSession);
    }
    setSessionId(storedSession);

    const storedEmail = localStorage.getItem('chatUserEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }

    fetch('/api/knowledge-base')
      .then(res => res.json())
      .then(data => setKnowledgeBase(data))
      .catch(err => console.error('Failed to load knowledge base:', err));

    if (storedSession) {
      fetch(`/api/chat?sessionId=${storedSession}`)
        .then(res => res.json())
        .then(data => {
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
            const ownerMsg = data.messages.filter(m => m.role === 'admin').pop();
            if (ownerMsg) setLastReplyContent(ownerMsg.content);
            const lastMsg = data.messages[data.messages.length - 1];
            if (lastMsg.isQuestion && !lastMsg.userEmail) {
              setShowEmailForm(true);
            }
          }
        })
        .catch(err => console.error('Failed to load messages:', err));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const checkForNewReplies = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/chat/notification?sessionId=${sessionId}`);
      const data = await res.json();
      if (data.hasNewReply && data.reply && data.reply.content !== lastReplyContent) {
        setLastReplyContent(data.reply.content);
        setHasNewNotification(true);
        playNotificationSound();
        if (isOpen) {
          const messagesRes = await fetch(`/api/chat?sessionId=${sessionId}`);
          const messagesData = await messagesRes.json();
          setMessages(messagesData.messages || []);
        }
      }
    } catch (err) {
      console.error('Check replies error:', err);
    }
  }, [sessionId, lastReplyContent, isOpen, playNotificationSound]);

  useEffect(() => {
    const interval = setInterval(checkForNewReplies, isOpen ? 5000 : 15000);
    return () => clearInterval(interval);
  }, [isOpen, sessionId, checkForNewReplies]);

  useEffect(() => {
    if (isOpen) setHasNewNotification(false);
  }, [isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Optimistic update
    const optimisticMsg = { role: 'user', content: userMessage, createdAt: new Date() };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
          userEmail,
          knowledgeBase
        })
      });

      const data = await res.json();
      if (data.needsEmail) setShowEmailForm(true);

      const messagesRes = await fetch(`/api/chat?sessionId=${sessionId}`);
      const messagesData = await messagesRes.json();
      setMessages(messagesData.messages || []);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail.trim()) return;
    localStorage.setItem('chatUserEmail', userEmail);
    setShowEmailForm(false);
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (lastUserMessage) {
      setLoading(true);
      try {
        await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: lastUserMessage.content,
            sessionId,
            userEmail,
            knowledgeBase
          })
        });
        const messagesRes = await fetch(`/api/chat?sessionId=${sessionId}`);
        const messagesData = await messagesRes.json();
        setMessages(messagesData.messages || []);
      } catch (error) {
        console.error('Failed to update email:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Toggle Chat"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity animate-pulse"></div>
        <div className="relative bg-gradient-to-r from-primary to-secondary text-base-100 p-4 rounded-full shadow-2xl flex items-center justify-center border border-white/20">
          {isOpen ? (
            <X className="w-6 h-6 transition-transform rotate-90" />
          ) : (
            <div className="relative">
              <MessageSquare className="w-6 h-6" />
              {hasNewNotification && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white items-center justify-center text-[10px] font-bold">1</span>
                </span>
              )}
            </div>
          )}
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[420px] max-w-[calc(100vw-3rem)] h-[520px] bg-base-100 text-base-content backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-base-300"
          >
            {/* Header */}
            <div className="relative p-5 pb-4 bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-base-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-2xl bg-base-200 border border-primary/20 flex items-center justify-center shadow-md overflow-hidden p-1.5">
                      <img src={logoSrc} alt="AS Assistant Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-base-100 rounded-full shadow-sm"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-base-content flex items-center gap-1.5">
                      AS AI Assistant
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      Online & Ready
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-base-200 rounded-xl transition-colors text-base-content/70"
                >
                  <Minus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-hide bg-base-100">
              {messages.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-10 px-4"
                >
                  <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20">
                    <img src={logoSrc} alt="AS Logo" className="w-10 h-10 object-contain" />
                  </div>
                  <h4 className="text-lg font-bold text-base-content mb-1">مرحباً بك! 👋</h4>
                  <p className="text-sm text-base-content/70">
                    أنا المساعد الذكي لـ Abdelaziz Sleem. يمكنني إجابتك عن أي استفسار تخص الأعمال والخدمات!
                  </p>
                </motion.div>
              )}
              
              {messages.map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={index}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex items-start gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden p-1
                      ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-base-200 border border-base-300'}`}
                    >
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <img src={logoSrc} alt="Bot" className="w-full h-full object-contain" />
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed
                        ${msg.role === 'user' 
                          ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-none' 
                          : msg.role === 'admin'
                          ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 text-base-content rounded-tl-none border border-amber-500/30'
                          : 'bg-base-200 text-base-content rounded-tl-none border border-base-300'
                        }`}
                      >
                        {msg.role === 'admin' && (
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-500/20">
                            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Owner Reply</span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <span className="text-[10px] text-base-content/50 px-1 font-medium">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-base-200 border border-base-300 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-base-content/70 font-medium">المساعد الذكي يفكر...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Email Form Overlay */}
            <AnimatePresence>
              {showEmailForm && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="p-4 bg-gradient-to-r from-primary to-secondary m-3 rounded-2xl text-white shadow-xl"
                >
                  <p className="text-sm font-medium mb-2.5 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    أدخل بريدك الإلكتروني ليصلك إشعار فور رد صاحب الموقع:
                  </p>
                  <form onSubmit={handleEmailSubmit} className="flex gap-2">
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="بريدك الإلكتروني..."
                      className="flex-1 px-3 py-1.5 text-sm bg-white/20 border border-white/30 rounded-xl placeholder:text-white/70 focus:outline-none focus:bg-white/30 transition-all text-white"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-white text-primary text-sm font-bold rounded-xl hover:bg-white/90 transition-colors shadow-md"
                    >
                      حفظ
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="p-4 pt-2 bg-base-200/60 backdrop-blur-sm border-t border-base-300">
              <form onSubmit={sendMessage} className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full pl-5 pr-12 py-3 bg-base-100 border border-base-300 rounded-2xl text-base-content focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-base-content/50 text-sm"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="absolute right-1.5 top-1.5 bottom-1.5 w-9 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

