"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import '../../components/AdminStyle.css';
import { ArrowBigLeft, GripVertical, Save, Trash2, Edit3, Briefcase } from "lucide-react";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";

const GetAllExperiences = () => {
    const { user } = useUser();
    const [experiences, setExperiences] = useState([]);
    const [originalExperiences, setOriginalExperiences] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const hasChanges = JSON.stringify(experiences.map(e => e._id)) !== JSON.stringify(originalExperiences.map(e => e._id));

    const fetchExperiences = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/experiences`);
            if (!response.ok) throw new Error("Failed to fetch experiences");
            const data = await response.json();
            setExperiences(data.experiences);
            setOriginalExperiences(data.experiences);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = `Work Experiences | ${process.env.NEXT_PUBLIC_META_TITLE}`;
        fetchExperiences();
    }, []);

    const handleReorder = (newOrder) => {
        setExperiences(newOrder);
    };

    const saveOrder = async () => {
        try {
            setIsSaving(true);
            const response = await fetch('/api/experiences/reorder', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ experiences }),
            });

            if (!response.ok) throw new Error("Failed to save order");

            toast.success("New experience order saved successfully!");
            setOriginalExperiences(experiences);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center h-screen gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="relative">
                    <motion.div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
                    <motion.div
                        className="absolute top-0 left-0 w-16 h-16 border-4 border-t-primary rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                </div>
                <motion.span className="text-primary font-medium text-lg">
                    Loading Experiences...
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
                <h3 className="text-xl font-bold text-error mb-2">Error Loading Experiences</h3>
                <p className="text-base-content/70 mb-6">{error}</p>
                <button onClick={fetchExperiences} className="btn btn-primary px-8">
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
                        <h1 className="text-3xl font-extrabold text-primary mb-2 flex items-center gap-2 justify-center sm:justify-start">
                            <Briefcase className="w-8 h-8" /> Work Experience Management
                        </h1>
                        <p className="text-base-content/60">Drag and drop rows to reorder how experiences appear on your portfolio.</p>
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
                        <div className="grid grid-cols-[60px_200px_200px_1fr_150px] gap-4 px-6 py-4 border-b border-base-300 text-sm font-bold text-base-content/50 uppercase tracking-wider">
                            <div className="text-center">Move</div>
                            <div>Company</div>
                            <div>Role</div>
                            <div>Timeframe</div>
                            <div className="text-right">Actions</div>
                        </div>

                        {/* Draggable List */}
                        <Reorder.Group
                            axis="y"
                            values={experiences}
                            onReorder={handleReorder}
                            className="space-y-3 mt-4"
                        >
                            {experiences.map((exp) => (
                                <Reorder.Item
                                    key={exp._id}
                                    value={exp}
                                    className="bg-base-100 rounded-2xl border border-base-300 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-grab active:cursor-grabbing group overflow-hidden"
                                >
                                    <div className="grid grid-cols-[60px_200px_200px_1fr_150px] gap-4 items-center px-6 py-4">
                                        <div className="flex justify-center text-base-content/30 group-hover:text-primary transition-colors">
                                            <GripVertical size={24} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-lg text-primary">{exp.company}</h3>
                                        </div>

                                        <div>
                                            <span className="text-base-content/85 font-medium">{exp.role}</span>
                                        </div>

                                        <div>
                                            <span className="badge badge-outline badge-primary px-3 py-2 font-semibold">
                                                {exp.from} - {exp.current ? "Present" : exp.to}
                                            </span>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <Link href={`updateExperience/${exp._id}`}>
                                                <button
                                                    className="btn btn-square btn-ghost btn-sm text-primary hover:bg-primary/10"
                                                    title="Edit Experience"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>

                        {experiences.length === 0 && (
                            <div className="text-center py-20">
                                <Briefcase className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                                <h3 className="text-xl font-bold text-base-content/40">No work experiences found in database</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default GetAllExperiences;
