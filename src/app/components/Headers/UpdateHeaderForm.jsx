'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextColor from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { FontSize } from '../FontSize';
import TextToolbar from '../TextToolbar';
import { motion } from "framer-motion";


export default function UpdateHeaderForm() {
    const [header, setHeader] = useState(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        document.title = `Update Header | ${process.env.NEXT_PUBLIC_META_TITLE}`;
        document
            .querySelector('meta[name="description"]')
            ?.setAttribute(
                'content',
                `Update your header details on ${process.env.NEXT_PUBLIC_META_TITLE}`
            );
        // Key Words
        document.querySelector('meta[name="keywords"]')
            ?.setAttribute(
                'content',
                `update, header, ${process.env.NEXT_PUBLIC_META_TITLE}`
            );
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextColor,
            TextStyle,
            Highlight.configure({ multicolor: true }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            FontSize,
        ],
        content: '',
        immediatelyRender: false,

    });

    useEffect(() => {
        const fetchHeader = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/headers/${id}`);
                if (!response.ok) throw new Error('Failed to fetch header');
                const data = await response.json();
                setHeader(data);
                editor?.commands.setContent(data.description || '');

                if (data.imageUrl) {
                    setImagePreview(data.imageUrl);
                }
            } catch (error) {
                console.error('Error fetching header:', error);
                toast.error('Error fetching header data');
            } finally {
                setLoading(false);
            }
        };

        fetchHeader();
    }, [id, editor]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        const formData = new FormData();
        formData.append('Id', id);
        formData.append('title', header.title);
        formData.append('description', editor.getHTML());
        formData.append('githubLink', header.githubLink);
        formData.append('linkedInLink', header.linkedInLink);
        if (image) formData.append('image', image);

        try {
            const response = await fetch(`/api/headers/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to update header');
            toast.success('Header updated successfully!');
            router.push('/allHeaders');
        } catch (error) {
            console.error('Error updating header:', error);
            toast.error('Failed to update header');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await fetch(`/api/headers/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete header');
            toast.success('Header deleted successfully!');
            router.push('/allHeaders');
        } catch (error) {
            console.error('Error deleting header:', error);
            toast.error('Failed to delete header');
        } finally {
            setIsDeleting(false);
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
                    Loading Header...
                </motion.span>
            </motion.div>
        );
    }

    if (!header) {
        return <p className="text-center text-lg">Header not found.</p>;
    }


     // Framer Motion variants for staggered animation
     const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const fieldVariant = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    return header ? (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto my-5 mt-24 p-6 border border-primary text-neutral shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-6">Update Header</h2>

            <div className="mb-4">
                <label htmlFor="title" className="label  block text-sm font-medium">Title</label>
                <input
                    id="title"
                    type="text"
                    value={header.title}
                    onChange={(e) => setHeader({ ...header, title: e.target.value })}
                    className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="label block text-sm font-medium">Description</label>
                <EditorContent
                    id="description"
                    editor={editor}
                    className="w-full p-3 bg-neutral/10 mt-1  text-neutral  input-bordered rounded-md"
                />
                <TextToolbar editor={editor} />
            </div>

            <div className="mb-4">
                <label htmlFor="githubLink" className="label block text-sm font-medium">Live Link</label>
                <input
                    id="githubLink"
                    type="url"
                    value={header.githubLink}
                    onChange={(e) => setHeader({ ...header, githubLink: e.target.value })}
                    className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="linkedInLink" className="label block text-sm font-medium">linkedIn Link</label>
                <input
                    id="linkedInLink"
                    type="url"
                    value={header.linkedInLink}
                    onChange={(e) => setHeader({ ...header, linkedInLink: e.target.value })}
                    className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="image" className="label block text-sm font-medium">Image</label>
                <input
                    accept="image/*"
                    id="image"
                    type="file"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        setImage(file);
                        setImagePreview(URL.createObjectURL(file));
                    }}
                    className="file-input file-input-primary w-full bg-neutral/10 mt-1  rounded-md "
                />
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Image preview"
                        className="mt-4 max-w-[35%]  mx-auto rounded-md border border-primary p-4"
                    />
                )}
            </div>

            {/* Buttons */}
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
                    disabled={isUpdating || isDeleting} // Disable during loading
                >
                    {isUpdating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
                            Updating...
                        </>
                    ) : (
                        "Update Header"
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
                        "Delete Header"
                    )}
                </motion.button>
            </motion.div>


            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg mx-auto text-center">
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this header? 😢</h2>
                        <div className="flex justify-center gap-4 ">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600  w-full "
                            >
                                NO
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    handleDelete();
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600  w-full "
                            >
                                YES
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form >
    ) : (
        <p className="flex justify-center items-center text-xl font-bold">Header not found.</p>
    );
}