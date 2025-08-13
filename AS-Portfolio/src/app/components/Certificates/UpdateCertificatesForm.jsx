"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { motion } from "framer-motion";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import Swal from 'sweetalert2';
import { MoveLeftIcon, Save, Trash2 } from "lucide-react";

export default function UpdateCertificateForm() {
    const { id } = useParams();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { user } = useUser();


    useEffect(() => {
        document.title = `Update Certificate | ${process.env.NEXT_PUBLIC_META_TITLE}`;
        document
            .querySelector('meta[name="description"]')
            ?.setAttribute(
                'content',
                `Update your certificates on ${process.env.NEXT_PUBLIC_META_TITLE}`
            );
    }, []);

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                const response = await fetch(`/api/Certificates/${id}`);
                if (!response.ok) throw new Error("Failed to fetch certificate");

                const data = await response.json();
                setTitle(data.title);
                setImagePreview(data.imageUrl);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificate();
    }, [id]);

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

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to update this certificate?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            setIsUpdating(true);

            try {
                const formData = new FormData();
                formData.append('title', title);
                if (image) formData.append('image', image);

                const response = await fetch(`/api/Certificates/${id}`, {
                    method: 'PUT',
                    body: formData,
                });

                if (!response.ok) throw new Error('Update failed');
                Swal.fire('Updated!', 'Your certificate has been updated.', 'success');
                router.push('/allCertificates');
            } catch (error) {
                Swal.fire('Error!', error.message || 'Update failed', 'error');
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                setIsDeleting(true);
                const response = await fetch(`/api/Certificates/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Deletion failed');
                Swal.fire('Deleted!', 'Your certificate has been deleted.', 'success');
                router.push('/allCertificates');
            } catch (error) {
                Swal.fire('Error!', error.message || 'Deletion failed', 'error');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const fieldVariant = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    if (loading) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center h-screen gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <motion.div
                    className="w-12 h-12 border-4 border-t-4 border-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <span className="text-primary text-lg">Loading Certificate...</span>
            </motion.div>
        );
    }

    if (!user) {
        return <RedirectToSignIn />;
    }

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
                    Update Certificate
                </motion.h2>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <motion.div
                        className="mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <label htmlFor="title" className="label">
                            <span className="label-text text-neutral">Certificate name</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter Certificate name"
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
                            <span className="label-text text-neutral">Certificate Image</span>
                        </label>
                        <input
                            accept="image/*"
                            id="image"
                            type="file"
                            onChange={handleImageChange}
                            className="file-input file-input-primary w-full"
                        />
                        {imagePreview && (
                            <motion.div
                                className="relative group"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={imagePreview}
                                    alt="Certificate preview"
                                    className="w-[80%] h-[80%] rounded-md object-contain border-4 border-primary/80 mx-auto"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white">New Image Preview</span>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 mt-6"
                        variants={fieldVariant}
                        transition={{ delay: 0.6 }}
                    >
                        <motion.button
                            type="submit"
                            className="flex-1 py-3 bg-primary rounded-md text-white font-medium hover:bg-primary/95 flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isUpdating || isDeleting}
                        >
                            {isUpdating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Update Certificate
                                </>
                            )}
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={handleDelete}
                            className="flex-1 py-3 bg-error text-white rounded-md hover:bg-error/90 flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isUpdating || isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={18} />
                                    Delete Certificate
                                </>
                            )}
                        </motion.button>
                    </motion.div>
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
                        className="text-lg bg-primary p-4 text-white font-medium rounded-full hover:bg-primary/95 px-8"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                      <MoveLeftIcon/>  Back to admin panel
                    </motion.button>
                </Link>
            </motion.div>
        </>
    );
}