'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { RedirectToSignIn, useUser } from '@clerk/nextjs';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const { user } = useUser();

  if (!user) {
    return <RedirectToSignIn />;

  }

  useEffect(() => {
    document.title = `Contacts | ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        `View and manage my contact messages on ${process.env.NEXT_PUBLIC_META_TITLE}`
      );
  }, []);


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    disabled: { opacity: 0.7, scale: 0.98 }
  };

  // Fetch all contact messages on mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/contact');
        if (res.ok) {
          toast.success("Contact messages fetched successfully!")
        }
        if (!res.ok) throw new Error('Failed to fetch contacts');
        const data = await res.json();
        setContacts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContacts();
  }, []);

  // Handle changes in the reply text area
  const handleReplyChange = (id, value) => {
    setReplyTexts((prev) => ({ ...prev, [id]: value }));
  };

  // Submit the reply
  const submitReply = async (id) => {
    const reply = replyTexts[id];
    if (!reply) return;

    setLoadingId(id);
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: reply }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit reply");
      }

      const updatedContact = await res.json();
      setContacts((prev) =>
        prev.map((contact) => contact._id === id ? updatedContact : contact)
      );
      setReplyTexts((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-8 bg-base-100 text-foreground mt-16"
    >
      <div className="Heading max-w-4xl mx-auto">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl semiHead font-bold mb-8 text-center text-primary"
        >
          Contact Messages
        </motion.h1>

        <AnimatePresence>
          {contacts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-base-100"
            >
              No contact messages found.
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {contacts.map((contact) => (
                <motion.div
                  key={contact._id}
                  variants={itemVariants}
                  exit="exit"
                  className="bg-base-100 rounded-xl shadow-lg p-6 transition-all hover:shadow-xl border border-primary/20"
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {contact.name[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral">{contact.name}</h3>
                        <p className="text-sm text-primary">{contact.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-primary">Subject:</span>
                        <p className="text-neutral">{contact.subject}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-primary">Message:</span>
                        <p className="text-neutral whitespace-pre-wrap">{contact.message}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-primary">Received:</span>
                        <p className="text-sm text-neutral">
                          {new Date(contact.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {contact.response ? (
                      <div className="mt-4 p-4 bg-accent/20 rounded-lg">
                        <span className="text-sm font-medium text-success">Your Response:</span>
                        <p className="text-neutral mt-1 whitespace-pre-wrap">
                          {contact.response}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <motion.textarea
                          initial={{ scale: 0.98, opacity: 0.9 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-full p-4 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-base-200"
                          placeholder="Type your response here..."
                          rows="4"
                          value={replyTexts[contact._id] || ''}
                          onChange={(e) => handleReplyChange(contact._id, e.target.value)}
                        />

                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          disabled={loadingId === contact._id}
                          animate={loadingId === contact._id ? "disabled" : "visible"}
                          onClick={() => submitReply(contact._id)}
                          className="w-full py-3 px-6 bg-primary hover:bg-primary/90 text-base-100 font-medium rounded-lg disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                        >
                          {loadingId === contact._id ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-base-100 border-t-transparent rounded-full animate-spin" />
                              <span>Submitting...</span>
                            </div>
                          ) : (
                            'Submit Response'
                          )}
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ContactsPage;