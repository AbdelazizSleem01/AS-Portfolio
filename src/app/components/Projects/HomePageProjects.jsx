"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiExternalLink,
  FiGithub,
  FiInfo,
  FiX,
  FiPlus,
  FiFolder,
  FiCode
} from "react-icons/fi";
import ProjectImageCarousel from "./ProjectImageCarousel";
import ProjectDetailsModal from "./ProjectDetailsModal";

const HomePageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [displayCount, setDisplayCount] = useState(6);
  const [hasMore, setHasMore] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (projectId) => {
    setImageErrors((prev) => ({ ...prev, [projectId]: true }));
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setAllProjects(data.projects || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Update displayed projects when displayCount or allProjects changes
  useEffect(() => {
    setProjects(allProjects.slice(0, displayCount));
    setHasMore(displayCount < allProjects.length);
  }, [displayCount, allProjects]);

  const handleDetails = (project) => {
    setCurrentProject(project);
    setShowDetails(true);
    document.body.style.overflow = "hidden";
  };

  const closeDetails = () => {
    setShowDetails(false);
    setCurrentProject(null);
    document.body.style.overflow = "unset";
  };

  const handleImageZoom = (imageUrl) => {
    setZoomedImage(imageUrl);
    document.body.style.overflow = "hidden";
  };

  const closeImageZoom = () => {
    setZoomedImage(null);
    document.body.style.overflow = "unset";
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + 2);
  };

  // Loading Component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <FiFolder className="text-6xl text-primary" />
          </motion.div>
          <motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-primary">Loading Projects</h3>
            <p className="text-base-content/70">Fetching amazing projects...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Error Component
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 flex items-center justify-center">
        <motion.div
          className="text-center p-8 bg-error/10 rounded-3xl border border-error/20 max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-error mb-2">Error Loading Projects</h3>
          <p className="text-base-content/70 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-20 px-4 sm:px-6 lg:px-8" id="projects">
      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="inline-flex items-center gap-3 mb-4"
          whileHover={{ scale: 1.05 }}
        >
          <FiCode className="text-4xl text-primary" />
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Featured Projects
          </h2>
        </motion.div>
        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
          Here are some of my recent projects that showcase my skills and passion for development
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 rounded-full" />
      </motion.div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          layout
        >
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                className="group bg-base-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-base-300 overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                layout
              >
                {/* Project Image */}
                <div
                  className="relative h-48 overflow-hidden cursor-zoom-in"
                  onClick={() => handleImageZoom(imageErrors[project._id] ? "/imgs/not-found.png" : project.imageUrl)}
                >
                  {project.category && typeof project.category === "object" && project.category.name && (
                    <span className="absolute top-4 left-4 bg-primary/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md z-10 select-none">
                      {project.category.name}
                    </span>
                  )}
                  {project.imageUrl && (
                    <motion.img
                      src={imageErrors[project._id] ? "/imgs/not-found.png" : project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      whileHover={{ scale: 1.05 }}
                      loading="lazy"
                      onError={() => handleImageError(project._id)}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-base-100/80 to-transparent pointer-events-none" />

                  {/* Overlay Icons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {project.liveLink && (
                      <motion.a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary/90 text-white p-2 rounded-lg backdrop-blur-sm hover:bg-primary transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiExternalLink className="w-4 h-4" />
                      </motion.a>
                    )}
                    {project.githubLink && project.githubLink.trim() !== "" && (
                      <motion.a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-base-300/90 text-base-content p-2 rounded-lg backdrop-blur-sm hover:bg-base-300 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiGithub className="w-4 h-4" />
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <motion.h3
                    className="text-xl font-bold text-primary mb-3 line-clamp-1"
                    layoutId={`title-${project._id}`}
                  >
                    {project.title}
                  </motion.h3>

                  <motion.div
                    className="text-base-content/70 mb-4 line-clamp-2 h-12"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => handleDetails(project)}
                      className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiInfo className="w-4 h-4" />
                      View Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More Button */}
        {hasMore && (
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={loadMore}
              className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 hover:shadow-2xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Load More Projects
              <span className="text-sm opacity-80">
                ({allProjects.length - displayCount} remaining)
              </span>
            </motion.button>
          </motion.div>
        )}

        {/* No More Projects Message */}
        {!hasMore && projects.length > 0 && (
          <motion.div
            className="text-center mt-12 p-6 bg-base-200 rounded-3xl border border-base-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-lg text-base-content/70">
              🎉 You've seen all {allProjects.length} projects!
            </p>
            <p className="text-base-content/60 mt-2">
              Thank you for exploring my work
            </p>
          </motion.div>
        )}

        {/* No Projects Message */}
        {projects.length === 0 && !loading && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FiFolder className="text-6xl text-base-content/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-base-content/70 mb-2">
              No Projects Found
            </h3>
            <p className="text-base-content/50">
              Check back later for new projects!
            </p>
          </motion.div>
        )}
      </div>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        project={currentProject}
        isOpen={showDetails && !!currentProject}
        onClose={closeDetails}
      />

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImageZoom}
          >
            <motion.button
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10 transition-colors z-[101]"
              onClick={closeImageZoom}
            >
              <FiX className="w-8 h-8" />
            </motion.button>
            <motion.img
              src={zoomedImage}
              alt="Zoomed project image"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePageProjects;