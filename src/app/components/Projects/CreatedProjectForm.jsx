"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useEditor, EditorContent } from '@tiptap/react';
import { motion } from 'framer-motion';
import StarterKit from '@tiptap/starter-kit';
import TextColor from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Text from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import { FontSize } from '../FontSize';
import TextToolbar from '../TextToolbar';
import { ChevronDown, Shapes } from 'lucide-react';
import { RedirectToSignIn, useUser } from '@clerk/nextjs';

export default function CreatedProjectForm() {
    // All state hooks are called unconditionally
    const [title, setTitle] = useState('');
    const [liveLink, setLiveLink] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const router = useRouter();

    const { user } = useUser();

    if (!user) {
        return <RedirectToSignIn />;
  
    }
  
    useEffect(() => {
        document.title = `Create Project | ${process.env.NEXT_PUBLIC_META_TITLE}`;
        document
            .querySelector('meta[name="description"]')
            ?.setAttribute(
                'content',
                `Create and share your projects with ${process.env.NEXT_PUBLIC_META_TITLE}.`
            );
    }, []);

    const editor = useEditor({
        extensions: [
            Text,
            Paragraph,
            Document,
            StarterKit,
            TextColor,
            TextStyle.configure({
                HTMLAttributes: {
                    style: 'font-size',
                },
            }),
            FontSize,
            Highlight.configure({ multicolor: true }),
            Underline,
            Heading.configure({
                levels: [1, 2, 3, 4, 5, 6],
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: '<p> Write description </p>',
        immediatelyRender: false,

    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`/api/categories`);
                const data = await res.json();
                setCategories(data.categories);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };

        fetchCategories();
    }, []);

    if (!isClient || !editor) {
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
                    Loading...
                </motion.span>
            </motion.div>
        );
    }

    // Handlers for image and video file changes
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideo(file);
            const previewUrl = URL.createObjectURL(file);
            setVideoPreview(previewUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', editor.getHTML());
        formData.append('liveLink', liveLink);
        formData.append('githubLink', githubLink);
        formData.append('category', category);
        formData.append('image', image);
        if (video) {
            formData.append('video', video);
        }

        try {
            const response = await fetch(`/api/projects`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Project Created:', data);
                toast.success("Project created successfully!");
                router.push("/allProjects");
            } else {
                console.error('Error creating project');
                toast.error("Failed to create project!");
            }
        } catch (error) {
            console.error('Error creating project:', error);
            toast.error("An unexpected error occurred!");
        } finally {
            setIsLoading(false);
        }
    };

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
                            <label htmlFor="category" className="flex items-center text-sm font-medium gap-2 mb-2 mt-6">
                                Select Category <Shapes size={20} />
                            </label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md appearance-none focus:ring-2 focus:ring-primary focus:border-primary pr-10"
                            >
                                <option value="" disabled className=" bg-base-100 text-neutral">
                                    Select a Category
                                </option>
                                {categories.map((cat) => (
                                    <option
                                        key={cat._id}
                                        value={cat._id}
                                        className="bg-primary py-2 text-white hover:bg-base-100"
                                    >
                                        <p className=' border-2 border-white'>
                                            {cat.name}
                                        </p>
                                    </option>
                                ))}
                            </select>
                            {/* Custom dropdown arrow */}
                            <div className="pointer-events-none absolute inset-y-0  right-0 flex items-center px-2 mt-10">
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
                                        className="mt-2 max-w-full sm:max-w-[30%] mx-auto rounded-md border border-primary p-4"
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
                    <Link href="/admin">
                        <button className="text-lg bg-primary p-4 w-full text-white font-medium rounded-md hover:bg-primary/80">
                            Go to Panel List
                        </button>
                    </Link>
                </motion.div>
            </motion.div>
        </>
    );
}
