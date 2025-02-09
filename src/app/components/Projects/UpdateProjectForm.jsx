'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useEditor, EditorContent } from '@tiptap/react';
import { motion } from 'framer-motion';
import StarterKit from '@tiptap/starter-kit';
import TextColor from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { FontSize } from '../FontSize';
import TextToolbar from '../TextToolbar';

export default function UpdateProjectForm() {
    const [project, setProject] = useState(null);
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false); // Loading state for update
    const [isDeleting, setIsDeleting] = useState(false); // Loading state for delete
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        document.title = `Update Project | ${process.env.NEXT_PUBLIC_META_TITLE}`;
        document
            .querySelector('meta[name="description"]')
            ?.setAttribute(
                'content',
                `Update your project details on ${process.env.NEXT_PUBLIC_META_TITLE}`
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
        const fetchProject = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/projects/${id}`);
                if (!response.ok) throw new Error('Failed to fetch project');
                const data = await response.json();
                setProject(data);
                editor?.commands.setContent(data.description || '');
                if (data.imageUrl) {
                    setImagePreview(data.imageUrl);
                }
                if (data.videoLink) {
                    setVideoPreview(data.videoLink);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching project:', error);
                toast.error('Error fetching project data');
                setLoading(false);
            }
        };

        fetchProject();
    }, [id, editor]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true); // Start loading for update

        const formData = new FormData();
        formData.append('title', project.title);
        formData.append('description', editor.getHTML());
        formData.append('liveLink', project.liveLink);
        formData.append('githubLink', project.githubLink);
        if (image) formData.append('image', image);
        if (video) formData.append('video', video);

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to update project');
            toast.success('Project updated successfully!');
            router.push('/allProjects');
        } catch (error) {
            console.error('Error updating project:', error);
            toast.error('Failed to update project');
        } finally {
            setIsUpdating(false); // Stop loading for update
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true); // Start loading for delete
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete project');
            toast.success('Project deleted successfully!');
            router.push('/allProjects');
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Failed to delete project');
        } finally {
            setIsDeleting(false); // Stop loading for delete
            setShowDeleteModal(false);
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
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="w-12 h-12 border-4 border-t-4 border-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <motion.span className="text-primary text-lg">
                    Loading Project...
                </motion.span>
            </motion.div>
        );
    }

    if (!project) {
        return <p className="flex justify-center items-center text-xl font-bold text-gray-800">Project not found.</p>;
    }

    return (
        <motion.div
            className="min-h-screen bg-base-100 mt-16 p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.form
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto my-5 p-6 text-neutral shadow-lg rounded-lg border border-primary"
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.1 }}
            >
                <motion.h2
                    className="text-2xl font-semibold text-center mb-6"
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Update Project
                </motion.h2>

                {/* Title */}
                <motion.div className="mb-4" variants={fieldVariant}>
                    <label htmlFor="title" className="block text-sm label font-medium">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={project.title}
                        onChange={(e) => setProject({ ...project, title: e.target.value })}
                        className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
                        required
                    />
                </motion.div>

                {/* Description */}
                <motion.div className="mb-4" variants={fieldVariant} transition={{ delay: 0.1 }}>
                    <label htmlFor="description" className="block text-sm label font-medium">
                        Description
                    </label>
                    <EditorContent
                        id="description"
                        editor={editor}
                        className="w-full bg-neutral/10 p-3 mt-1 input-bordered rounded-md"
                    />
                    <TextToolbar editor={editor} />
                </motion.div>

                {/* Live Link */}
                <motion.div className="mb-4" variants={fieldVariant} transition={{ delay: 0.2 }}>
                    <label htmlFor="liveLink" className="block text-sm label font-medium">
                        Live Link
                    </label>
                    <input
                        id="liveLink"
                        type="url"
                        value={project.liveLink}
                        onChange={(e) => setProject({ ...project, liveLink: e.target.value })}
                        className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
                        required
                    />
                </motion.div>

                {/* GitHub Link */}
                <motion.div className="mb-4" variants={fieldVariant} transition={{ delay: 0.3 }}>
                    <label htmlFor="githubLink" className="block text-sm label font-medium">
                        GitHub Link
                    </label>
                    <input
                        id="githubLink"
                        type="url"
                        value={project.githubLink}
                        onChange={(e) => setProject({ ...project, githubLink: e.target.value })}
                        className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
                        required
                    />
                </motion.div>

                {/* Image */}
                <motion.div className="mb-4" variants={fieldVariant} transition={{ delay: 0.4 }}>
                    <label htmlFor="image" className="block text-sm label font-medium">
                        Image
                    </label>
                    <input
                        accept="image/*"
                        id="image"
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setImage(file);
                            setImagePreview(URL.createObjectURL(file));
                        }}
                        className="file-input file-input-primary w-full bg-neutral/10 mt-1 rounded-md"
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Image preview"
                            className="mt-4 max-w-[35%] mx-auto rounded-md border border-primary p-4"
                        />
                    )}
                </motion.div>

                {/* Video */}
                <motion.div className="mb-4" variants={fieldVariant} transition={{ delay: 0.5 }}>
                    <label htmlFor="video" className="block text-sm label font-medium">
                        Video
                    </label>
                    <input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setVideo(file);
                            setVideoPreview(URL.createObjectURL(file));
                        }}
                        className="file-input file-input-primary w-full bg-neutral/10 mt-1 rounded-md"
                    />
                    {videoPreview && (
                        <video controls src={videoPreview} className="mt-4 max-w-[35%] mx-auto rounded-md border border-primary">
                            Your browser does not support the video tag.
                        </video>
                    )}
                </motion.div>

                {/* Buttons */}
                <motion.div className="flex justify-between" variants={fieldVariant} transition={{ delay: 0.6 }}>
                    <motion.button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="px-4 py-2 bg-error text-white rounded-md hover:bg-error/95 w-full mr-2 flex items-center justify-center gap-2"
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
                            "Delete"
                        )}
                    </motion.button>
                    <motion.button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-md w-full ml-2 hover:bg-primary/95 flex items-center justify-center gap-2"
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
                            "Update"
                        )}
                    </motion.button>
                </motion.div>
            </motion.form>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="bg-gray-50 p-6 rounded-lg shadow-lg mx-auto text-center border border-gray-300"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Are you sure you want to delete this project? 😢
                        </h2>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 w-full"
                            >
                                NO
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    handleDelete();
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full"
                            >
                                YES
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
}