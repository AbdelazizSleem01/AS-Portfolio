"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function AdminFeedbackList() {

  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null); 

  useEffect(() => {
    document.title = `All Feedbacks | ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      `See all feedbacks submitted by visitors on ${process.env.NEXT_PUBLIC_META_TITLE}.`
    );
  }, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch("/api/feedback");
        if (!res.ok) throw new Error("Failed to fetch feedback");
        const data = await res.json();
        setFeedbacks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const confirmDelete = (feedback) => {
    setSelectedFeedback(feedback); 
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedFeedback) return;

    try {
      setIsDeleting(true);
      const response = await fetch(
        `/api/feedback/${selectedFeedback._id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete feedback");
      }

      setFeedbacks(prev => prev.filter(f => f._id !== selectedFeedback._id));
      toast.success("Feedback deleted successfully! 🌟");
    } catch (err) {
      console.error("Error deleting feedback:", err);
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedFeedback(null);
    }
  };
  return (
    <div className="Heading flex flex-col items-center p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">Manage Feedback</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : feedbacks.length === 0 ? (
        <p>No feedback available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {feedbacks.map((feedback) => (
            <motion.div
              key={feedback._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="card bg-neutral shadow-xl p-2"
            >
              <div className="card-body">
                <div className="flex items-center space-x-4">
                  <img
                    src={feedback.imageUrl}
                    alt={feedback.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow-md"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-base-100">{feedback.name}</h2>
                    <p className="text-sm text-base-100/50">{feedback.email}</p>
                  </div>
                </div>
                <p className="mt-4 text-base-100/90">{feedback.comment}</p>

                <div className="mt-4 flex space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-3xl ${i < feedback.rating ? "text-primary" : "text-gray-500"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => confirmDelete(feedback)}
                  className="btn btn-error mt-4"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-base-100 p-6 rounded-lg shadow-lg mx-4 max-w-md w-full border border-primary"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Confirm Deletion
            </h2>
            <p className="mb-6 text-neutral">
              Are you sure you want to delete feedback of <b className="text-primary">{selectedFeedback?.name}</b> from feedbacks ?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-error text-white rounded-md hover:bg-error/90 transition-colors flex items-center justify-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
