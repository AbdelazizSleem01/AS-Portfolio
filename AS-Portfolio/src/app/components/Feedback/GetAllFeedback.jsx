"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function FeedbackList({ feedbacks }) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.5
      }
    },
    exit: { opacity: 0, y: -50, scale: 0.95 }
  };

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 6);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {feedbacks.slice(0, visibleCount).map((feedback, index) => (
          <motion.div
            key={feedback._id}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: false, 
              amount: 0.2,
              margin: "0px 0px -100px 0px" 
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ delay: index * 0.1 }}
            className="card bg-neutral shadow-xl cursor-pointer  text-wrap"
          >
            <div className="card-body w-full">
              <div className="flex items-center space-x-2 w-full">
                {/* <motion.img
                  src={feedback.imageUrl}
                  alt={feedback.name}
                  className="w-16 h-16 rounded-full object-contain border-2 border-primary p-0 shadow-md shadow-primary"
                /> */}
                <div>
                  <h2 className="card-title text-base-100 text-lg font-bold">{feedback.name}</h2>
                  {/* <p className="text-sm text-base-100/50">{feedback.email}</p> */}
                </div>
              </div>
              <p className="mt-4 text-base-100/70 text-sm">{feedback.comment}</p>
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-3xl  ${i < feedback.rating ? 'text-primary ' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {feedbacks.length > visibleCount && (
        <motion.button
          onClick={loadMore}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`btn btn-primary mb-8 ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </motion.button>
      )}
    </div>
  );
}
