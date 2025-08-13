"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowBigLeft, ArrowBigRight, Edit } from "lucide-react";

export default function HomePageCertificates() {
    // State management remains the same
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    // Data fetching logic remains unchanged
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

    // Loading spinner remains similar with minor styling tweaks
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

    // Error display with enhanced styling
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
        <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 pb-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-7xl mx-auto Heading"
            >
                <h5 className="semiHead text-4xl font-bold text-primary text-center">
                    My Certificates
                </h5>

                {certificates.length > 0 && (
                    <div className="relative group mx-auto flex justify-center mt-8">
                        {/* Carousel container */}
                        <div className="carousel w-full sm:w-full md:w-[90%] lg:w-[80%] xl:w-[70%] rounded-xl shadow-2xl bg-base-100 border border-base-300">
                            {certificates.map((certificate, index) => (
                                <div
                                    id={`slide${index}`}
                                    key={certificate._id}
                                    className="carousel-item relative w-full aspect-video"
                                >
                                    {/* Image container */}
                                    <div className="w-full h-full flex items-center justify-center p-3">
                                        <img
                                            src={certificate.imageUrl}
                                            alt={certificate.title}
                                            className="w-full h-full sm:w-[90%] sm:h-[90%] md:w-[80%] md:h-[80%] rounded-lg object-contain"
                                        />
                                    </div>

                                    {/* Title overlay */}
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 bg-black/40 px-3 py-2 sm:px-6 sm:py-3 rounded-2xl backdrop-blur-sm">
                                        <h6 className="text-lg sm:text-xl font-semibold text-neutral">
                                            {certificate.title}
                                        </h6>
                                    </div>

                                    {/* Navigation arrows */}
                                    <div className="absolute flex justify-between transform -translate-y-1/2 left-4 right-4 top-1/2">
                                        <a
                                            href={`#slide${index === 0 ? certificates.length - 1 : index - 1}`}
                                            className="btn btn-circle btn-sm sm:btn-md text-white btn-primary opacity-90 hover:opacity-100"
                                            aria-label="Previous slide"
                                        >
                                            <ArrowBigLeft aria-hidden="true" />
                                            <span className="sr-only">Previous</span>
                                        </a>
                                        <a
                                            href={`#slide${index === certificates.length - 1 ? 0 : index + 1}`}
                                            className="btn btn-circle btn-sm sm:btn-md text-white btn-primary opacity-90 hover:opacity-100"
                                            aria-label="Next slide"
                                        >
                                            <ArrowBigRight aria-hidden="true" />
                                            <span className="sr-only">Next</span>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}