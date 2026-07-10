"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiExternalLink, FiGithub, FiPlay } from "react-icons/fi";
import ProjectImageCarousel from "./ProjectImageCarousel";

const ProjectDetailsModal = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  const renderVideo = () => {
    const link = project.videoLink;
    if (!link) return null;

    const isDirectVideo =
      link.match(/\.(mp4|webm|ogg|mov)$|^blob:/i) ||
      link.includes("public.blob.vercel-storage.com");

    if (isDirectVideo) {
      return (
        <video
          src={link}
          controls
          className="w-full h-full rounded-2xl"
          poster={project.imageUrl}
        />
      );
    }

    if (link.includes("awesomescreenshot.com")) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] sm:min-h-[400px] bg-base-200/50 rounded-2xl p-6 text-center border border-base-300">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 animate-bounce">
            <FiPlay className="w-8 h-8 ml-1" />
          </div>
          <h5 className="font-bold text-lg text-base-content mb-2">Watch Video Demo</h5>
          <p className="text-sm text-base-content/60 max-w-sm mb-6">
            This screen recording is hosted on Awesome Screenshot. Click the button below to view the demo in a new tab.
          </p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary px-8 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform text-white"
          >
            <FiExternalLink /> Watch on Awesome Screenshot
          </a>
        </div>
      );
    }

    let embedUrl = link;
    if (link.includes("youtube.com/watch?v="))
      embedUrl = link.replace("watch?v=", "embed/");
    else if (link.includes("youtu.be/"))
      embedUrl = link.replace("youtu.be/", "youtube.com/embed/");
    else if (
      link.includes("vimeo.com/") &&
      !link.includes("player.vimeo.com")
    )
      embedUrl = link.replace("vimeo.com/", "player.vimeo.com/video/");
    else if (
      link.includes("loom.com/share/") &&
      !link.includes("loom.com/embed/")
    )
      embedUrl = link.replace("loom.com/share/", "loom.com/embed/");

    return (
      <div className="flex flex-col h-full gap-2">
        <iframe
          src={embedUrl}
          className="flex-1 w-full h-full min-h-[300px] sm:min-h-[400px] rounded-2xl"
          allowFullScreen
          title={project.title}
        />
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-xs hover:underline flex items-center gap-2 px-2 pb-1"
        >
          <FiExternalLink /> Open in new tab
        </a>
      </div>
    );
  };

  const hasImages =
    project.imageUrl ||
    (project.images && project.images.filter(Boolean).length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden border border-base-300/50"
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ─── Sticky Header ─── */}
            <div className="relative px-6 sm:px-8 py-5 border-b border-base-300 bg-base-100/95 backdrop-blur-sm shrink-0">
              <div className="flex items-start gap-3 pr-12">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-primary truncate">
                    {project.title}
                  </h3>
                  {project.category &&
                    typeof project.category === "object" &&
                    project.category.name && (
                      <span className="inline-block mt-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">
                        {project.category.name}
                      </span>
                    )}
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="absolute top-5 right-5 sm:right-6 w-9 h-9 rounded-full bg-base-200 hover:bg-error/10 hover:text-error flex items-center justify-center transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            </div>

            {/* ─── Scrollable Body ─── */}
            <div className="overflow-y-auto flex-1 overscroll-contain">
              <div className="px-6 sm:px-8 py-6 space-y-8">
                {/* ── 1. Image Carousel ── */}
                {hasImages && (
                  <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <div className="rounded-2xl overflow-hidden max-w-4xl mx-auto">
                      <ProjectImageCarousel project={project} />
                    </div>
                  </motion.section>
                )}

                {/* ── 2. Description ── */}
                <motion.section
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                >
                  <h4 className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-4">
                    About This Project
                  </h4>
                  <div className="bg-base-200/40 rounded-2xl p-5 sm:p-6 border border-base-300/50">
                    <div
                      className="project-modal-desc"
                      dangerouslySetInnerHTML={{
                        __html: project.description,
                      }}
                    />
                  </div>
                </motion.section>

                {/* ── 3. Video ── */}
                {project.videoLink && (
                  <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 }}
                  >
                    <h4 className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-4 flex items-center gap-2">
                      <FiPlay className="w-3.5 h-3.5" /> Video Demo
                    </h4>
                    <div className="aspect-video rounded-2xl overflow-hidden bg-black max-w-4xl mx-auto border border-base-300/30">
                      {renderVideo()}
                    </div>
                  </motion.section>
                )}
              </div>
            </div>

            {/* ─── Sticky Footer / Action Buttons ─── */}
            {(project.liveLink || project.githubLink) && (
              <div className="px-6 sm:px-8 py-4 border-t border-base-300 bg-base-100/95 backdrop-blur-sm shrink-0">
                <div className="flex gap-3 max-w-lg mx-auto">
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 px-5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-sm"
                    >
                      <FiExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-base-200 text-base-content py-3 px-5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-base-300 transition-all duration-300 text-sm border border-base-300"
                    >
                      <FiGithub className="w-4 h-4" />
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailsModal;
