"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowBigLeft } from "lucide-react";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";

export default function GetAllSkills() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    
    const { user } = useUser();



    useEffect(() => {
        document.title = `All Skills | ${process.env.NEXT_PUBLIC_META_TITLE}`;
        document
            .querySelector('meta[name="description"]')
            ?.setAttribute(
                'content',
                `View all my skills on ${process.env.NEXT_PUBLIC_META_TITLE}.`
            );
    }, []);

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
                    Loading...
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

    if (!user) {
        return <RedirectToSignIn />;

    }
    return (
        <div className="min-h-screen bg-base-100 mt-14 p-8">
            <div className="Heading w-full flex justify-center items-center ">
                <h1 className="text-3xl semiHead font-bold w-full text-primary text-center">All Skills</h1>
            </div>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={skill._id}
                            className="bg-neutral rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="flex flex-col items-center">
                                <img
                                    src={skill.imageUrl}
                                    alt={skill.name}
                                    className="w-32 h-32 object-contain mb-4 rounded-full p-2 outline outline-4 outline-primary/80 shadow-primary shadow-lg"
                                />
                                <h3 className="text-xl font-semibold text-base-100 mb-4">
                                    {skill.name}
                                </h3>
                                <div className="flex gap-3 w-full">
                                    <Link href={`/updateSkill/${skill._id}`} className="w-full">
                                        <button
                                            className=" w-full text-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors"
                                        >
                                            Edit
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="mt-10 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: skills.length * 0.1 + 0.5, duration: 0.5 }}
                >
                    <Link href="/admin">
                        <button className="btn btn-primary px-8 text-white rounded-full shadow-lg hover:shadow-xl transition-all gap-2">
                            <ArrowBigLeft />
                            Return to Admin Dashboard
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}