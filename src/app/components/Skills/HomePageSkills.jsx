"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Plus, Star, TrendingUp, Filter, Search } from "lucide-react";

export default function HomePageSkills() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayCount, setDisplayCount] = useState(12);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await fetch(`/api/skills`);
                if (!response.ok) {
                    throw new Error("Failed to fetch skills");
                }
                const data = await response.json();
                setSkills(data);
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, []);

    const loadMore = () => {
        setDisplayCount(prevCount => prevCount + 8);
    };

    const filteredSkills = skills.filter(skill => {
        const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ["all", ...new Set(skills.map(skill => skill.category).filter(Boolean))];

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <motion.div
                    className="flex flex-col items-center justify-center gap-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <motion.div
                        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-primary mb-2">Loading Skills</h3>
                        <p className="text-base-content/70">Preparing your tech stack...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-8 bg-error/10 rounded-3xl border border-error/20 max-w-md"
                >
                    <div className="text-error text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-error mb-2">Error Loading Skills</h3>
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
        <div className="min-h-screen bg-base-100 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        className="inline-flex items-center gap-3 mb-4"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Code className="text-4xl text-primary" />
                        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Tech Stack & Skills
                        </h1>
                    </motion.div>
                    <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                        Technologies and tools I use to bring ideas to life
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 rounded-full" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-12"
                >
                    <div className="bg-base-200 rounded-3xl p-8 shadow-xl border border-base-300">
                        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
                            <div className="flex-1 w-full">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search skills..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-base-100 pl-12 pr-4 py-4 rounded-2xl border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            <AnimatePresence>
                                {filteredSkills.slice(0, displayCount).map((skill, index) => (
                                    <motion.div
                                        key={skill._id}
                                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                        transition={{
                                            delay: index * 0.05,
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 24
                                        }}
                                        whileHover={{
                                            scale: 1.1,
                                            y: -8,
                                            transition: { type: "spring", stiffness: 400, damping: 25 }
                                        }}
                                        className="group relative"
                                    >
                                        <div className="bg-base-100 rounded-2xl p-6 shadow-lg border border-base-300 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                                            <div className="flex flex-col items-center text-center">
                                                <motion.div
                                                    className="relative mb-4"
                                                    whileHover={{ rotate: 360 }}
                                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                                >
                                                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center p-4 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                                                        <img
                                                            src={skill.imageUrl}
                                                            alt={skill.name}
                                                            className="w-12 h-12 object-contain filter group-hover:brightness-110 transition-all duration-300"
                                                        />
                                                    </div>
                                                    {skill.expertise && (
                                                        <div className="absolute -top-2 -right-2 bg-primary text-base-100 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                                            {skill.expertise}
                                                        </div>
                                                    )}
                                                </motion.div>

                                                <h3 className="font-semibold text-base-content mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                                    {skill.name}
                                                </h3>

                                                {skill.category && (
                                                    <span className="text-xs text-base-content/60 bg-base-200 px-2 py-1 rounded-full">
                                                        {skill.category}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {filteredSkills.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-16"
                            >
                                <Code className="text-6xl text-base-content/30 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-base-content/70 mb-2">
                                    No Skills Found
                                </h3>
                                <p className="text-base-content/50">
                                    Try adjusting your search or filter criteria
                                </p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {filteredSkills.length > displayCount && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-center"
                    >
                        <motion.button
                            onClick={loadMore}
                            className="bg-gradient-to-r from-primary to-secondary text-base-100 px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 hover:shadow-2xl transition-all duration-300 group"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            Load More Skills
                            <span className="text-sm opacity-80">
                                ({filteredSkills.length - displayCount} remaining)
                            </span>
                        </motion.button>
                    </motion.div>
                )}

                {filteredSkills.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mt-12 p-6 bg-base-200 rounded-3xl border border-base-300"
                    >
                        <p className="text-base-content/70">
                            🎉 Showing {Math.min(displayCount, filteredSkills.length)} of {filteredSkills.length} skills
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}