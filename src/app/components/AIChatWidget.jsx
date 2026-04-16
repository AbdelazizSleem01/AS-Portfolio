'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, User, Bot, Loader2, Sparkles, Minus } from 'lucide-react';

export default function AIChatWidget() {
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
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Toggle Chat"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center border border-white/20">
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
            className="fixed bottom-24 right-6 z-50 w-[420px] max-w-[calc(100vw-3rem)] h-[500px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/20 dark:border-white/10"
          >
            {/* Header */}
            <div className="relative p-6 pb-4 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border-b border-white/20 dark:border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full shadow-sm"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg dark:text-white flex items-center gap-1.5">
                      AI Assistant
                      <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 font-medium">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                      Online & Ready
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500 dark:text-gray-400"
                >
                  <Minus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 px-6"
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-blue-50 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-blue-500" />
                  </div>
                  <h4 className="text-xl font-bold dark:text-white mb-2">Hello!</h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    I'm your AI assistant. I can help you with anything about this portfolio!
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
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm
                      ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
                    >
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed
                        ${msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : msg.role === 'admin'
                          ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-gray-800 dark:text-gray-100 rounded-tl-none border border-amber-200 dark:border-amber-700/50'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700/50'
                        }`}
                      >
                        {msg.role === 'admin' && (
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-200/50 dark:border-amber-700/30">
                            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Owner Reply</span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 px-1 font-medium">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Assistant is thinking...</span>
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
                  className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 m-4 rounded-2xl text-white shadow-xl"
                >
                  <p className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Get notified when the owner replies:
                  </p>
                  <form onSubmit={handleEmailSubmit} className="flex gap-2">
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="Enter your email..."
                      className="flex-1 px-4 py-2 text-sm bg-white/20 border border-white/30 rounded-xl placeholder:text-white/60 focus:outline-none focus:bg-white/30 transition-all"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white text-blue-600 text-sm font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                    >
                      Save
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="p-6 pt-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <form onSubmit={sendMessage} className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full pl-6 pr-14 py-4 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="absolute right-2 top-2 bottom-2 w-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-blue-500/30"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
