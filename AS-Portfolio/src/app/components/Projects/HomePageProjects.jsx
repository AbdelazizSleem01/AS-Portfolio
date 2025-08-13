"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import "../AdminStyle.css";

const HomePageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [visibleProjects, setVisibleProjects] = useState(6); // Initially show 6 projects

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

  const loadMoreProjects = () => {
    setVisibleProjects((prev) => prev + 6); // Load 6 more projects
  };

  const showLessProjects = () => {
    setVisibleProjects(6); // Reset to initial 6 projects
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
        <motion.span className="text-primary text-lg">
          Loading Projects...
        </motion.span>
      </motion.div>
    );
  }

  if (error) {
    return <div className="text-center text-error mt-10">Error: {error}</div>;
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-8 mt-16"
      id="projects"
    >
      <div className="Heading w-full flex justify-center items-center mb-8">
        <motion.h3
          className="text-3xl semiHead font-bold w-full text-primary text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          All Projects
        </motion.h3>
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
        >
          {projects.slice(0, visibleProjects).map((project, index) => (
            <motion.div
              key={project._id}
              className="relative bg-base-100 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{
                once: false,
                margin: "0px 0px -100px 0px",
                amount: 0.2,
              }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 20,
                duration: 0.5,
              }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                {project.imageUrl ? (
                  <Link
                    href={project.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-t-xl"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                ) : (
                  <div className="w-full h-full bg-neutral flex items-center justify-center rounded-t-xl">
                    <span className="text-base-300">No Image</span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-primary mb-2 line-clamp-1">
                  {project.title}
                </h2>
                <p
                  dangerouslySetInnerHTML={{ __html: project.description }}
                  className=" mb-4 line-clamp-1 h-6"
                ></p>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between gap-2">
                    {project.liveLink && (
                      <Link
                        href={project.liveLink}
                        title="Visit this project"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-primary text-white text-sm font-medium py-2 px-3 rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2 transition-colors"
                      >
                        Live Demo
                        <img
                          className="w-5 h-5"
                          src="/imgs/live.png"
                          alt="live-icon"
                        />
                      </Link>
                    )}
                    {project.githubLink && (
                      <Link
                        href={project.githubLink}
                        title="Visit GitHub page for this project"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gray-700 text-white text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-700/80 flex items-center justify-center gap-2 transition-colors"
                      >
                        GitHub
                        <img
                          className="w-5 h-5"
                          src="/imgs/github.png"
                          alt="github-icon"
                        />
                      </Link>
                    )}
                  </div>
                  <motion.button
                    className="bg-error text-white text-sm font-medium py-2 px-3 rounded-lg hover:bg-error/80 flex items-center justify-center gap-2 transition-colors"
                    onClick={() => handleDetails(project)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Details for this project"
                  >
                    Details
                    <img
                      className="w-5 h-5"
                      src="/imgs/details.png"
                      alt="details-icon"
                    />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More / Show Less Buttons */}
        {projects.length > 6 && (
          <div className="flex justify-center gap-4 mt-8">
            {visibleProjects < projects.length && (
              <motion.button
                className="bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
                onClick={loadMoreProjects}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Load More
              </motion.button>
            )}
            {visibleProjects > 6 && (
              <motion.button
                className="bg-gray-700 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-700/80 transition-colors"
                onClick={showLessProjects}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Show Less
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && currentProject && (
        <motion.div
          className="fixed inset-0 py-4 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-base-100 rounded-xl w-11/12 sm:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <button
              onClick={closeDetails}
              className="absolute top-4 right-4 bg-primary rounded-full p-2 hover:bg-primary/90 transition-colors"
            >
              <Image
                width={24}
                height={24}
                src="/imgs/close.png"
                alt="close-icon"
              />
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              {currentProject.title}
            </h2>
            <p
              className="mb-6"
              dangerouslySetInnerHTML={{ __html: currentProject.description }}
            ></p>

            {currentProject.videoLink && (
              <div className="aspect-video rounded-xl overflow-hidden mb-6">
                <motion.iframe
                  className="w-full h-full rounded-xl border-2 border-primary"
                  src={currentProject.videoLink}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></motion.iframe>
              </div>
            )}
            {currentProject.imageUrl && (
              <Link
                href={currentProject.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.img
                  className="w-full rounded-xl border-2 border-primary mb-6"
                  src={currentProject.imageUrl}
                  alt={currentProject.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                />
              </Link>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePageProjects;
