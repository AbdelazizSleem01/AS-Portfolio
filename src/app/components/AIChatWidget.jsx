'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, User, Bot, Loader2, Sparkles, Minus, Plus, Trash2, History, MessageSquarePlus, ChevronRight } from 'lucide-react';
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
  const [sessions, setSessions] = useState([]);
  const [showSessionsDrawer, setShowSessionsDrawer] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const messagesEndRef = useRef(null);

  const logoSrc = theme === 'dark' ? '/bot-logo-black-br.png' : '/bot-logo-red-br.png';

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

  const loadSavedSessions = useCallback(() => {
    try {
      const storedList = localStorage.getItem('chatSessionsList');
      if (storedList) {
        setSessions(JSON.parse(storedList));
      }
    } catch (e) {
      console.error('Failed to load saved sessions', e);
    }
  }, []);

  const saveSessionMeta = useCallback((sid, firstMessageText, msgCount) => {
    try {
      const stored = localStorage.getItem('chatSessionsList');
      let currentSessions = stored ? JSON.parse(stored) : [];
      
      const existingIdx = currentSessions.findIndex(s => s.id === sid);
      const now = new Date().toISOString();

      if (existingIdx > -1) {
        currentSessions[existingIdx].updatedAt = now;
        if (firstMessageText && (currentSessions[existingIdx].title === 'محادثة جديدة' || !currentSessions[existingIdx].title)) {
          currentSessions[existingIdx].title = firstMessageText.length > 32 
            ? firstMessageText.substring(0, 32) + '...' 
            : firstMessageText;
        }
        if (msgCount !== undefined) {
          currentSessions[existingIdx].count = msgCount;
        }
      } else {
        const titleText = firstMessageText 
          ? (firstMessageText.length > 32 ? firstMessageText.substring(0, 32) + '...' : firstMessageText)
          : 'محادثة جديدة';
        currentSessions.unshift({
          id: sid,
          title: titleText,
          updatedAt: now,
          count: msgCount || 1
        });
      }

      localStorage.setItem('chatSessionsList', JSON.stringify(currentSessions));
      setSessions(currentSessions);
    } catch (e) {
      console.error('Failed to save session meta', e);
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

    loadSavedSessions();

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
            const userFirstMsg = data.messages.find(m => m.role === 'user');
            if (userFirstMsg) {
              saveSessionMeta(storedSession, userFirstMsg.content, data.messages.length);
            }
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
  }, [loadSavedSessions, saveSessionMeta]);

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

  const createNewChat = () => {
    const newSid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chatSessionId', newSid);
    setSessionId(newSid);
    setMessages([]);
    setShowSessionsDrawer(false);
    setShowConfirmClear(false);
    saveSessionMeta(newSid, 'محادثة جديدة', 0);
  };

  const clearCurrentChat = async () => {
    if (!sessionId) return;
    try {
      await fetch(`/api/chat?sessionId=${sessionId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete chat session:', err);
    }

    setMessages([]);
    setShowConfirmClear(false);

    try {
      const stored = localStorage.getItem('chatSessionsList');
      if (stored) {
        const filtered = JSON.parse(stored).filter(s => s.id !== sessionId);
        localStorage.setItem('chatSessionsList', JSON.stringify(filtered));
        setSessions(filtered);
      }
    } catch (e) {}

    // Start a fresh session
    const freshSid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chatSessionId', freshSid);
    setSessionId(freshSid);
  };

  const switchSession = async (targetId) => {
    if (targetId === sessionId) {
      setShowSessionsDrawer(false);
      return;
    }
    setSessionId(targetId);
    localStorage.setItem('chatSessionId', targetId);
    setLoading(true);
    setShowSessionsDrawer(false);
    try {
      const res = await fetch(`/api/chat?sessionId=${targetId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to load target session:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSpecificSession = async (targetId, e) => {
    e.stopPropagation();
    try {
      await fetch(`/api/chat?sessionId=${targetId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete session:', err);
    }

    const updated = sessions.filter(s => s.id !== targetId);
    setSessions(updated);
    localStorage.setItem('chatSessionsList', JSON.stringify(updated));

    if (targetId === sessionId) {
      if (updated.length > 0) {
        switchSession(updated[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Save session title preview if first user message
    if (messages.length === 0) {
      saveSessionMeta(sessionId, userMessage, 1);
    } else {
      saveSessionMeta(sessionId, null, messages.length + 2);
    }

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
      const updatedMsgs = messagesData.messages || [];
      setMessages(updatedMsgs);
      saveSessionMeta(sessionId, userMessage, updatedMsgs.length);
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

  const renderFormattedContent = (content, isUser = false) => {
    if (!content) return null;
    if (isUser) {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }

    const lines = content.split('\n');

    return (
      <div className="space-y-1.5 leading-relaxed text-sm">
        {lines.map((line, lineIdx) => {
          if (!line.trim()) return <div key={lineIdx} className="h-1.5" />;

          const parts = [];
          let lastIndex = 0;
          const combinedRegex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|(https?:\/\/[^\s]+)/g;
          let match;
          let keyCounter = 0;

          while ((match = combinedRegex.exec(line)) !== null) {
            if (match.index > lastIndex) {
              parts.push(line.substring(lastIndex, match.index));
            }

            if (match[1] && match[2]) {
              const linkText = match[1];
              const linkUrl = match[2];
              const isExternal = linkUrl.startsWith('http') || linkUrl.startsWith('mailto:') || linkUrl.startsWith('tel:');
              parts.push(
                <a
                  key={`link-${lineIdx}-${keyCounter++}`}
                  href={linkUrl}
                  target={isExternal ? '_blank' : '_self'}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="text-primary font-bold underline underline-offset-2 hover:opacity-80 transition-opacity inline-flex items-center gap-0.5"
                >
                  {linkText}
                </a>
              );
            } else if (match[3]) {
              parts.push(
                <strong key={`bold-${lineIdx}-${keyCounter++}`} className="font-bold text-base-content">
                  {match[3]}
                </strong>
              );
            } else if (match[4]) {
              const rawUrl = match[4];
              parts.push(
                <a
                  key={`raw-${lineIdx}-${keyCounter++}`}
                  href={rawUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-bold underline underline-offset-2 hover:opacity-80 transition-opacity break-all"
                >
                  {rawUrl}
                </a>
              );
            }

            lastIndex = combinedRegex.lastIndex;
          }

          if (lastIndex < line.length) {
            parts.push(line.substring(lastIndex));
          }

          const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');

          return (
            <p key={lineIdx} className={isBullet ? 'pl-2 border-r-2 border-primary/40 pr-2 my-1' : ''}>
              {parts.length > 0 ? parts : line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group cursor-pointer"
        aria-label="Toggle Chat"
      >
        {/* Soft Ambient Radial Glow */}
        <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-full blur-xl group-hover:bg-primary/40 transition-all duration-300 scale-125"></div>

        {/* Clean Logo Button Container */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-base-100/90 dark:bg-base-200/90 backdrop-blur-md shadow-2xl flex items-center justify-center p-2 border border-primary/20 hover:border-primary/50 transition-all duration-300">
          {isOpen ? (
            <X className="w-6 h-6 sm:w-7 sm:h-7 text-primary transition-transform duration-300 rotate-90" />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={logoSrc}
                alt="AS Bot Logo"
                className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
              />
              {hasNewNotification && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 z-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-base-100 items-center justify-center text-[10px] font-bold text-white shadow-md">
                    1
                  </span>
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
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[80vh] bg-base-100 text-base-content backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-base-300"
          >
            {/* Header */}
            <div className="relative p-4 pb-3.5 bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-base-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-base-200 border border-primary/20 flex items-center justify-center shadow-md overflow-hidden p-1.5">
                      <img src={logoSrc} alt="AS Assistant Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-base-100 rounded-full shadow-sm"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-base-content flex items-center gap-1.5">
                      AS AI Assistant
                      <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-primary font-semibold">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      Online & Ready
                    </div>
                  </div>
                </div>

                {/* Control Action Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={createNewChat}
                    title="محادثة جديدة"
                    className="p-1.5 hover:bg-base-200 rounded-xl transition-colors text-base-content/70 hover:text-primary"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowSessionsDrawer(!showSessionsDrawer)}
                    title="المحادثات السابقة"
                    className={`p-1.5 hover:bg-base-200 rounded-xl transition-colors text-base-content/70 hover:text-primary relative ${showSessionsDrawer ? 'bg-base-200 text-primary' : ''}`}
                  >
                    <History className="w-4 h-4" />
                    {sessions.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </button>
                  <button
                    onClick={() => setShowConfirmClear(!showConfirmClear)}
                    title="مسح هذه المحادثة"
                    className={`p-1.5 hover:bg-base-200 rounded-xl transition-colors text-base-content/70 hover:text-red-500 ${showConfirmClear ? 'bg-red-500/10 text-red-500' : ''}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-base-200 rounded-xl transition-colors text-base-content/70"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Confirm Clear Overlay Banner */}
            <AnimatePresence>
              {showConfirmClear && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border-b border-red-500/20 px-4 py-2.5 flex items-center justify-between text-xs text-red-600 dark:text-red-400"
                >
                  <span className="font-semibold">هل ترغب في مسح هذه المحادثة نهائياً؟</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearCurrentChat}
                      className="px-2.5 py-1 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                    >
                      تأكيد المسح
                    </button>
                    <button
                      onClick={() => setShowConfirmClear(false)}
                      className="px-2 py-1 bg-base-200 text-base-content rounded-lg hover:bg-base-300 transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Area: either Messages or Sessions Drawer */}
            <div className="flex-1 relative overflow-hidden flex flex-col bg-base-100">
              {/* Sessions Drawer Overlay */}
              <AnimatePresence>
                {showSessionsDrawer && (
                  <motion.div
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute inset-0 z-20 bg-base-100 flex flex-col border-l border-base-300"
                  >
                    <div className="p-4 border-b border-base-300 flex items-center justify-between bg-base-200/50">
                      <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-primary" />
                        <h4 className="font-bold text-sm text-base-content">المحادثات السابقة</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={createNewChat}
                          className="px-2.5 py-1 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-1 hover:opacity-90 transition-opacity shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          جديدة
                        </button>
                        <button
                          onClick={() => setShowSessionsDrawer(false)}
                          className="p-1 hover:bg-base-200 rounded-lg text-base-content/70"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
                      {sessions.length === 0 ? (
                        <div className="text-center py-12 text-sm text-base-content/50">
                          لا توجد محادثات محفوظة حتى الآن
                        </div>
                      ) : (
                        sessions.map((s) => {
                          const isActive = s.id === sessionId;
                          return (
                            <motion.div
                              key={s.id}
                              whileHover={{ scale: 1.01 }}
                              onClick={() => switchSession(s.id)}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group
                                ${isActive 
                                  ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border-primary text-primary font-semibold shadow-sm' 
                                  : 'bg-base-200/60 hover:bg-base-200 border-base-300 text-base-content'
                                }`}
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : 'text-base-content/50'}`} />
                                <div className="truncate text-right">
                                  <p className="text-xs font-medium truncate">{s.title || 'محادثة'}</p>
                                  <span className="text-[10px] opacity-60 block mt-0.5">
                                    {s.updatedAt ? new Date(s.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={(e) => deleteSpecificSession(s.id, e)}
                                title="حذف المحادثة"
                                className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-hide">
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
                      أنا المساعد الذكي لـ Abdelaziz Sleem. يمكنني إجابتك عن أي استفسار تخص الأعمال والخدمات والتواصل والمشاريع!
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
                          {renderFormattedContent(msg.content, msg.role === 'user')}
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


