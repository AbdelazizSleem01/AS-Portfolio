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
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-8" id="projects">
      <div className="Heading w-full flex justify-center items-center">
        <motion.h1
          className="text-3xl font-bold w-full text-primary text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          All Projects
        </motion.h1>
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              className="bg-neutral rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{
                once: false,
                margin: "0px 0px -100px 0px",
                amount: 0.2
              }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 20,
                duration: 0.5
              }}
              whileHover={{
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-base-100">{project.title}</h2>
                <p
                  className="mb-4 truncate h-[26px] text-base-100"
                  dangerouslySetInnerHTML={{
                    __html: project.description.split("<br>")[0],
                  }}
                ></p>

                <div className="border border-primary shadow-md shadow-base-100 rounded-lg my-4 bg-white flex items-center justify-center h-60 overflow-hidden p-2">
                  {project.imageUrl && (
                    <a href={project.imageUrl} target="_blank" rel="noopener noreferrer">
                      <motion.img
                        src={project.imageUrl}
                        alt={project.title}
                        className="rounded-md w-full h-full object-contain"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      />
                    </a>
                  )}
                </div>
                {/* category */}
                <div className="flex justify-around items-center text-center mt-4">
                  {project.liveLink && (
                    <Link
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm w-full bg-primary text-white mr-2 px-2 py-1 flex items-center justify-center gap-2 rounded"
                    >
                      Live Demo <img className="w-6 h-6" src="/imgs/live.png" alt="live-icon" />
                    </Link>
                  )}
                  {project.githubLink && (
                    <Link
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm w-full text-white bg-gray-700 ml-2 px-2 py-1 flex items-center justify-center gap-2 rounded hover:bg-gray-700/80"
                    >
                      GitHub <img className="w-6 h-6" src="/imgs/github.png" alt="github-icon" />
                    </Link>
                  )}
                </div>
                <div className="flex justify-center w-full items-center mt-3">
                  <motion.button
                    className="text-sm bg-error w-full px-2 py-1 flex items-center text-white justify-center gap-2 rounded hover:bg-error/80"
                    onClick={() => handleDetails(project)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Details <img className="w-6 h-6" src="/imgs/details.png" alt="details-icon" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {showDetails && currentProject && (
        <motion.div
          className="fixed inset-0 py-4 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#FEF9E1] h-full rounded-lg w-11/12 sm:w-2/3 lg:w-1/2 overflow-scroll shadow-lg p-6 relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <button
              onClick={closeDetails}
              className="fixed top-10 right-[28%] bg-primary rounded-full"
            >
              <Image width={35} height={35} src={'/imgs/close.png'} alt="close-icon" className="close-img" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentProject.title}</h2>
            <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: currentProject.description }}></p>

            {currentProject.videoLink && (
              <div className="aspect-video rounded-xl overflow-hidden mb-6">
                <motion.iframe
                  controls
                  className="w-[90%] h-[100%] rounded-xl mx-auto mb-4 border-[3px] border-primary overflow-hidden"
                  src={currentProject.videoLink}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  autoFocus
                >
                  Your browser does not support the video tag.
                </motion.iframe>
              </div>
            )}
            {currentProject.imageUrl && (
              <Link href={currentProject.imageUrl} target="_blank" rel="noopener noreferrer">
                <motion.img
                  className="object-contain w-full sm:w-[90%] mx-auto rounded-lg border-[3px]  border-primary"
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