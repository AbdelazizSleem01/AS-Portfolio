"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function HomePageSkills() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayCount, setDisplayCount] = useState(12);

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
        setDisplayCount(prevCount => prevCount + 4);
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
                    transition={{ repeat: Infinity, duration: .7, ease: "linear" }}
                />
                <motion.span
                    className="text-primary text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Loading Skills...
                </motion.span>
            </motion.div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-error text-xl mt-10">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 mt-14 p-8">
            <div className="Heading w-full flex justify-center items-center">
                <motion.h4
                    className="text-3xl semiHead font-bold w-full text-primary text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    All Skills
                </motion.h4>
            </div>

            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    initial="hidden"
                    animate="visible"
                >
                    {skills.slice(0, displayCount).map((skill, index) => (
                        <motion.div
                            key={skill._id}
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
                                scale: 1.05,
                                transition: { duration: 0.2 }
                            }}
                        >
                            <div className="flex flex-col items-center tooltip tooltip-top tooltip-primary"
                                data-tip={`${skill.name} Skill`}
                            >
                                <motion.img
                                    src={skill.imageUrl}
                                    alt={skill.name}
                                    className="w-32 h-32 object-contain mb-4 p-2 rounded-full outline outline-4 outline-primary/80 shadow-primary shadow-lg"
                                    initial={{ rotate: 0 }}
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                />
                                <motion.h3
                                    className="text-xl font-semibold mt-4 w-full text-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {skill.name}
                                </motion.h3>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {skills.length > displayCount && (
                    <div className="flex justify-center mt-8">
                        <motion.button
                            onClick={loadMore}
                            className="btn btn-primary px-8 py-3 text-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Load More Skills
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    );
}