"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import {
  ChevronDown,
  Trash2,
  Save,
  ArrowLeft,
  Video,
  Sparkles,
  Edit,
  Globe,
  Image as ImageIcon,
  Check,
  ExternalLink,
  FileText,
  Upload,
  Link2
} from "lucide-react";
import { FiGithub } from "react-icons/fi";
import TinyMCEEditor from "../TinyMCEEditor";
import Swal from "sweetalert2";
import Link from "next/link";
import CustomFileUpload from "../CustomFileUpload";

export default function UpdateProjectForm({ id: propId }) {
  const params = useParams();
  const id = propId || params?.id;

  const { user } = useUser();
  const router = useRouter();

  const [files, setFiles] = useState({ video: null });
  const [previews, setPreviews] = useState({ video: null });
  const [imagesList, setImagesList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [videoSourceType, setVideoSourceType] = useState("file"); // "file" | "url"
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    category: "",
    liveLink: "",
    githubLink: "",
    videoLink: "",
    order: 0,
  });

  useEffect(() => {
    document.title = `Update Project | ${process.env.NEXT_PUBLIC_META_TITLE || "Admin"}`;

    const fetchData = async () => {
      if (!id) return;
      try {
        const [projectRes, categoriesRes] = await Promise.all([
          fetch(`/api/projects/${id}`),
          fetch("/api/categories"),
        ]);

        if (!projectRes.ok) throw new Error("Failed to fetch project");
        const project = await projectRes.json();
        const categoriesData = await categoriesRes.json();

        const catId =
          project.category && typeof project.category === "object"
            ? project.category._id
            : project.category || "";

        setProjectData({
          title: project.title || "",
          description: project.description || "",
          category: catId,
          liveLink: project.liveLink || "",
          githubLink: project.githubLink || "",
          videoLink: project.videoLink || "",
          order: project.order ?? 0,
        });

        setCategories(categoriesData.categories || []);
        setPreviews({
          video: project.videoLink || project.videoUrl || null,
        });

        // Initialize imagesList
        const projectImages =
          project.images && project.images.length > 0
            ? project.images.map((url) => ({
                id: url,
                type: "existing",
                url: url,
                isCover: url === project.imageUrl,
              }))
            : project.imageUrl
            ? [
                {
                  id: project.imageUrl,
                  type: "existing",
                  url: project.imageUrl,
                  isCover: true,
                },
              ]
            : [];
        setImagesList(projectImages);
      } catch (error) {
        toast.error("Failed to load project data");
      }
    };

    fetchData();
  }, [id]);

  const handleImagesChange = (e) => {
    const filesList = Array.from(e.target.files || []);
    const newItems = filesList.map((file) => {
      const randomId = Math.random().toString(36).substring(2, 9);
      return {
        id: randomId,
        type: "new",
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

  const handleVideoUrlChange = useCallback((value) => {
    setProjectData((prev) => ({
      ...prev,
      videoLink: value,
    }));
    setFiles((prev) => ({ ...prev, video: null }));
    setPreviews((prev) => ({ ...prev, video: value }));
  }, []);

  const handleVideoFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, video: file }));
      setProjectData((prev) => ({ ...prev, videoLink: "" }));
      setPreviews((prev) => ({ ...prev, video: URL.createObjectURL(file) }));
    }
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setProjectData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Update Project?",
      text: "Are you sure you want to save changes to this project?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setIsSubmitting(true);

      try {
        const formData = new FormData();
        formData.append("title", projectData.title);
        formData.append("description", projectData.description);
        formData.append("category", projectData.category);
        formData.append("liveLink", projectData.liveLink);
        formData.append("githubLink", projectData.githubLink);
        formData.append("order", projectData.order);

        // Build imagesMeta and append new images
        let newFileIndex = 0;
        const imagesMeta = imagesList.map((item) => {
          if (item.type === "existing") {
            return {
              type: "existing",
              url: item.url,
              isCover: item.isCover,
            };
          } else {
            formData.append("newImages", item.file);
            const meta = {
              type: "new",
              index: newFileIndex,
              isCover: item.isCover,
            };
            newFileIndex++;
            return meta;
          }
        });
        formData.append("imagesMeta", JSON.stringify(imagesMeta));

        if (projectData.videoLink) {
          formData.append("videoLink", projectData.videoLink);
        } else if (files.video) {
          formData.append("video", files.video);
        }

        const response = await fetch(`/api/projects/${id}`, {
          method: "PUT",
          body: formData,
        });

        if (!response.ok) throw new Error("Update failed");

        Swal.fire("Updated!", "Your project details have been saved.", "success");
        router.refresh();
        router.push("/allProjects");
      } catch (error) {
        Swal.fire("Error!", error.message || "Update failed", "error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Project?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete project",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        setIsSubmitting(true);
        const response = await fetch(`/api/projects/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Deletion failed");
        Swal.fire("Deleted!", "Project has been removed.", "success");
        router.push("/allProjects");
      } catch (error) {
        Swal.fire("Error!", error.message || "Deletion failed", "error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!user) return <RedirectToSignIn />;

  if (!projectData.title && !categories.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="text-sm font-medium text-base-content/70">Loading project details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* ─── Header Banner ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-secondary/10 p-6 sm:p-8 border border-primary/20 shadow-lg backdrop-blur-md">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <Edit className="w-3.5 h-3.5" />
              <span>Project Editor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent truncate max-w-xl">
              Edit Project: {projectData.title}
            </h1>
            <p className="text-base-content/70 text-xs sm:text-sm">
              Update project information, manage images, or modify demo links.
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
                  <p className="text-xs text-base-content/60">Title, category, and appearance order</p>
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
                  value={projectData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
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
                      value={projectData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
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
                    value={projectData.order}
                    onChange={(e) => handleInputChange("order", e.target.value)}
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
                <TinyMCEEditor
                  value={projectData.description}
                  onChange={(val) => handleInputChange("description", val)}
                />
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
                  label="Add project screenshots"
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
                    {imagesList.map((item) => {
                      const src = item.type === "existing" ? item.url : item.preview;
                      return (
                        <div
                          key={item.id}
                          className={`relative rounded-xl overflow-hidden border-2 bg-base-100 p-1 transition-all group ${
                            item.isCover
                              ? "border-primary ring-2 ring-primary/20 shadow-md"
                              : "border-base-300 hover:border-base-content/30"
                          }`}
                        >
                          <img
                            src={src}
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
                      );
                    })}
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
                    onChange={handleVideoFileChange}
                    label="Choose video file"
                    helperText="MP4, WebM (Max 50MB)"
                    maxSizeMB={50}
                  />
                ) : (
                  <input
                    type="url"
                    value={projectData.videoLink}
                    onChange={(e) => handleVideoUrlChange(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                    className="w-full bg-base-100 p-3 rounded-xl border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                  />
                )}

                {previews.video && (
                  <div className="rounded-xl overflow-hidden border border-base-300 bg-black/80 p-2 mt-2">
                    <p className="text-[11px] text-white/70 font-semibold mb-1 px-1">Preview:</p>
                    <video controls src={previews.video} className="w-full max-h-40 rounded-lg" />
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
                    value={projectData.liveLink}
                    onChange={(e) => handleInputChange("liveLink", e.target.value)}
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
                    value={projectData.githubLink}
                    onChange={(e) => handleInputChange("githubLink", e.target.value)}
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
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="btn btn-error btn-outline btn-sm rounded-xl gap-2 w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4" /> Delete Project
          </button>

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
              disabled={isSubmitting}
              className="btn btn-primary text-white btn-sm rounded-xl px-6 shadow-md shadow-primary/20 min-w-[140px] gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
}
