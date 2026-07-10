"use client";

import { useUser, RedirectToSignIn } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

export default function PendingQuestionsPage() {
  const { user, isLoaded } = useUser();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [response, setResponse] = useState('');
  const [sending, setSending] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (isLoaded && user) {
      fetchQuestions();
    }
  }, [isLoaded, user, refreshKey]);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/pending-questions');
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!selectedQuestion || !response.trim()) return;

    setSending(true);
    try {
      const res = await fetch('/api/pending-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedQuestion.sessionId,
          response: response.trim(),
          questionId: selectedQuestion.questionId
        })
      });

      if (res.ok) {
        setResponse('');
        setSelectedQuestion(null);
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to send response:', error);
    } finally {
      setSending(false);
    }
  };

  if (!isLoaded) {
    return (
      <AdminLayout pageTitle="Loading Questions...">
        <div className="flex items-center justify-center p-8">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return <RedirectToSignIn />;
  }

  return (
    <AdminLayout pageTitle="Pending Questions">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Questions List */}
          <div className="bg-base-200 rounded-3xl p-6 shadow-lg border border-base-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-base-content">
                Questions ({questions.length})
              </h2>
              <button
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="btn btn-sm btn-ghost"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-base-content/70">No pending questions!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {questions.map((q) => (
                  <motion.div
                    key={q.sessionId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setSelectedQuestion(q)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedQuestion?.sessionId === q.sessionId
                        ? 'bg-primary text-primary-content'
                        : 'bg-base-100 hover:bg-base-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-2">{q.question}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs opacity-70">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(q.createdAt).toLocaleDateString()}
                          </span>
                          {q.userEmail && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {q.userEmail}
                            </span>
                          )}
                        </div>
                      </div>
                      {q.hasReply && (
                        <span className="badge badge-success badge-sm">Replied</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Response Form */}
          <div className="bg-base-200 rounded-3xl p-6 shadow-lg border border-base-300">
            {selectedQuestion ? (
              <form onSubmit={handleSubmitResponse}>
                <h2 className="text-xl font-semibold text-base-content mb-4">
                  Respond to Question
                </h2>

                <div className="mb-4 p-4 bg-base-100 rounded-xl">
                  <p className="text-sm text-base-content/70 mb-2">Question:</p>
                  <p className="text-base-content">{selectedQuestion.question}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-base-content/50">
                    <span>From: {selectedQuestion.userName || 'Anonymous'}</span>
                    {selectedQuestion.userEmail && (
                      <>
                        <span>|</span>
                        <span>{selectedQuestion.userEmail}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Your Response
                  </label>
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Type your response here..."
                    className="textarea textarea-bordered w-full h-40"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={sending || !response.trim()}
                    className="btn btn-primary flex-1"
                  >
                    {sending ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Response
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedQuestion(null)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <MessageSquare className="w-16 h-16 text-base-content/30 mb-4" />
                <p className="text-base-content/50 text-center">
                  Select a question from the list to respond
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
