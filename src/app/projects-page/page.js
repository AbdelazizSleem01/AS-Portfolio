"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import "../components/AdminStyle.css";
import { Github, Globe, X } from "lucide-react";
import { FiExternalLink, FiGithub, FiInfo } from "react-icons/fi";
import ProjectImageCarousel from "../components/Projects/ProjectImageCarousel";
import ProjectDetailsModal from "../components/Projects/ProjectDetailsModal";

const PageOfProjects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (projectId) => {
    setImageErrors((prev) => ({ ...prev, [projectId]: true }));
  };


  useEffect(() => {
    document.title = `Projects | ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        `Check out my latest projects at ${process.env.NEXT_PUBLIC_META_TITLE}.`
      );
    // kaywords
    const keywords = ["Next.js", "React", "Tailwind CSS", "API", "Deployment"];
    const metaDescription = `Check out my latest projects using ${keywords.join(
      ", "
    )} and deploy them to the cloud.`;
    document
      .querySelector('meta[name="keywords"]')
      ?.setAttribute("content", keywords.join(", "));


  }, []);


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`/api/projects`);
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data.projects);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDetails = (project) => {
    setCurrentProject(project);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setCurrentProject(null);
  };

  if (loading) {
    return (
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
          Loading Projects...
        </motion.span>
      </motion.div>
    );
  }

  if (error) {
    return <div className="text-center text-error mt-10">Error: {error}</div>;
  }

  return (
    <div className="h-full bg-base-100 mt-16" id="projects">
      {/* Landing Page Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Enhanced overlay with gradient */}
          <div className="absolute inset-0  bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
          <Image
            src="/imgs/bg-project.webp"
            alt="Projects Background"
            fill
            className="object-cover object-center opacity-80"
            priority
          />
        </div>

        <motion.div
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl">
            My
            <span className="text-red-400 block mt-4 md:inline md:ml-4 animate-gradient bg-gradient-to-r  from-red-400 via-purple-300 to-red-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h1>

          <motion.p
            className="text-xl md:text-3xl text-gray-200 max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Exploring the intersection of creativity<br className="hidden md:block" />
            <span className="inline-block mt-2">and technology through hands-on development</span>
          </motion.p>

          <motion.div
            className="mt-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <svg
              className="w-16 h-16 mx-auto animate-bounce text-red-500/80 hover:text-red-400 transition-colors cursor-pointer"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 z-5 pointer-events-none opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')]" />
      </section>
      {/* Projects Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <motion.h2
          className="text-4xl font-bold text-center text-primary mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Featured Work
        </motion.h2>

        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                className="group bg-base-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-base-300 overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                layout
              >
                {/* Project Image */}
                <div
                  className="relative h-48 overflow-hidden cursor-zoom-in"
                  onClick={() => handleDetails(project)}
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
                    {project.githubLink && (
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
                  >
                    {project.title}
                  </motion.h3>

                  <motion.div
                    className="text-base-content/70 mb-4 line-clamp-2 h-12 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => handleDetails(project)}
                      className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 text-sm"
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
          </motion.div>
        </div>
      </section>

      {/* Enhanced Project Details Modal */}
      <ProjectDetailsModal
        project={currentProject}
        isOpen={showDetails && !!currentProject}
        onClose={closeDetails}
      />
    </div>
  );
};

// Example icon components
export default PageOfProjects;