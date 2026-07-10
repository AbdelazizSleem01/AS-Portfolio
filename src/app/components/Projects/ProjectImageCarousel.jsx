"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiMaximize2 } from "react-icons/fi";

const ProjectImageCarousel = ({ project }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomedImage, setZoomedImage] = useState(null);

  const images = ((project.images && project.images.length > 0)
    ? project.images
    : (project.imageUrl ? [project.imageUrl] : [])).filter(Boolean);

  useEffect(() => {
    // Reset index when project changes
    setCurrentIndex(0);
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images]);

  if (images.length === 0) {
    return (
      <div className="h-60 flex items-center justify-center bg-base-200 rounded-2xl border border-base-300">
        <span className="text-base-content/40">No preview image available</span>
      </div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative group/carousel w-full rounded-2xl overflow-hidden border-2 border-base-300 bg-neutral/5 shadow-md">
      {/* Slider viewport */}
      <div className="relative w-full flex items-center justify-center overflow-hidden h-80 sm:h-[450px] md:h-[500px] bg-black/[0.02]">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${project.title} - Preview ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain mx-auto block cursor-zoom-in animate-none"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            onClick={() => setZoomedImage(images[currentIndex])}
          />
        </AnimatePresence>

        {/* Floating Zoom Button */}
        <button
          type="button"
          onClick={() => setZoomedImage(images[currentIndex])}
          className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-xl backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-10"
          title="Zoom Image"
        >
          <FiMaximize2 className="w-5 h-5" />
        </button>

        {/* Navigation arrows (only if more than 1 image) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-primary text-white p-3 rounded-full backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 z-10 hover:scale-110"
              aria-label="Previous image"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-primary text-white p-3 rounded-full backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 z-10 hover:scale-110"
              aria-label="Next image"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails/Indicators list */}
      {images.length > 1 && (
        <div className="flex justify-center items-center gap-2 p-4 bg-base-200 border-t border-base-300 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-12 w-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                idx === currentIndex
                  ? "border-primary scale-105 shadow-md"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
          >
            <motion.img
              src={zoomedImage}
              alt="Zoomed project image"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectImageCarousel;
