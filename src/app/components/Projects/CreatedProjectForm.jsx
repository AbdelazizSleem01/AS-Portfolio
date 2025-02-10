'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useEditor, EditorContent } from '@tiptap/react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import StarterKit from '@tiptap/starter-kit';
import TextColor from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Text from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import Document from '@tiptap/extension-document';
import TextAlign from '@tiptap/extension-text-align';
import TextToolbar from '../TextToolbar';
import { ArrowLeftIcon, ChevronDown, Shapes } from 'lucide-react';
import { RedirectToSignIn, useUser } from '@clerk/nextjs';
import { FontSize } from '../FontSize';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function CreatedProjectForm() {
    const [title, setTitle] = useState('');
    const [liveLink, setLiveLink] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [category, setCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { user } = useUser();

    const { data: categoryData } = useSWR('/api/categories', fetcher, {
        suspense: true,
        fallbackData: { categories: [] }
    });


    useEffect(() => {
        document.title = `Create Project | ${process.env.NEXT_PUBLIC_META_TITLE}`;
        document.querySelector('meta[name="description"]')
            ?.setAttribute('content', `Create and share your projects with ${process.env.NEXT_PUBLIC_META_TITLE}.`);
    }, []);

    const editor = useEditor({
        extensions: [
            Text,
            Paragraph,
            Document,
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
            }),
            TextColor,
            TextStyle,
            FontSize,
            Highlight.configure({ multicolor: true }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: '<p>Write description</p>',
    });

    useEffect(() => {
        setIsClient(true);
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            if (videoPreview) URL.revokeObjectURL(videoPreview);
        };
    }, [imagePreview, videoPreview]);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => setImagePreview(event.target.result);
        reader.readAsDataURL(file);
        setImage(file);
    };


    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            const previewUrl = URL.createObjectURL(file);
            setVideoPreview(previewUrl);
            setVideo(file);
        }
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!title || !editor?.getHTML() || !image) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', editor.getHTML());
        formData.append('liveLink', liveLink);
        formData.append('githubLink', githubLink);
        formData.append('category', category);
        formData.append('image', image);
        if (video) formData.append('video', video);

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                toast.success("Project created successfully!");
                router.push("/allProjects");
            } else {
                toast.error("Failed to create project!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Unexpected error!");
        } finally {
            setIsLoading(false);
        }
    }, [title, liveLink, githubLink, category, image, video, editor]);


    if (!user) return <RedirectToSignIn />;

    if (!isClient || !editor) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center h-screen gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <motion.div
                    className="w-12 h-12 border-4 border-t-4 border-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                />
                <span className="text-primary text-lg">Loading...</span>
            </motion.div>
        );
    }

    const fieldVariant = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };


    return (
        <>
            <motion.div
                className="min-h-screen bg-base-100 p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="max-w-4xl mx-auto mt-24 my-5 p-6 border border-primary text-neutral shadow-sm shadow-primary rounded-lg"
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
                        Create a New Project
                    </motion.h2>

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* Project Title */}
                        <motion.div
                            className="mb-4"
                            variants={fieldVariant}
                            initial="hidden"
                            animate="visible"
                        >
                            <label htmlFor="title" className="block text-sm label font-medium">
                                Project Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Project Title"
                                required
                                className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
                            />
                        </motion.div>

                        {/* Project Description */}
                        <motion.div
                            className="mb-4"
                            variants={fieldVariant}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.1 }}
                        >
                            <label htmlFor="description" className="block text-sm label font-medium">
                                Project Description
                            </label>
                            <EditorContent
                                id="description"
                                editor={editor}
                                className="w-full p-3 bg-neutral/10 mt-1 input-bordered rounded-md"
                            />
                            <TextToolbar editor={editor} />
                        </motion.div>

                        {/* Live Link */}
                        <motion.div
                            className="mb-4"
                            variants={fieldVariant}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.2 }}
                        >
                            <label htmlFor="liveLink" className="block text-sm label font-medium">
                                Live Link
                            </label>
                            <input
                                id="liveLink"
                                type="url"
                                value={liveLink}
                                onChange={(e) => setLiveLink(e.target.value)}
                                placeholder="Live Link"
                                className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
                            />
                        </motion.div>

                        {/* GitHub Link */}
                        <motion.div
                            className="mb-4"
                            variants={fieldVariant}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.3 }}
                        >
                            <label htmlFor="githubLink" className="block text-sm label font-medium">
                                GitHub Link
                            </label>
                            <input
                                id="githubLink"
                                type="url"
                                value={githubLink}
                                onChange={(e) => setGithubLink(e.target.value)}
                                placeholder="GitHub Link"
                                className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
                            />
                        </motion.div>

                        {/* Category Selection */}
                        <div className="mb-4 relative">
                            <label className="flex items-center text-sm font-medium gap-2 mb-2 mt-6">
                                Select Category <Shapes size={20} />
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md focus:ring-2 focus:ring-primary"
                            >
                                <option value="" disabled>Select a Category</option>
                                {categoryData?.categories?.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 mt-10">
                                <ChevronDown />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <motion.div
                            className="mb-4"
                            variants={fieldVariant}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.5 }}
                        >
                            <label htmlFor="image" className="block text-sm label font-medium">
                                Upload Image
                            </label>
                            <input
                                accept="image/*"
                                id="image"
                                type="file"
                                onChange={handleImageChange}
                                required
                                className="w-full bg-neutral/10 mt-1 file-input file-input-primary rounded-md"
                            />
                            {imagePreview && (
                                <div className="mt-4">
                                    <p className="text-sm">Selected Image Preview:</p>
                                    <img
                                        src={imagePreview}
                                        alt="Image preview"
                                        className="mt-2 max-w-full mx-auto rounded-md border border-primary p-4"
                                    />
                                </div>
                            )}
                        </motion.div>

                        {/* Video Upload */}
                        <motion.div
                            className="mb-4"
                            variants={fieldVariant}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.6 }}
                        >
                            <label htmlFor="video" className="block text-sm label font-medium">
                                Upload Video
                            </label>
                            <input
                                accept="video/*"
                                id="video"
                                type="file"
                                onChange={handleVideoChange}
                                required
                                className="w-full bg-neutral/10 mt-1 file-input file-input-primary rounded-md"
                            />
                            {videoPreview && (
                                <div className="mt-4">
                                    <p className="text-sm">Selected Video Preview:</p>
                                    <video
                                        src={videoPreview}
                                        controls
                                        className="mt-2 w-full sm:max-w-[90%] mx-auto rounded-md border border-primary p-4"
                                    />
                                </div>
                            )}
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div
                            variants={fieldVariant}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.7 }}
                        >
                            <button
                                type="submit"
                                className="w-full py-3 bg-primary rounded-md text-white font-medium hover:bg-primary/80 flex items-center justify-center gap-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Project"
                                )}
                            </button>
                        </motion.div>
                    </form>
                </motion.div>

                {/* Panel Link */}
                <motion.div
                    className="w-full flex justify-center items-center my-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <Link href="/admin" >
                        <button className=" flex item-center gap-2 justify-center text-lg bg-primary p-4 w-full text-white font-medium rounded-full px-12 hover:bg-primary/80 transition-colors">
                            <ArrowLeftIcon /> Go to Panel List
                        </button>
                    </Link>
                </motion.div>
            </motion.div>
        </>
    );
}
