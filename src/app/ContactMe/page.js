"use client"
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiMail, 
  FiUser, 
  FiMessageSquare, 
  FiSend,
  FiMapPin,
  FiPhone,
  FiClock,
  FiLinkedin,
  FiGithub
} from 'react-icons/fi';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
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
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMail,
      label: 'Email',
      value: 'abdelazizsleem957@gmail.com',
      href: 'mailto:abdelazizsleem957@gmail.com'
    },
    {
      icon: FiPhone,
      label: 'Phone',
      value: '+20 101 210 5407',
      href: 'tel:+201012105407'
    },
    {
      icon: FiMapPin,
      label: 'Location',
      value: 'Egypt',
      href: '#'
    },
    {
      icon: FiClock,
      label: 'Response Time',
      value: 'Within 24 hours',
      href: '#'
    }
  ];

  const socialLinks = [
    {
      icon: FiGithub,
      label: 'GitHub',
      href: 'https://github.com/AbdelazizSleem01',
      color: 'hover:text-gray-700'
    },
    {
      icon: FiLinkedin,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/abdelaziz-sleem-600a1027a/',
      color: 'hover:text-blue-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <FiMail className="text-4xl text-primary" />
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Get In Touch
            </h1>
          </motion.div>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            I'm always open to discussing new opportunities and interesting projects. 
            Let's create something amazing together!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div
            className="lg:col-span-1 space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Contact Info Cards */}
            <motion.div
              className="bg-base-100 rounded-3xl p-8 shadow-xl border border-base-300"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <FiUser className="text-primary" />
                Contact Information
              </h3>
              
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-base-200 hover:bg-base-300 transition-all duration-300 group"
                    whileHover={{ x: 5 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="bg-primary/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors">
                      <item.icon className="text-2xl text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-base-content">{item.label}</p>
                      <p className="text-base-content/70 text-sm">{item.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-6 border-t border-base-300">
                <h4 className="text-lg font-semibold text-base-content mb-4">Follow Me</h4>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`bg-base-200 p-4 rounded-2xl text-base-content/70 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="text-2xl" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.form
              onSubmit={handleSubmit}
              className="bg-base-100 rounded-3xl p-8 shadow-xl border border-base-300"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <FiMessageSquare className="text-primary" />
                Send Me a Message
              </h3>

              {error && (
                <motion.div
                  className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl text-error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-error rounded-full"></div>
                    {error}
                  </div>
                </motion.div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Name Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-base-content mb-3">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40 text-lg" />
                    <input
                      type="text"
                      className="w-full bg-base-200 pl-12 pr-4 py-4 rounded-2xl border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </motion.div>

                {/* Email Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-base-content mb-3">
                    Email Address *
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40 text-lg" />
                    <input
                      type="email"
                      className="w-full bg-base-200 pl-12 pr-4 py-4 rounded-2xl border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </motion.div>
              </div>

              {/* Subject Field */}
              <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-sm font-semibold text-base-content mb-3">
                  Subject *
                </label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40 text-lg" />
                  <input
                    type="text"
                    className="w-full bg-base-200 pl-12 pr-4 py-4 rounded-2xl border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
              </motion.div>

              {/* Message Field */}
              <motion.div variants={itemVariants} className="mb-8">
                <label className="block text-sm font-semibold text-base-content mb-3">
                  Message *
                </label>
                <div className="relative">
                  <textarea
                    className="w-full bg-base-200 p-4 rounded-2xl border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 min-h-[150px] resize-vertical"
                    placeholder="Tell me about your project, questions, or anything you'd like to discuss..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 px-8 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <FiSend className="text-xl" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;