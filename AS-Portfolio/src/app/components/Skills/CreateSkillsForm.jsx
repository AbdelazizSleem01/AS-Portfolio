"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { motion } from "framer-motion";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";

export default function CreateSkillForm() {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const router = useRouter();

    const { user } = useUser();

    if (!user) {
      return <RedirectToSignIn />;
  
    }
  

    useEffect(() => {
        document.title = `Create Skill | ${process.env.NEXT_PUBLIC_META_TITLE}`;
        document
            .querySelector('meta[name="description"]')
            ?.setAttribute(
                'content',
                `Create a new skill on my portfolio. | ${process.env.NEXT_PUBLIC_META_TITLE}`
            );
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading

        const formData = new FormData();
        formData.append("name", name);
        formData.append("image", image);

        try {
            const response = await fetch(`/api/skills`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                toast.success("Skill created successfully!");
                router.push("/allSkills");
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Failed to create skill!");
            }
        } catch (error) {
            toast.error("An unexpected error occurred!");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <>
            <motion.div
                className="max-w-4xl mx-auto mt-32 mb-5 p-6 border border-primary shadow-lg rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h2
                    className="text-2xl font-semibold text-center mb-6 text-neutral"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    Create New Skill
                </motion.h2>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <motion.div
                        className="mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <label htmlFor="name" className="label">
                            <span className="label-text text-neutral">Skill name</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter skill name"
                            required
                            className="input input-bordered bg-neutral/10 text-neutral w-full"
                        />
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-center text-start gap-4 mb-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <label htmlFor="image" className="label">
                            <span className="label-text text-neutral">Skill Image</span>
                        </label>
                        <input
                            accept="image/*"
                            id="image"
                            type="file"
                            onChange={handleImageChange}
                            required
                            className="file-input file-input-primary w-full"
                        />
                        {imagePreview && (
                            <motion.img
                                src={imagePreview}
                                alt="Skill preview"
                                className="w-32 h-32 object-contain rounded-full border-4 border-primary/80"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </motion.div>

                    <motion.button
                        type="submit"
                        className="w-full py-3 bg-primary rounded-md text-white font-medium hover:bg-primary/95 focus:outline-none focus:ring-1 focus:border-black flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoading} // Disable button during loading
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Skill"
                        )}
                    </motion.button>
                </form>
            </motion.div>

            <motion.div
                className="w-full flex justify-center items-center my-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Link href="/admin">
                    <motion.button
                        className="text-lg bg-primary p-4 text-white font-medium rounded-md hover:bg-primary/95 px-8"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Back to Admin Panel
                    </motion.button>
                </Link>
            </motion.div>
        </>
    );
}