"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import "../components/AdminStyle.css";
import { Github, Globe, X } from "lucide-react";

const PageOfProjects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);


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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                className="bg-neutral rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow relative overflow-hidden group"
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
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold text-base-100 mb-2">{project.title}</h2>

                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral/50 to-transparent z-10" />
                    <p
                      className="text-base-100 line-clamp-3 pr-4 h-[28px] text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: project.description.split("<br>")[0],
                      }}
                    ></p>
                  </div>

                  <div className="border-2 border-primary/30 shadow-md shadow-base-100/20 rounded-lg my-4 bg-white flex items-center justify-center h-60 overflow-hidden p-2 hover:border-primary/50 transition-colors">
                    {project.imageUrl && (
                      <a href={project.imageUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full">
                        <motion.img
                          src={project.imageUrl}
                          alt={project.title}
                          className="rounded-md w-full h-full object-contain scale-95 group-hover:scale-100 transition-transform"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      </a>
                    )}
                  </div>

                  <div className="flex justify-around items-center text-center mt-4 gap-3">
                    {project.liveLink && (
                      <Link
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm w-full bg-primary text-white px-4 py-2 flex items-center justify-center gap-2 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Live Demo
                        <img className="w-5 h-5 filter brightness-0 invert" src="/imgs/live.png" alt="live-icon" />
                      </Link>
                    )}
                    {project.githubLink && (
                      <Link
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm w-full text-white bg-gray-700 px-4 py-2 flex items-center justify-center gap-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        GitHub
                        <img className="w-5 h-5 filter brightness-0 invert" src="/imgs/github.png" alt="github-icon" />
                      </Link>
                    )}
                  </div>

                  <div className="flex justify-center w-full items-center mt-3">
                    <motion.button
                      className="text-sm bg-error w-full px-4 py-2 flex items-center text-white justify-center gap-2 rounded-lg hover:bg-error/90 transition-colors"
                      onClick={() => handleDetails(project)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Details
                      <img className="w-5 h-5 filter brightness-0 invert" src="/imgs/details.png" alt="details-icon" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Project Details Modal */}
      {showDetails && currentProject && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-base-100 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-primary">
                  {currentProject.title}
                </h2>
                <button
                  onClick={closeDetails}
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              {currentProject.videoLink && (
                <div className="aspect-video rounded-xl overflow-hidden mb-6">
                  <motion.iframe
                    controls
                    className="w-[100%] h-[100%] rounded-xl mx-auto mb-4 border-[3px] border-primary overflow-hidden"
                    src={currentProject.videoLink}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Your browser does not support the video tag.
                  </motion.iframe>
                </div>
              )}

              <div
                className="prose prose-lg max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: currentProject.description }}
              />

              <div className="flex flex-wrap gap-4 mt-8">
                {currentProject.liveLink && (
                  <Link
                    href={currentProject.liveLink}
                    target="_blank"
                    className="btn btn-primary gap-2"
                  >
                    <Globe className="w-5 h-5" />
                    Visit Live Demo
                  </Link>
                )}
                {currentProject.githubLink && (
                  <Link
                    href={currentProject.githubLink}
                    target="_blank"
                    className="btn btn-neutral gap-2"
                  >
                    <Github className="w-5 h-5" />
                    View Source Code
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Example icon components
export default PageOfProjects;