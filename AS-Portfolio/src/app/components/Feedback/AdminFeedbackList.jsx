"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import Swal from 'sweetalert2';
import { Trash2 } from "lucide-react";

export default function AdminFeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const { user } = useUser();



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

    // SweetAlert2 confirmation for delete
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete feedback from ${feedback.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(feedback._id);
      }
    });
  };

  const handleDelete = async (feedbackId) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete feedback");
      }

      setFeedbacks((prev) => prev.filter((f) => f._id !== feedbackId));
      Swal.fire('Deleted!', 'Feedback deleted successfully! 🌟', 'success');
    } catch (err) {
      console.error("Error deleting feedback:", err);
      Swal.fire('Error!', err.message || 'Failed to delete feedback', 'error');
    } finally {
      setIsDeleting(false);
      setSelectedFeedback(null);
    }
  };
  if (!user) {
    return <RedirectToSignIn />;
  }
  return (
    <div className="Heading flex flex-col items-center p-4 mt-20">
      <h1 className="text-2xl semiHead w-full font-bold mb-4">Manage Feedback</h1>

      {isLoading ? (
        <motion.div
          className="flex flex-col items-center justify-center h-screen gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-t-4 border-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <motion.span
            className="text-primary text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Loading Feedbacks...
          </motion.span>
        </motion.div>

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
                  className="btn btn-error mt-4 text-white"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      Delete
                      <Trash2 size={18} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}