"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowBigLeft, ArrowBigRight, Edit } from "lucide-react";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";

export default function GetAllSCertificates() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useUser();

    if (!user) {
        return <RedirectToSignIn />;

    }


    useEffect(() => {
        document.title = `All Certificates | ${process.env.NEXT_PUBLIC_META_TITLE}`;
        document
            .querySelector('meta[name="description"]')
            ?.setAttribute(
                'content',
                `All my professional certifications, including ${certificates.length} certificates from ${process.env.NEXT_PUBLIC_COMPANY_NAME}`
            );
    }, []);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await fetch(`/api/Certificates`);
                if (!response.ok) throw new Error("Failed to fetch certificates");
                const data = await response.json();
                setCertificates(data);
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCertificates();
    }, []);

    if (loading) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center h-screen gap-4 bg-gradient-to-b from-base-100 to-base-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="w-16 h-16 border-4 border-t-4 border-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <motion.span className="text-primary text-xl font-medium">Loading Certificates...</motion.span>
            </motion.div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <div className="alert alert-error shadow-lg max-w-md">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-lg">Error: {error}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-7xl mx-auto Heading"
            >
                <h1 className="semiHead text-4xl font-bold text-primary text-center ">
                    Manage Certificates
                </h1>
                <span className="flex justify-center text-2xl mx-auto text-neutral font-normal mb-8">({certificates.length} entries)</span>

                {certificates.length > 0 ? (
                    <div className="relative group mx-auto flex justify-center">
                        {/* Fixed carousel container */}
                        <div className="carousel w-[80%]  rounded-xl shadow-2xl bg-base-100 border border-base-300">
                            {certificates.map((certificate, index) => (
                                <div
                                    id={`slide${index}`}
                                    key={certificate._id}
                                    className="carousel-item relative w-full aspect-video"
                                >
                                    {/* Image container */}
                                    <div className="w-full h-full flex items-center justify-center p-2">
                                        <img
                                            src={certificate.imageUrl}
                                            alt={certificate.title}
                                            className="w-[80%] h-[80%] rounded-lg"
                                        />
                                    </div>

                                    {/* Title and Edit button */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 bg-black/40 px-6 py-3 rounded-2xl backdrop-blur-sm">
                                        <h3 className="text-xl font-semibold text-white">{certificate.title}</h3>
                                        <Link href={`/updateCertificates/${certificate._id}`}>
                                            <button className="btn btn-sm btn-primary text-white gap-2">
                                                <Edit className="h-4 w-4" />
                                                Edit
                                            </button>
                                        </Link>
                                    </div>

                                    {/* Navigation arrows */}
                                    <div className="absolute flex justify-between transform -translate-y-1/2 left-4 right-4 top-1/2">
                                        <a
                                            href={`#slide${index === 0 ? certificates.length - 1 : index - 1}`}
                                            className="btn btn-circle btn-md text-white  btn-primary opacity-90 hover:opacity-100"
                                        >
                                            <ArrowBigLeft />
                                        </a>
                                        <a
                                            href={`#slide${index === certificates.length - 1 ? 0 : index + 1}`}
                                            className="btn btn-circle btn-md text-white  btn-primary opacity-90 hover:opacity-100"
                                        >
                                            <ArrowBigRight />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center mt-12">
                        <div className="alert alert-info max-w-2xl mx-auto">
                            <div className="flex-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <label>No certificates found in the database.</label>
                            </div>
                        </div>
                    </div>
                )}

                <motion.div
                    className="mt-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link href="/admin">
                        <button className="btn btn-primary text-white px-8 rounded-full shadow-lg hover:shadow-xl transition-all gap-2">
                            <ArrowBigLeft />
                            Return to Admin Dashboard
                        </button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}