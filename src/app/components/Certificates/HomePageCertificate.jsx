"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Award, Edit, ExternalLink, Download } from "lucide-react";

export default function HomePageCertificates() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

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

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === certificates.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? certificates.length - 1 : prevIndex - 1
        );
    };

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
                        <h3 className="text-xl font-semibold text-primary mb-2">Loading Certificates</h3>
                        <p className="text-base-content/70">Fetching your achievements...</p>
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
                    <h3 className="text-xl font-semibold text-error mb-2">Error Loading Certificates</h3>
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
        <div className="min-h-screen bg-base-100 py-8 sm:py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 sm:mb-12 lg:mb-16"
                >
                    <motion.div
                        className="inline-flex items-center gap-3 mb-3 sm:mb-4"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Award className="text-3xl sm:text-4xl text-primary" />
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            My Certificates
                        </h1>
                    </motion.div>
                    <p className="text-base sm:text-lg lg:text-xl text-base-content/70 max-w-2xl mx-auto px-4">
                        Showcasing my professional achievements and learning milestones
                    </p>
                    <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-3 sm:mt-4 rounded-full" />
                </motion.div>

                {certificates.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="bg-base-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl sm:shadow-2xl border border-base-300">
                            <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-base-300">
                                <motion.img
                                    key={currentIndex}
                                    src={certificates[currentIndex].imageUrl}
                                    alt={certificates[currentIndex].title}
                                    className="w-full h-full object-contain"
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                />
                                
                                {/* تحسين الـ overlay للشاشات الصغيرة */}
                                <div className="absolute inset-0 bg-gradient-to-t from-base-100/60 sm:from-base-100/80 via-transparent to-transparent" />
                                
                                {/* تحسين الـ overlay للشاشات الصغيرة */}
                                <div className="absolute bottom-2 sm:bottom-4 lg:bottom-6 left-2 sm:left-4 lg:left-6 right-2 sm:right-4 lg:right-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-base-100/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-base-300"
                                    >
                                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-1 sm:mb-2 line-clamp-2">
                                            {certificates[currentIndex].title}
                                        </h3>
                                        {certificates[currentIndex].description && (
                                            <p className="text-base-content/70 mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base line-clamp-2">
                                                {certificates[currentIndex].description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <span className="text-xs sm:text-sm text-base-content/60 whitespace-nowrap">
                                                {currentIndex + 1} of {certificates.length}
                                            </span>
                                            <div className="flex gap-1 sm:gap-2 ml-auto">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="p-1.5 sm:p-2 bg-base-300 rounded-lg hover:bg-base-400 transition-colors"
                                                    onClick={() => window.open(certificates[currentIndex].imageUrl, '_blank')}
                                                    aria-label="Open certificate in new tab"
                                                >
                                                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="p-1.5 sm:p-2 bg-base-300 rounded-lg hover:bg-base-400 transition-colors"
                                                    onClick={() => {
                                                        const link = document.createElement('a');
                                                        link.href = certificates[currentIndex].imageUrl;
                                                        link.download = `${certificates[currentIndex].title}.jpg`;
                                                        link.click();
                                                    }}
                                                    aria-label="Download certificate"
                                                >
                                                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 sm:mt-6">
                                <motion.button
                                    onClick={prevSlide}
                                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-primary text-base-100 rounded-lg sm:rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm sm:text-base"
                                    whileHover={{ scale: 1.05, x: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">Previous</span>
                                </motion.button>

                                <div className="flex gap-1 sm:gap-2">
                                    {certificates.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentIndex(index)}
                                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                                                index === currentIndex 
                                                    ? 'bg-primary scale-125' 
                                                    : 'bg-base-400 hover:bg-base-500'
                                            }`}
                                            aria-label={`Go to certificate ${index + 1}`}
                                        />
                                    ))}
                                </div>

                                <motion.button
                                    onClick={nextSlide}
                                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-primary text-base-100 rounded-lg sm:rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm sm:text-base"
                                    whileHover={{ scale: 1.05, x: 2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>
                            </div>
                        </div>

                        {/* تحسين عرض الشهادات المصغرة للشاشات الصغيرة */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 mt-4 sm:mt-6 lg:mt-8">
                            {certificates.map((certificate, index) => (
                                <motion.div
                                    key={certificate._id}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`cursor-pointer rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${
                                        index === currentIndex 
                                            ? 'border-primary shadow-md sm:shadow-lg' 
                                            : 'border-base-300 hover:border-primary/50'
                                    }`}
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    <img
                                        src={certificate.imageUrl}
                                        alt={certificate.title}
                                        className="w-full h-16 sm:h-20 lg:h-24 object-cover"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12 sm:py-16"
                    >
                        <Award className="text-5xl sm:text-6xl text-base-content/30 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-base-content/70 mb-2">
                            No Certificates Found
                        </h3>
                        <p className="text-base-content/50 text-sm sm:text-base">
                            Certificates will appear here once added
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}