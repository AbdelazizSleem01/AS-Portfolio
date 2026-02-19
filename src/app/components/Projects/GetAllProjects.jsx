"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import '../AdminStyle.css';
import { ArrowBigLeft, GripVertical, Save, Trash2, Edit3, ExternalLink } from "lucide-react";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";

const GetProjects = () => {
    const { user } = useUser();
    const [projects, setProjects] = useState([]);
    const [originalProjects, setOriginalProjects] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);

    const hasChanges = JSON.stringify(projects.map(p => p._id)) !== JSON.stringify(originalProjects.map(p => p._id));

    useEffect(() => {
        document.title = `All Projects | ${process.env.NEXT_PUBLIC_META_TITLE}`;
        document
            .querySelector('meta[name="description"]')
            ?.setAttribute(
                'content',
                `Check out my latest projects at ${process.env.NEXT_PUBLIC_META_TITLE}. ${process.env.NEXT_PUBLIC_META_DESCRIPTION}`
            );
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/projects`);
            if (!response.ok) throw new Error("Failed to fetch projects");
            const data = await response.json();
            setProjects(data.projects);
            setOriginalProjects(data.projects);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleReorder = (newOrder) => {
        setProjects(newOrder);
    };

    const saveOrder = async () => {
        try {
            setIsSaving(true);
            const response = await fetch('/api/projects/reorder', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projects }),
            });

            if (!response.ok) throw new Error("Failed to save order");

            toast.success("New order saved successfully!");
            setOriginalProjects(projects);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSaving(false);
        }
    };

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
                className="flex flex-col items-center justify-center h-screen gap-4 transition-all duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="relative">
                    <motion.div
                        className="w-16 h-16 border-4 border-primary/20 rounded-full"
                    />
                    <motion.div
                        className="absolute top-0 left-0 w-16 h-16 border-4 border-t-primary rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                </div>
                <motion.span className="text-primary font-medium text-lg">
                    Loading Projects...
                </motion.span>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-error/5 rounded-3xl border border-error/20 max-w-md mx-auto mt-20"
            >
                <div className="text-error text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-error mb-2">Error Loading Projects</h3>
                <p className="text-base-content/70 mb-6">{error}</p>
                <button
                    onClick={fetchProjects}
                    className="btn btn-primary px-8"
                >
                    Retry
                </button>
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
            className="bg-base-100 min-h-screen p-4 sm:p-8 mt-16"
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-extrabold text-primary mb-2">Project Management</h1>
                        <p className="text-base-content/60">Drag and drop rows to reorder how projects appear on your portfolio.</p>
                    </div>

                    <div className="flex gap-3">
                        <AnimatePresence>
                            {hasChanges && (
                                <motion.button
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onClick={saveOrder}
                                    disabled={isSaving}
                                    className="btn btn-success text-white shadow-lg flex items-center gap-2 px-6"
                                >
                                    {isSaving ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    Save New Order
                                </motion.button>
                            )}
                        </AnimatePresence>

                        <Link href="/admin">
                            <button className="btn btn-outline gap-2">
                                <ArrowBigLeft size={18} />
                                Back
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="bg-base-200/50 backdrop-blur-sm p-4 rounded-3xl border border-base-300 shadow-xl overflow-x-auto">
                    <div className="min-w-[800px]">
                        {/* Table Header */}
                        <div className="grid grid-cols-[60px_100px_1fr_150px_200px] gap-4 px-6 py-4 border-b border-base-300 text-sm font-bold text-base-content/50 uppercase tracking-wider">
                            <div className="text-center">Move</div>
                            <div>Preview</div>
                            <div>Project Info</div>
                            <div className="text-center">Current Order</div>
                            <div className="text-right">Actions</div>
                        </div>

                        {/* Draggable List */}
                        <Reorder.Group
                            axis="y"
                            values={projects}
                            onReorder={handleReorder}
                            className="space-y-3 mt-4"
                        >
                            {projects.map((project) => (
                                <Reorder.Item
                                    key={project._id}
                                    value={project}
                                    className="bg-base-100 rounded-2xl border border-base-300 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-grab active:cursor-grabbing group overflow-hidden"
                                >
                                    <div className="grid grid-cols-[60px_100px_1fr_150px_200px] gap-4 items-center px-6 py-3">
                                        <div className="flex justify-center text-base-content/30 group-hover:text-primary transition-colors">
                                            <GripVertical size={24} />
                                        </div>

                                        <div className="h-16 w-16 relative rounded-xl overflow-hidden border border-base-300 bg-base-200">
                                            {project.imageUrl && (
                                                <Image
                                                    src={project.imageUrl}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-lg text-primary">{project.title}</h3>
                                            <div
                                                className="text-sm text-base-content/60 line-clamp-1 max-w-md"
                                                dangerouslySetInnerHTML={{ __html: project.description }}
                                            />
                                        </div>

                                        <div className="flex justify-center">
                                            <div className="badge badge-primary badge-outline font-bold px-4 py-3">
                                                Order: {project.order || 0}
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleDetails(project)}
                                                className="btn btn-square btn-ghost btn-sm text-success hover:bg-success/10"
                                                title="View Details"
                                            >
                                                <ExternalLink size={18} />
                                            </button>

                                            <Link href={`updateProject/${project._id}`}>
                                                <button
                                                    className="btn btn-square btn-ghost btn-sm text-primary hover:bg-primary/10"
                                                    title="Edit Project"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                            </Link>

                                            <button
                                                className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"
                                                title="Delete Project"
                                                onClick={() => toast.info("Go to edit page to delete")}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>

                        {projects.length === 0 && (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">🗂️</div>
                                <h3 className="text-xl font-bold text-base-content/40">No projects found in database</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Project Details Modal */}
            <AnimatePresence>
                {showDetails && currentProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 py-10 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4"
                        onClick={closeDetails}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-base-100 rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 relative border border-base-300"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closeDetails}
                                className="btn btn-circle btn-ghost absolute top-6 right-6"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>

                            <div className="mb-8">
                                <h2 className="text-3xl font-extrabold text-primary mb-2">
                                    {currentProject.title}
                                </h2>
                                <div className="h-1.5 w-20 bg-primary rounded-full" />
                            </div>

                            <div className="grid lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="prose prose-neutral max-w-none">
                                        <h4 className="text-lg font-bold mb-2 opacity-50">Project Description</h4>
                                        <div
                                            className="text-base-content/80 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: currentProject.description }}
                                        />
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-4">
                                        {currentProject.liveLink && (
                                            <a href={currentProject.liveLink} target="_blank" className="btn btn-primary gap-2">
                                                Live Demo <ExternalLink size={16} />
                                            </a>
                                        )}
                                        {currentProject.githubLink && (
                                            <a href={currentProject.githubLink} target="_blank" className="btn btn-neutral gap-2">
                                                GitHub Code
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {currentProject.imageUrl && (
                                        <div>
                                            <h4 className="text-sm font-bold mb-3 opacity-40 uppercase tracking-widest">Featured Image</h4>
                                            <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-primary/10 shadow-lg">
                                                <Image
                                                    fill
                                                    src={currentProject.imageUrl}
                                                    alt={currentProject.title}
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {currentProject.videoLink && (
                                        <div>
                                            <h4 className="text-sm font-bold mb-3 opacity-40 uppercase tracking-widest">Video Overview</h4>
                                            <div className="aspect-video rounded-3xl overflow-hidden border-2 border-primary/10 bg-black shadow-lg">
                                                <iframe
                                                    src={currentProject.videoLink}
                                                    className="w-full h-full"
                                                    allowFullScreen
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default GetProjects;
