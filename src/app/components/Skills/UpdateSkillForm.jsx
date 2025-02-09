"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Link from "next/link";

export default function UpdateSkillForm() {
    const { id } = useParams();
    const router = useRouter();
    const [skill, setSkill] = useState(null);
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false); // Loading state for update

    useEffect(() => {
        if (skill) {
            document.title = `Update ${skill?.name} Skill  | ${process.env.NEXT_PUBLIC_META_TITLE}`;
            document
                .querySelector('meta[name="description"]')
                ?.setAttribute(
                    'content',
                    `Update your skill: ${skill?.name} | ${process.env.NEXT_PUBLIC_META_TITLE}`
                );
        }
    }, [skill]);

    useEffect(() => {
        const fetchSkill = async () => {
            try {
                const response = await fetch(`/api/skills/${id}`);
                if (!response.ok) throw new Error("Failed to fetch skill");
                const data = await response.json();
                const skillData = data.skill || data;
                setSkill(skillData);
                setName(skillData.name);
                setPreviewImage(skillData.imageUrl);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
                setLoading(false);
            }
        };
        fetchSkill();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true); // Start loading for update

        const formData = new FormData();
        formData.append("name", name);
        if (image) formData.append("image", image);

        try {
            const response = await fetch(`/api/skills/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to update skill");

            toast.success("Skill updated successfully!");
            router.push("/allSkills");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsUpdating(false); // Stop loading for update
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true); // Start loading for delete
            const response = await fetch(`/api/skills/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete skill");
            }

            toast.success("Skill deleted successfully!");
            router.push("/allSkills");
        } catch (err) {
            console.error("Error deleting skill:", err);
            toast.error(err.message);
        } finally {
            setIsDeleting(false); // Stop loading for delete
            setShowDeleteModal(false);
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
                <motion.div
                    className="w-12 h-12 border-4 border-t-4 border-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <motion.span className="text-primary text-lg">
                    Loading Skill...
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
        <motion.div
            className="min-h-screen bg-base-100 p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-2xl mx-auto">
                <motion.h1
                    className="text-3xl font-bold text-neutral text-center mb-8"
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                >
                    Update Skill
                </motion.h1>

                <form onSubmit={handleSubmit} className="space-y-6 border border-primary rounded-md p-6">
                    <motion.div
                        className="form-control"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <label className="label">
                            <span className="label-text text-neutral">Skill Name</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input input-bordered bg-neutral/10 text-neutral"
                            required
                        />
                    </motion.div>

                    <motion.div
                        className="form-control"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <label className="label">
                            <span className="label-text text-neutral">Skill Image</span>
                        </label>
                        <div className="flex flex-col items-center gap-4">
                            {previewImage && (
                                <motion.div
                                    className="relative group"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-32 h-32 object-contain rounded-full border-4 border-primary/80"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                                        <span className="text-white">New Image Preview</span>
                                    </div>
                                </motion.div>
                            )}
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="file-input file-input-primary w-full"
                                accept="image/*"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <motion.button
                            type="submit"
                            className="flex-1 py-3 bg-primary text-white rounded-md hover:bg-primary/95 flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isUpdating || isDeleting} // Disable during loading
                        >
                            {isUpdating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Skill"
                            )}
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="flex-1 py-3 bg-error text-white rounded-md hover:bg-error/90 flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isUpdating || isDeleting} // Disable during loading
                        >
                            {isDeleting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Skill"
                            )}
                        </motion.button>
                    </motion.div>
                </form>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="bg-base-100 p-6 rounded-lg shadow-lg mx-4 max-w-md w-full border border-primary"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-xl font-semibold mb-4 text-primary">
                                Confirm Deletion
                            </h2>
                            <p className="mb-6 text-neutral">
                                Are you sure you want to delete this skill? This action cannot be undone.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 py-2 bg-error text-white rounded-md hover:bg-error/90 transition-colors flex items-center justify-center gap-2"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                <motion.div
                    className="mt-10 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link href="/allSkills">
                        <motion.button
                            className="text-lg bg-primary py-3 px-8 text-white rounded-md hover:bg-primary/95"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ← Back to All Skills
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
}