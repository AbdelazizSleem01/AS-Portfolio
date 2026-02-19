'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

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
  const audioRef = useRef(null);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    try {
      // Create a simple notification tone using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
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

    // Get stored email
    const storedEmail = localStorage.getItem('chatUserEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }

    // Fetch knowledge base
    fetch('/api/knowledge-base')
      .then(res => res.json())
      .then(data => setKnowledgeBase(data))
      .catch(err => console.error('Failed to load knowledge base:', err));

    // Load previous messages
    if (storedSession) {
      fetch(`/api/chat?sessionId=${storedSession}`)
        .then(res => res.json())
        .then(data => {
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
            // Get the last owner response content
            const ownerMsg = data.messages.filter(m => m.role === 'admin').pop();
            if (ownerMsg) {
              setLastReplyContent(ownerMsg.content);
            }
            // Check if there's a pending question that needs email
            const lastMsg = data.messages[data.messages.length - 1];
            if (lastMsg.isQuestion && !lastMsg.userEmail) {
              setShowEmailForm(true);
            }
          }
        })
        .catch(err => console.error('Failed to load messages:', err));
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check for new owner replies and play sound
  const checkForNewReplies = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      const res = await fetch(`/api/chat/notification?sessionId=${sessionId}`);
      const data = await res.json();
      
      if (data.hasNewReply && data.reply) {
        // Check if this is a new reply we haven't shown yet
        if (data.reply.content !== lastReplyContent) {
          setLastReplyContent(data.reply.content);
          setHasNewNotification(true);
          
          // Play notification sound
          playNotificationSound();
          
          // If chat is open, fetch the new messages
          if (isOpen) {
            const messagesRes = await fetch(`/api/chat?sessionId=${sessionId}`);
            const messagesData = await messagesRes.json();
            setMessages(messagesData.messages || []);
          }
        }
      }
    } catch (err) {
      console.error('Check replies error:', err);
    }
  }, [sessionId, lastReplyContent, isOpen, playNotificationSound]);

  // Poll for new messages when chat is open
  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const interval = setInterval(checkForNewReplies, 5000);
    return () => clearInterval(interval);
  }, [isOpen, sessionId, checkForNewReplies]);

  // Check for replies when chat is closed
  useEffect(() => {
    if (isOpen || !sessionId) return;

    checkForNewReplies();
    const interval = setInterval(checkForNewReplies, 10000);
    return () => clearInterval(interval);
  }, [isOpen, sessionId, checkForNewReplies]);

  // Reset notification when opening chat
  useEffect(() => {
    if (isOpen) {
      setHasNewNotification(false);
    }
  }, [isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

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

      if (data.needsEmail) {
        setShowEmailForm(true);
      }

      // Reload messages to get the full conversation
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

    // Re-send the last question with email
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
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Open AI Chat"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {hasNewNotification && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              </span>
            )}
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
            <h3 className="font-bold text-lg">AI Assistant</h3>
            <p className="text-sm text-white/80">Ask me about this portfolio</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p>Hello! How can I help you today?</p>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'admin' && (
                  <div className="w-full mb-2">
                    <div className="flex items-center justify-center">
                      <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Owner Response
                      </span>
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md'
                      : msg.role === 'admin'
                      ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/40 dark:to-orange-900/40 text-gray-800 dark:text-gray-100 rounded-bl-md border border-amber-200 dark:border-amber-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-md'
                  }`}
                >
                  {msg.role === 'admin' && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-200 dark:border-amber-700">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AS</span>
                      </div>
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Abdelaziz Sleem</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <span className="text-xs opacity-60 mt-2 block">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Email Form */}
          {showEmailForm && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border-t border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                Please provide your email to get notified when I respond:
              </p>
              <form onSubmit={handleEmailSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg"
                >
                  Save
                </button>
              </form>
            </div>
          )}

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 border-t dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-full dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
