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
import { ChevronDown, MoveLeft, Shapes } from 'lucide-react';
import { RedirectToSignIn, useUser } from '@clerk/nextjs';

export default function CreatedProjectForm() {
    // All state hooks are called unconditionally
    const [title, setTitle] = useState('');
    const [liveLink, setLiveLink] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [video, setVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [videoLink, setVideoLink] = useState("");
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const router = useRouter();

    const { user } = useUser();

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
            TextColor.configure(
                
            ),
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

    if (!editor) {
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

    // Image change handler
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Video file change handler
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideo(file);
            setVideoLink("");
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    // Video URL change handler
    const handleVideoUrlChange = (e) => {
        const url = e.target.value;
        setVideoLink(url);
        setVideo(null);
        setVideoPreview(url);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setProgress(0);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", editor.getHTML());
        formData.append("liveLink", liveLink);
        formData.append("githubLink", githubLink);
        formData.append("category", category);
        if (image) formData.append("image", image);
        if (video) formData.append("video", video);
        if (videoLink) formData.append("videoLink", videoLink);

        // Simulate progress bar
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 100);

        try {
            const response = await fetch("/api/projects", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                toast.success("Project created successfully!");
                router.push("/allProjects");
            } else {
                toast.error("Failed to create project!");
            }
        } catch (error) {
            console.error("Error creating project:", error);
            toast.error("An unexpected error occurred!");
        } finally {
            clearInterval(interval);
            setIsLoading(false);
        }
    };


    const fieldVariant = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    if (!user) {
        return <RedirectToSignIn />;

    }

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
                                        {cat.name}
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
                        <label className="block text-sm font-medium mb-2">Video File</label>
                        <input
                            accept="video/*"
                            type="file"
                            onChange={handleVideoChange}
                            className="w-full bg-neutral/10 mt-1 file-input file-input-primary rounded-md"
                        />

                        <div className="text-center text-lg text-primary my-3">or</div>

                        <label className="block text-sm font-medium mb-2">Video URL</label>
                        <input
                            type="url"
                            value={videoLink}
                            onChange={handleVideoUrlChange}
                            placeholder="Paste video URL (e.g., YouTube, Vimeo)"
                            className="w-full bg-neutral/10 p-3 mt-1 mb-8 input input-bordered rounded-md"
                            />

                        {videoPreview && (
                            <div className="my-4 ">
                                <p className="text-sm">Video Preview:</p>
                                {videoPreview.includes("https://studio.youtube.com/") || videoPreview.includes("awesomescreenshot") ? (
                                    <iframe
                                        src={videoPreview}
                                        width="100%"
                                        height="500px"
                                        className="border-2 border-primary overflow-hidden rounded-lg p-4"
                                    ></iframe>
                                ) : (
                                    <video width="100%" height="500px" controls>
                                        <source src={videoPreview} />
                                    </video>
                                )}
                            </div>
                        )}


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
                            {isLoading && (
                                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                                    <motion.div
                                        className="h-2 bg-primary rounded-full"
                                        animate={{ width: `${progress}%` }}
                                        transition={{ ease: "linear", duration: 1 }}
                                    />
                                </div>
                            )}
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
                        <button className="flex item-center gap-2 px-12 text-lg bg-primary p-4 w-full text-white font-medium rounded-full hover:bg-primary/80">
                            <MoveLeft /> Go to Panel List
                        </button>
                    </Link>
                </motion.div>
            </motion.div>
        </>
    );
}