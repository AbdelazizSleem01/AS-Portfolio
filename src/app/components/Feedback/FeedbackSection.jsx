"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Users, Quote } from 'lucide-react';
import FeedbackForm from './CreateFeedbackForm';
import FeedbackList from './GetAllFeedback';

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({ total: 0, averageRating: 0 });

  useEffect(() => {
    fetch('/api/feedback')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFeedbacks(data);
          calculateStats(data);
        } else {
          console.error("Expected array but got:", data);
          setFeedbacks([]);
        }
      })
      .catch(err => {
        console.error("Error fetching feedback:", err);
        setFeedbacks([]);
      });
  }, []);

  const calculateStats = (feedbacksList) => {
    if (!Array.isArray(feedbacksList)) return;
    const total = feedbacksList.length;
    const averageRating = total > 0
      ? (feedbacksList.reduce((sum, feedback) => sum + feedback.rating, 0) / total).toFixed(1)
      : 0;
    setStats({ total, averageRating });
  };

  return (
    <div className="min-h-screen bg-base-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <MessageSquare className="text-4xl text-primary" />
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Client Feedback
            </h1>
          </motion.div>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Hear what others have to say about working with me
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-12 mb-12 sm:mb-16">
          <div className="lg:col-span-2">
            <FeedbackForm setFeedbacks={setFeedbacks} />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-base-200 rounded-3xl p-5 sm:p-8 shadow-xl border border-base-300">
              <h3 className="text-xl sm:text-2xl font-bold text-base-content mb-6 flex items-center gap-3">
                <Users className="text-primary" />
                Feedback Stats
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 sm:p-4 bg-base-100 rounded-2xl">
                  <span className="text-sm sm:text-base text-base-content/70">Total Reviews</span>
                  <span className="text-xl sm:text-2xl font-bold text-primary">{stats.total}</span>
                </div>

                <div className="flex items-center justify-between p-3.5 sm:p-4 bg-base-100 rounded-2xl">
                  <span className="text-sm sm:text-base text-base-content/70">Average Rating</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-primary">{stats.averageRating}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${star <= stats.averageRating
                            ? 'text-yellow-400 fill-current'
                            : 'text-base-300'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-5 sm:p-8 border border-primary/20">
              <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-4" />
              <p className="text-sm sm:text-base text-base-content/80 italic mb-4">
                "Your feedback helps me grow and improve. Thank you for taking the time to share your experience!"
              </p>
              <p className="text-xs sm:text-sm text-base-content/60">- Abdelaziz Sleem</p>
            </div>
          </motion.div>
        </div>

        <FeedbackList feedbacks={feedbacks} />
      </div>
    </div>
  );
}