"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ChevronDown, MoveLeft, Shapes } from "lucide-react";
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
  const [category, setCategory] = useState("");
  const [order, setOrder] = useState(0);
  const [description, setDescription] = useState("<p> Write description </p>");
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
        "content",
        `Create and share your projects with ${process.env.NEXT_PUBLIC_META_TITLE}.`
      );
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/categories`);
        const data = await res.json();
        setCategories(data.categories);
      } catch (error) { }
    };

    fetchCategories();
  }, []);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
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
    const file = e.target.files[0];
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
              <label
                htmlFor="title"
                className="block text-sm label font-medium"
              >
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
              <label
                htmlFor="description"
                className="block text-sm label font-medium"
              >
                Project Description
              </label>
              <TinyMCEEditor value={description} onChange={setDescription} />
            </motion.div>

            {/* Live Link */}
            <motion.div
              className="mb-4"
              variants={fieldVariant}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <label
                htmlFor="liveLink"
                className="block text-sm label font-medium"
              >
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
              <label
                htmlFor="githubLink"
                className="block text-sm label font-medium"
              >
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
              <label
                htmlFor="category"
                className="flex items-center text-sm font-medium gap-2 mb-2 mt-6"
              >
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

            {/* Project Order */}
            <motion.div
              className="mb-4"
              variants={fieldVariant}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <label
                htmlFor="order"
                className="block text-sm label font-medium"
              >
                Project Appearance Order (lower numbers appear first)
              </label>
              <input
                id="order"
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="Sort Order (e.g., 0, 1, 2)"
                className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
              />
            </motion.div>

            {/* Image Upload */}
            <motion.div
              className="mb-4"
              variants={fieldVariant}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              <label
                htmlFor="images"
                className="block text-sm label font-medium"
              >
                Upload Images (Select one or more)
              </label>
              <CustomFileUpload
                id="images"
                accept="image/*"
                multiple={true}
                onChange={handleImagesChange}
                required={imagesList.length === 0}
                label="Choose or drop project images"
                helperText="Upload screenshots, layouts, mockups, etc. (Max 10MB each)"
              />

              {imagesList.length > 0 && (
                <div className="mt-6 border-2 border-dashed border-base-300 rounded-2xl p-4">
                  <p className="text-sm font-semibold mb-3">Project Images ({imagesList.length}):</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imagesList.map((item) => (
                      <div
                        key={item.id}
                        className={`relative rounded-xl overflow-hidden border-2 bg-neutral/5 p-2 transition-all duration-200 ${item.isCover ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-base-300"
                          }`}
                      >
                        <img
                          src={item.preview}
                          alt="preview"
                          className="h-24 w-full object-cover rounded-lg"
                        />
                        <div className="mt-2 flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => handleSetCover(item.id)}
                            className={`text-xs py-1 px-2 rounded-md font-medium transition-colors ${item.isCover
                              ? "bg-primary text-white"
                              : "bg-base-200 text-base-content hover:bg-primary/10"
                              }`}
                          >
                            {item.isCover ? "Cover / Front" : "Set as Cover"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(item.id)}
                            className="text-xs bg-error/10 text-error hover:bg-error hover:text-white py-1 px-2 rounded-md font-medium transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Video Upload */}
            <label className="block text-sm font-medium mb-2">Video File</label>
            <CustomFileUpload
              id="video"
              accept="video/*"
              multiple={false}
              onChange={handleVideoChange}
              label="Choose or drop video file"
              helperText="Upload a product demo, screen recording, etc. (Max 50MB)"
              maxSizeMB={50}
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
              <div className="my-4">
                <p className="text-sm font-semibold mb-2">Video Preview:</p>
                {videoPreview.includes("awesomescreenshot") ? (
                  <div className="flex flex-col items-center justify-center p-6 bg-base-200 border-2 border-dashed border-primary rounded-2xl text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                      <Shapes className="w-6 h-6 animate-pulse" />
                    </div>
                    <p className="text-sm font-bold text-base-content mb-1">Awesome Screenshot Link</p>
                    <p className="text-xs text-base-content/60 mb-4">Awesome Screenshot prevents embedding. Preview by opening the link below.</p>
                    <a
                      href={videoPreview}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary text-white"
                    >
                      Open Link in New Tab
                    </a>
                  </div>
                ) : videoPreview.includes("https://studio.youtube.com/") ||
                  videoPreview.includes("https://www.youtube.com") ||
                  videoPreview.includes("https://youtu.be") ? (
                  <iframe
                    src={videoPreview.includes("watch?v=") ? videoPreview.replace("watch?v=", "embed/") : videoPreview}
                    width="100%"
                    height="400px"
                    className="border-2 border-primary overflow-hidden rounded-lg p-4"
                  ></iframe>
                ) : (
                  <video width="100%" height="400px" controls>
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
