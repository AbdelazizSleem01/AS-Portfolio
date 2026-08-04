"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentTheme } from "@/utils/useCurrentTheme";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiRotateCcw,
  FiMaximize2,
  FiX,
  FiCpu,
  FiZap,
  FiSpeaker,
} from "react-icons/fi";

const BrandVideoShowcase = ({ autoScrollToId = "brand-video" }) => {
  const theme = useCurrentTheme();
  const videoRef = useRef(null);
  const modalVideoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMuted, setModalMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const logoSrc = theme === "dark" ? "/new-logo.png" : "/red-logo.png";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const openModal = () => {
    setIsModalOpen(true);
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section id={autoScrollToId} className="w-full py-16 bg-base-100 relative overflow-hidden">
      {/* Dynamic Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-primary/20 via-cyan-500/10 to-secondary/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4 shadow-sm">
            <img src={logoSrc} alt="AS Logo" className="w-6 h-6 object-contain" />
            <span>AS Software Solutions</span>
            <FiZap className="text-secondary animate-pulse" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Official Brand Reveal & Identity
          </h2>
        </motion.div>

        {/* Video Showcase Frame */}
        <motion.div
          className="relative max-w-4xl mx-auto rounded-3xl p-1 sm:p-2 bg-gradient-to-r from-primary via-cyan-500 to-secondary shadow-2xl group"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <div className="relative rounded-[22px] overflow-hidden bg-gray-950 border border-white/10 shadow-inner">
            {/* Top Bar / Header of Video Player */}
            <div className="px-4 py-3 bg-gray-900/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between z-20 relative">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                <div className="flex items-center gap-2 ml-3 text-xs text-gray-300 font-mono">
                  <img src={logoSrc} alt="AS Logo" className="w-5 h-5 object-contain" />
                  <span>AS-Software-Solutions.mp4</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={openModal}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-primary/20 hover:bg-primary text-primary hover:text-white transition-all flex items-center gap-1.5"
                  title="Expand to Fullscreen Cinema Mode"
                >
                  <FiMaximize2 className="text-sm" />
                  <span className="hidden sm:inline">Cinema Mode</span>
                </button>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video w-full bg-black cursor-pointer" onClick={togglePlay}>
              <video
                ref={videoRef}
                src="/vid.mp4"
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
              />

              {/* Gradient Overlay for Controls readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Center Play Button Overlay when paused */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-10">
                  <motion.button
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="w-20 h-20 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-2xl border-2 border-white/40"
                  >
                    <FiPlay className="text-3xl ml-1" />
                  </motion.button>
                </div>
              )}

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-20">
                <div
                  className="h-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Interactive Floating Control Bar */}
              <div
                className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-30 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-cyan-400 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <FiPause className="text-xl" /> : <FiPlay className="text-xl" />}
                  </button>

                  <button
                    onClick={restartVideo}
                    className="text-white hover:text-cyan-400 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    title="Restart Video"
                  >
                    <FiRotateCcw className="text-lg" />
                  </button>

                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-cyan-400 p-1.5 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <FiVolumeX className="text-xl text-red-400" />
                    ) : (
                      <div className="flex items-center gap-1">
                        <FiVolume2 className="text-xl text-cyan-400" />
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                      </div>
                    )}
                    <span className="text-xs text-gray-300 hidden sm:inline">
                      {isMuted ? "Muted" : "Sound On"}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={openModal}
                    className="text-white hover:text-cyan-400 p-1.5 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs"
                    title="Fullscreen"
                  >
                    <FiMaximize2 className="text-lg" />
                    <span className="hidden sm:inline">Full Screen</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Theater Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full max-w-5xl bg-gray-950 rounded-2xl border border-white/15 overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gray-900">
                <div className="flex items-center gap-2">
                  <FiSpeaker className="text-primary" />
                  <span className="font-bold text-white text-base sm:text-lg">
                    AS Software Solutions
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>

              {/* Modal Video */}
              <div className="relative aspect-video w-full bg-black">
                <video
                  ref={modalVideoRef}
                  src="/vid.mp4"
                  className="w-full h-full object-contain"
                  autoPlay
                  controls
                  loop
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BrandVideoShowcase;
