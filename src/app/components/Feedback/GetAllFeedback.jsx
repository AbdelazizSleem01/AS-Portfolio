"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, Calendar, Plus } from 'lucide-react';

export default function FeedbackList({ feedbacks = [] }) {
  const safeFeedbacks = Array.isArray(feedbacks) ? feedbacks : [];
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 6);
      setIsLoading(false);
    }, 500);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-base-content mb-4">
          What People Say
        </h2>
        <p className="text-lg text-base-content/70">
          Real feedback from clients and collaborators
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {safeFeedbacks.slice(0, visibleCount).map((feedback, index) => (
            <motion.div
              key={feedback._id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{
                scale: 1.02,
                y: -5,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
              transition={{ delay: index * 0.1 }}
              className="bg-base-200 rounded-3xl p-6 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary rounded-2xl flex items-center justify-center text-base-100 font-bold text-lg">
                    {feedback.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content group-hover:text-primary transition-colors">
                      {feedback.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-base-content/60">
                      <Calendar className="w-3 h-3" />
                      {formatDate(feedback.createdAt)}
                    </div>
                  </div>
                </div>
                <Quote className="w-5 h-5 text-primary/40 group-hover:text-primary/60 transition-colors" />
              </div>

              <p className="text-base-content/80 mb-4 line-clamp-4 group-hover:line-clamp-none transition-all">
                "{feedback.comment}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= feedback.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-base-300'
                        }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-base-content/40">
                  {feedback.rating}/5
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {safeFeedbacks.length > visibleCount && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center pt-8"
        >
          <motion.button
            onClick={loadMore}
            disabled={isLoading}
            className="bg-gradient-to-r from-primary to-secondary text-base-100 px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isLoading ? 1 : 1.05, y: isLoading ? 0 : -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-base-100 border-t-transparent rounded-full animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Load More Reviews
                <span className="text-sm opacity-80">
                  ({safeFeedbacks.length - visibleCount} remaining)
                </span>
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {safeFeedbacks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Quote className="text-6xl text-base-content/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-base-content/70 mb-2">
            No Reviews Yet
          </h3>
          <p className="text-base-content/50">
            Be the first to share your experience!
          </p>
        </motion.div>
      )}
    </div>
  );
}