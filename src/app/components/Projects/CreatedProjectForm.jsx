"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ArrowLeft,
  Sparkles,
  FilePlus2,
  Globe,
  Check,
  Video,
  ExternalLink,
  Image as ImageIcon,
  FileText,
  Trash2,
  Upload,
  Link2
} from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import TinyMCEEditor from "../TinyMCEEditor";
import CustomFileUpload from "../CustomFileUpload";

export default function CreatedProjectForm() {
  const [title, setTitle] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [imagesList, setImagesList] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  const [videoSourceType, setVideoSourceType] = useState("file"); // "file" | "url"
  const [category, setCategory] = useState("");
  const [order, setOrder] = useState(0);
  const [description, setDescription] = useState("<p>Write a compelling description of your project...</p>");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    document.title = `Create Project | ${process.env.NEXT_PUBLIC_META_TITLE || "Admin"}`;
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/categories`);
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newItems = files.map((file) => {
      const id = Math.random().toString(36).substring(2, 9);
      return {
        id,
        file,
        preview: URL.createObjectURL(file),
        isCover: false,
      };
    });

    setImagesList((prev) => {
      const updated = [...prev, ...newItems];
      if (updated.length > 0 && !updated.some((item) => item.isCover)) {
        updated[0].isCover = true;
      }
      return updated;
    });
  };

  const handleSetCover = (id) => {
    setImagesList((prev) =>
      prev.map((item) => ({
        ...item,
        isCover: item.id === id,
      }))
    );
  };

  const handleRemoveImage = (id) => {
    setImagesList((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      if (filtered.length > 0 && !filtered.some((item) => item.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      setVideoLink("");
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoUrlChange = (e) => {
    const url = e.target.value;
    setVideoLink(url);
    setVideo(null);
    setVideoPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a project title");
      return;
    }
    if (!category) {
      toast.error("Please select a project category");
      return;
    }

    setIsLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("liveLink", liveLink);
    formData.append("githubLink", githubLink);
    formData.append("category", category);

    // Build newImages array and imagesMeta
    const imagesMeta = imagesList.map((item, index) => {
      formData.append("newImages", item.file);
      return {
        type: "new",
        index,
        isCover: item.isCover,
      };
    });
    formData.append("imagesMeta", JSON.stringify(imagesMeta));

    if (video) formData.append("video", video);
    if (videoLink) formData.append("videoLink", videoLink);
    formData.append("order", order);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setProgress(100);
      if (xhr.status === 200 || xhr.status === 201) {
        toast.success("Project created successfully!");
        router.push("/allProjects");
      } else {
        toast.error("Failed to create project!");
      }
      setIsLoading(false);
    };

    xhr.onerror = () => {
      toast.error("An unexpected error occurred!");
      setIsLoading(false);
    };

    xhr.open("POST", "/api/projects");
    xhr.send(formData);
  };

  if (!user) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* ─── Header Banner ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-secondary/10 p-6 sm:p-8 border border-primary/20 shadow-lg backdrop-blur-md">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <FilePlus2 className="w-3.5 h-3.5" />
              <span>Project Creator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
              Create New Project
            </h1>
            <p className="text-base-content/70 text-xs sm:text-sm">
              Fill in project information, upload assets, and add demo links.
            </p>
          </div>

          <Link href="/allProjects">
            <button type="button" className="btn btn-outline btn-sm rounded-xl gap-2 hover:bg-base-content/10">
              <ArrowLeft className="w-4 h-4" />
              All Projects
            </button>
          </Link>
        </div>
      </div>

      {/* ─── Form Grid (2 Equal Balanced Columns) ─── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* ─── LEFT COLUMN ─── */}
          <div className="space-y-6">
            {/* CARD 1: Basic Information */}
            <div className="bg-base-200/40 backdrop-blur-md rounded-3xl border border-base-300 p-6 space-y-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 pb-3 border-b border-base-300">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-base-content">1. Basic Information</h2>
                  <p className="text-xs text-base-content/60">Project title, category, and display order</p>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-base-content/80">
                  Project Title <span className="text-error">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. E-Commerce Platform"
                  required
                  className="w-full bg-base-100 p-3 rounded-xl border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                />
              </div>

              {/* Category & Order Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-base-content/80">
                    Category <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full bg-base-100 p-3 pr-10 rounded-xl border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/50 pointer-events-none" />
                  </div>
                </div>

                {/* Display Order */}
                <div className="space-y-1.5">
                  <label htmlFor="order" className="block text-xs font-bold uppercase tracking-wider text-base-content/80">
                    Sort Order
                  </label>
                  <input
                    id="order"
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    placeholder="0"
                    className="w-full bg-base-100 p-3 rounded-xl border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* CARD 2: Project Description */}
            <div className="bg-base-200/40 backdrop-blur-md rounded-3xl border border-base-300 p-6 space-y-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 pb-3 border-b border-base-300">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-base-content">2. Detailed Description</h2>
                  <p className="text-xs text-base-content/60">Rich text content for the project modal</p>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-base-300">
                <TinyMCEEditor value={description} onChange={setDescription} />
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="space-y-6">
            {/* CARD 3: Media & Screenshots */}
            <div className="bg-base-200/40 backdrop-blur-md rounded-3xl border border-base-300 p-6 space-y-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 pb-3 border-b border-base-300">
                <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-base-content">3. Project Media & Video</h2>
                  <p className="text-xs text-base-content/60">Upload screenshots and video demo</p>
                </div>
              </div>

              {/* Images Dropzone */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-base-content/80">
                  Screenshots & Mockups
                </label>
                <CustomFileUpload
                  id="images"
                  accept="image/*"
                  multiple={true}
                  onChange={handleImagesChange}
                  required={imagesList.length === 0}
                  label="Upload project screenshots"
                  helperText="PNG, JPG, WebP (Max 10MB each)"
                />
              </div>

              {/* Uploaded Images Grid */}
              {imagesList.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-base-content/70">
                    <span>Uploaded ({imagesList.length})</span>
                    <span>Click image to set cover</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {imagesList.map((item) => (
                      <div
                        key={item.id}
                        className={`relative rounded-xl overflow-hidden border-2 bg-base-100 p-1 transition-all group ${
                          item.isCover
                            ? "border-primary ring-2 ring-primary/20 shadow-md"
                            : "border-base-300 hover:border-base-content/30"
                        }`}
                      >
                        <img
                          src={item.preview}
                          alt="preview"
                          className="h-16 w-full object-cover rounded-lg"
                        />

                        {item.isCover && (
                          <span className="absolute top-1.5 left-1.5 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Cover
                          </span>
                        )}

                        <div className="mt-1 flex items-center justify-between gap-1">
                          {!item.isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetCover(item.id)}
                              className="text-[9px] font-semibold text-primary hover:underline"
                            >
                              Set Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(item.id)}
                            className="text-[9px] font-semibold text-error hover:underline ml-auto"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Section with Segmented Toggle */}
              <div className="space-y-3 pt-3 border-t border-base-300">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-accent" /> Video Demo
                  </label>

                  {/* Segmented Switch */}
                  <div className="flex items-center bg-base-100 p-1 rounded-xl border border-base-300 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setVideoSourceType("file")}
                      className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                        videoSourceType === "file"
                          ? "bg-primary text-white"
                          : "text-base-content/60 hover:text-base-content"
                      }`}
                    >
                      <Upload className="w-3 h-3" /> Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoSourceType("url")}
                      className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                        videoSourceType === "url"
                          ? "bg-primary text-white"
                          : "text-base-content/60 hover:text-base-content"
                      }`}
                    >
                      <Link2 className="w-3 h-3" /> Video URL
                    </button>
                  </div>
                </div>

                {videoSourceType === "file" ? (
                  <CustomFileUpload
                    id="video"
                    accept="video/*"
                    multiple={false}
                    onChange={handleVideoChange}
                    label="Choose video file"
                    helperText="MP4, WebM (Max 50MB)"
                    maxSizeMB={50}
                  />
                ) : (
                  <input
                    type="url"
                    value={videoLink}
                    onChange={handleVideoUrlChange}
                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                    className="w-full bg-base-100 p-3 rounded-xl border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                  />
                )}

                {videoPreview && (
                  <div className="rounded-xl overflow-hidden border border-base-300 bg-black/80 p-2 mt-2">
                    <p className="text-[11px] text-white/70 font-semibold mb-1 px-1">Preview:</p>
                    <video controls src={videoPreview} className="w-full max-h-40 rounded-lg" />
                  </div>
                )}
              </div>
            </div>

            {/* CARD 4: External Links */}
            <div className="bg-base-200/40 backdrop-blur-md rounded-3xl border border-base-300 p-6 space-y-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 pb-3 border-b border-base-300">
                <div className="p-2 rounded-xl bg-info/10 text-info">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-base-content">4. Links & Repository</h2>
                  <p className="text-xs text-base-content/60">Live URL and source code link</p>
                </div>
              </div>

              {/* Live Link */}
              <div className="space-y-1.5">
                <label htmlFor="liveLink" className="block text-xs font-bold uppercase tracking-wider text-base-content/80">
                  Live Demo Link
                </label>
                <div className="relative">
                  <input
                    id="liveLink"
                    type="url"
                    value={liveLink}
                    onChange={(e) => setLiveLink(e.target.value)}
                    placeholder="https://myproject.com"
                    className="w-full bg-base-100 p-3 pr-10 rounded-xl border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                  />
                  <ExternalLink className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                </div>
              </div>

              {/* GitHub Link */}
              <div className="space-y-1.5">
                <label htmlFor="githubLink" className="block text-xs font-bold uppercase tracking-wider text-base-content/80">
                  GitHub Link <span className="text-[11px] text-base-content/50 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    id="githubLink"
                    type="url"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    placeholder="https://github.com/username/repo (Optional)"
                    className="w-full bg-base-100 p-3 pr-10 rounded-xl border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                  />
                  <FiGithub className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Floating Action Bar ─── */}
        <div className="sticky bottom-4 z-20 bg-base-100/90 backdrop-blur-xl border border-base-300 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-base-content">Ready to save?</p>
            <p className="text-xs text-base-content/60">
              Project will immediately appear in your showcase upon publishing.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link href="/allProjects">
              <button type="button" className="btn btn-ghost btn-sm rounded-xl">
                Cancel
              </button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn btn-primary text-white btn-sm rounded-xl px-6 shadow-md shadow-primary/20 min-w-[140px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-xs" />
                  <span>Saving {progress}%</span>
                </div>
              ) : (
                "Publish Project"
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
}
