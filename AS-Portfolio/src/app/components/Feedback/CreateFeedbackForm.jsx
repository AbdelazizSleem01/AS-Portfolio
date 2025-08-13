// components/FeedbackForm.js
"use client";
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { MoveRight, Loader2 } from 'lucide-react'; // Import Loader2 for the spinner

export default function FeedbackForm({ setFeedbacks }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  // const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('comment', comment);
    formData.append('rating', rating);
    // formData.append('image', image);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('🌟 Feedback submitted successfully!');
        // Clear form fields with animation
        setName('');
        setEmail('');
        setComment('');
        setRating(5);
        // setImage(null);
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
      setLoading(false); // Set loading to false when submission is complete
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-2xl mx-auto p-6 bg-base-200 rounded-box shadow-lg mb-11"
    >
      <h2 className="text-3xl font-bold text-center text-primary mb-8">
        Share Your Feedback
      </h2>

      {/* Name Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-lg font-semibold text-base-content">Name</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered input-primary focus:input-primary text-base-content placeholder-opacity-50"
          placeholder="Your name"
          required
        />
      </div>

      {/* Email Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-lg font-semibold text-base-content">Email</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered input-primary focus:input-primary"
          placeholder="this email not appear for all clients"
          required
        />
      </div>

      {/* Comment Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-lg font-semibold text-base-content">Comment</span>
        </label>
        <textarea
          value={comment}
          ref={fileInputRef}
          onChange={(e) => setComment(e.target.value)}
          className="textarea textarea-bordered textarea-primary focus:textarea-primary h-32"
          placeholder="Share your thoughts..."
          required
        />
      </div>

      {/* Rating Stars */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-lg font-semibold text-base-content">Rating</span>
        </label>
        <div className="rating rating-lg gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileTap={{ scale: 0.9 }}
              className={`w-6 h-6 mask mask-star-2  ${star <= rating
                ? 'bg-primary hover:bg-primary-focus'
                : 'bg-base-300 hover:bg-base-200'
                } transition-colors duration-200`}
              onClick={() => setRating(star)}
              aria-label={`${star} star rating`}
            />
          ))}
        </div>
      </div>

      {/* Image Upload */}
      {/* <div className="form-control">
        <label className="label" htmlFor='image'>
          <span className="label-text text-lg font-semibold text-base-content">Upload Image</span>
        </label>
        <div className="flex flex-col items-center gap-4">
          <input
            id='image'
            name='image'
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="file-input file-input-bordered file-input-primary w-full"
            accept="image/*"
            required
          />
          {image && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 relative group"
            >
              <motion.img
                src={URL.createObjectURL(image)}
                alt="Uploaded preview"
                className="w-48 h-48 object-cover rounded-full shadow-lg border-4 border-primary"
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="btn btn-circle btn-error btn-xs absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </motion.div>
          )}
        </div>
      </div> */}

      {/* Submit Button */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn btn-primary btn-block bg-primary btn-lg mt-8 shadow-md"
      // disabled={loading} 
      >
        {loading ? (
          <>
            Submit Feedback <Loader2 className="animate-spin" />
          </>
        ) : (
          <>
            Submit Feedback
            <MoveRight />
          </>
        )}
      </motion.button>
    </motion.form>
  );
}