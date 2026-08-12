"use client";
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Send, Loader2, User, Mail, MessageCircle, Star } from 'lucide-react';

export default function FeedbackForm({ setFeedbacks }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('comment', comment);
    formData.append('rating', rating);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('🌟 Feedback submitted successfully!');
        setName('');
        setEmail('');
        setComment('');
        setRating(5);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setFeedbacks(prev => [result.feedback, ...prev]);
      } else {
        throw new Error(result.error || 'Failed to submit feedback');
      }
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-base-200 rounded-3xl p-4 sm:p-8 shadow-2xl border border-base-300 w-full overflow-hidden"
    >
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        <h2 className="text-2xl sm:text-3xl font-bold text-base-content">Share Your Feedback</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-base sm:text-lg font-semibold text-base-content flex items-center gap-2">
              <User className="w-4 h-4" />
              Your Name
            </span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered input-primary w-full bg-base-100 focus:bg-base-100 text-base-content placeholder-base-content/50 rounded-2xl px-4 py-3 text-sm sm:text-base min-w-0"
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-base sm:text-lg font-semibold text-base-content flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered input-primary w-full bg-base-100 focus:bg-base-100 text-base-content placeholder-base-content/50 rounded-2xl px-4 py-3 text-sm sm:text-base min-w-0"
            placeholder="your.email@example.com"
            required
          />
        </div>
      </div>

      <div className="form-control w-full mb-4 sm:mb-6">
        <label className="label">
          <span className="label-text text-base sm:text-lg font-semibold text-base-content flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Your Feedback
          </span>
        </label>
        <textarea
          value={comment}
          ref={fileInputRef}
          onChange={(e) => setComment(e.target.value)}
          className="textarea textarea-bordered textarea-primary w-full bg-base-100 focus:bg-base-100 text-base-content placeholder-base-content/50 rounded-2xl px-4 py-3 h-32 resize-none text-sm sm:text-base min-w-0"
          placeholder="Share your experience working with me..."
          required
        />
      </div>

      <div className="form-control w-full mb-6 sm:mb-8">
        <label className="label">
          <span className="label-text text-base sm:text-lg font-semibold text-base-content flex items-center gap-2">
            <Star className="w-4 h-4" />
            Rating
          </span>
        </label>
        <div className="flex gap-1.5 sm:gap-2 justify-start flex-wrap">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all ${star <= rating
                  ? 'bg-primary text-base-100 shadow-lg'
                  : 'bg-base-300 text-base-content/50 hover:bg-base-400'
                }`}
              onClick={() => setRating(star)}
              aria-label={`${star} star rating`}
            >
              <Star className={`w-5 h-5 sm:w-6 sm:h-6 ${star <= rating ? 'fill-current' : ''}`} />
            </motion.button>
          ))}
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary to-secondary text-base-100 py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl font-semibold text-base sm:text-lg flex items-center justify-center gap-3 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            Submit Feedback
            <Send className="w-5 h-5" />
          </>
        )}
      </motion.button>
    </motion.form>
  );
}