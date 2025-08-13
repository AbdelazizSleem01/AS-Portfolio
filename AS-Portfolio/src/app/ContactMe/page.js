"use client"
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const ContactPage = () => {

  // meta title
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = `Contact Me | ${process.env.NEXT_PUBLIC_META_TITLE}`;
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute(
          "content",
          `Contact me for any questions, inquiries, or collaboration opportunities at ${process.env.NEXT_PUBLIC_META_TITLE}.`
        );
      // kaywords
      document.querySelector('meta[name="keywords"]')
        ?.setAttribute(
          "content",
          "contact, message, send, email, portfolio, web developer, software engineer, freelance"
        );
    }
  }, []);



  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fieldVariant = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to send your message');
      }

      toast.success('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setError(err.message || 'Something went wrong, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-base-100 p-8 mt-12"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto my-10 p-6 border border-primary text-neutral shadow-lg rounded-lg"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
        }}
      >
        <motion.h2
          className="text-3xl font-semibold text-center mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Contact Me
        </motion.h2>

        {error && (
          <motion.div
            className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Name Field */}
        <motion.div className="mb-4" variants={fieldVariant}>
          <label className="block text-sm label font-medium">Name</label>
          <input
            type="text"
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </motion.div>

        {/* Email Field */}
        <motion.div
          className="mb-4"
          variants={fieldVariant}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm label font-medium">Email</label>
          <input
            type="email"
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </motion.div>

        {/* Subject Field */}
        <motion.div
          className="mb-4"
          variants={fieldVariant}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm label font-medium">Subject</label>
          <input
            type="text"
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            required
          />
        </motion.div>

        {/* Message Field */}
        <motion.div
          className="mb-6"
          variants={fieldVariant}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm label font-medium">Message</label>
          <textarea
            className="w-full bg-neutral/10 p-3 mt-1 textarea textarea-bordered h-40 rounded-md"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            required
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={fieldVariant} transition={{ delay: 0.4 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary rounded-md text-white font-medium hover:bg-primary/80"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default ContactPage;
