"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import '../AdminStyle.css';
import { ArrowBigLeft } from "lucide-react";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";

const GetProjects = () => {
    const { user } = useUser();
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);




    useEffect(() => {
        document.title = `All Projects | ${process.env.NEXT_PUBLIC_META_TITLE}`;
        document
            .querySelector('meta[name="description"]')
            ?.setAttribute(
                'content',
                `Check out my latest projects at ${process.env.NEXT_PUBLIC_META_TITLE}. ${process.env.NEXT_PUBLIC_META_DESCRIPTION}`
            );
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`/api/projects`);
                if (!response.ok) throw new Error("Failed to fetch projects");
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
                <motion.span className="text-primary text-lg">
                    Loading...
                </motion.span>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-red-500 mt-10 flex flex-col gap-4"
            >
                <p>Error: {error}</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary text-white px-6 py-2 rounded-lg"
                >
                    Retry
                </motion.button>
            </motion.div>
        );
    }

    if (!user) {
        return <RedirectToSignIn />;

    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-base-100 min-h-screen p-6 mt-16"
        >
            <div className="Heading w-full flex justify-center items-center" >
                <h1 className="text-2xl semiHead sm:text-3xl w-full font-bold text-center sm:mb-8 text-primary ">
                    Projects
                </h1>
            </div>

            <motion.ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {projects.map((project, index) => (
                    <motion.li
                        key={project._id || index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-neutral h-auto mx-auto shadow-lg p-4 rounded-lg w-full max-w-96 transition-transform flex flex-col"
                    >
                        <div className="px-2 flex flex-col flex-grow">
                            <motion.h2
                                className="text-xl font-semibold text-primary mb-4"
                                initial={{ x: -20 }}
                                whileInView={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {project.title}
                            </motion.h2>
                            <motion.p
                                dangerouslySetInnerHTML={{ __html: project.description }}
                                className="mb-4 truncate h-[26px] text-base-100"

                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                            </motion.p>

                            <motion.div
                                className="border-2 border-primary rounded-lg bg-base-100 flex items-center justify-center h-60 overflow-hidden p-2"
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {project.imageUrl && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Image
                                            src={project.imageUrl}
                                            alt={project.title}
                                            width={300}
                                            height={200}
                                            className="object-contain rounded-md w-full h-full border-2 border-primary"
                                        />
                                    </motion.div>
                                )}
                            </motion.div>

                            <div className="flex flex-col mt-4 gap-3">
                                <div className="flex gap-3 w-full">
                                    {project.liveLink && (
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex-1"
                                        >
                                            <Link
                                                href={project.liveLink}
                                                target="_blank"
                                                className="flex items-center justify-center gap-2 w-full text-center text-sm text-white bg-primary px-4 py-2 rounded hover:bg-primary/80 transition-colors"
                                            >
                                                Live Demo <img className="w-6 h-6" src="/imgs/live.png" alt="live-icon" />
                                            </Link>
                                        </motion.div>
                                    )}
                                    {project.githubLink && (
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex-1"
                                        >
                                            <Link
                                                href={project.githubLink}
                                                target="_blank"
                                                className="flex items-center justify-center gap-2 w-full text-center text-sm text-white bg-gray-800 px-4 py-2 rounded hover:bg-gray-900 transition-colors"
                                            >
                                                GitHub <img className="w-6 h-6" src="/imgs/github.png" alt="github-icon" />
                                            </Link>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Details Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center gap-2 text-sm text-white bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition-colors"
                                    onClick={() => handleDetails(project)}
                                >
                                    Details <img className="w-6 h-6" src="/imgs/details.png" alt="details-icon" />
                                </motion.button>

                                {/* Edit Project Button */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full"
                                >
                                    <Link
                                        href={`updateProject/${project._id}`}
                                        className="flex items-center justify-center gap-2 w-full text-center text-sm text-white bg-error px-4 py-2 rounded hover:bg-error/80 transition-colors"
                                    >
                                        Edit <img className="w-5 h-5 rounded-sm bg-white" src="/imgs/setting.gif" alt="setting-icon" />
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.li>
                ))}
            </motion.ul>
            <motion.div
                className="flex justify-center mt-8 sm:mt-10 pb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false }}
            >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/admin">
                        <button className="btn btn-primary px-8 text-white rounded-full shadow-lg hover:shadow-xl transition-all gap-2">
                            <ArrowBigLeft />
                            Return to Admin Dashboard
                        </button>
                    </Link>
                </motion.div>
            </motion.div>
            <AnimatePresence>
                {showDetails && currentProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 py-4 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="bg-neutral rounded-lg w-11/12 sm:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto shadow-xl p-6 relative"
                        >
                            <motion.button
                                onClick={closeDetails}
                                className="absolute top-4 right-4"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Image width={35} height={35} src={'/imgs/close.png'} alt="close-icon" />
                            </motion.button>

                            <h2 className="text-2xl font-bold text-primary mb-4">
                                {currentProject.title}
                            </h2>

                            <motion.div
                                className="text-base-100 mb-6"
                                dangerouslySetInnerHTML={{ __html: currentProject.description }}
                            />

                            {currentProject.videoLink && (
                                <div className="w-full mt-4 h-[350px]">
                                    <motion.iframe
                                        controls
                                        allowFullScreen
                                        className="w-[80%] h-[350px] rounded-md mx-auto mb-16 border-[3px] border-primary overflow-hidden"
                                        src={currentProject.videoLink}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Your browser does not support the video tag.
                                    </motion.iframe>
                                </div>
                            )}
                            {currentProject.imageUrl && (
                                <motion.img
                                    className="object-contain w-full sm:w-[80%] mt-4 mx-auto rounded-lg border border-primary"
                                    src={currentProject.imageUrl}
                                    alt={currentProject.title}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default GetProjects;