'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { motion, useAnimation } from 'framer-motion';
import { RedirectToSignIn, useUser } from '@clerk/nextjs';
import { ChevronDown, Trash2, Save, MoveLeft, Video } from 'lucide-react';
import TinyMCEEditor from '../TinyMCEEditor';
import Swal from 'sweetalert2';
import Link from 'next/link';
import CustomFileUpload from '../CustomFileUpload';

const fieldVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function UpdateProjectForm() {
  const controls = useAnimation();
  const { id } = useParams();
  const { user } = useUser();
  const router = useRouter();
  const [files, setFiles] = useState({ video: null });
  const [previews, setPreviews] = useState({ video: null });
  const [imagesList, setImagesList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    category: '',
    liveLink: '',
    githubLink: '',
    videoLink: '',
    order: 0
  });

  useEffect(() => {
    document.title = `Update Project | ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        `Update your project details on ${process.env.NEXT_PUBLIC_META_TITLE}`
      );

    const fetchData = async () => {
      try {
        const [projectRes, categoriesRes] = await Promise.all([
          fetch(`/api/projects/${id}`),
          fetch('/api/categories')
        ]);

        const project = await projectRes.json();
        const categoriesData = await categoriesRes.json();

        setProjectData({
          ...project,
          videoLink: project.videoLink || '',
          order: project.order || 0
        });
        setCategories(categoriesData.categories);
        setPreviews({
          video: project.videoLink || project.videoUrl
        });

        // Initialize imagesList from images or fallback to imageUrl
        const projectImages = (project.images && project.images.length > 0)
          ? project.images.map((url) => ({
              id: url,
              type: 'existing',
              url: url,
              isCover: url === project.imageUrl,
            }))
          : (project.imageUrl ? [{
              id: project.imageUrl,
              type: 'existing',
              url: project.imageUrl,
              isCover: true,
            }] : []);
        setImagesList(projectImages);
      } catch (error) {
        toast.error('Failed to load project data');
      }
    };

    fetchData();
  }, [id]);

  const handleImagesChange = (e) => {
    const filesList = Array.from(e.target.files);
    const newItems = filesList.map((file) => {
      const id = Math.random().toString(36).substring(2, 9);
      return {
        id,
        type: 'new',
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

  const handleFile = useCallback((type, file) => {
    if (!file) return;

    if (previews[type]) URL.revokeObjectURL(previews[type]);
    const preview = URL.createObjectURL(file);
    setFiles(prev => ({ ...prev, [type]: file }));
    setPreviews(prev => ({ ...prev, [type]: preview }));

    if (type === 'video') {
      setProjectData(prev => ({ ...prev, videoLink: '' }));
    }
  }, [previews]);

  const handleVideoUrlChange = useCallback((value) => {
    setProjectData(prev => ({
      ...prev,
      videoLink: value,
    }));
    setFiles(prev => ({ ...prev, video: null }));
    setPreviews(prev => ({ ...prev, video: value }));
  }, []);

  const handleVideoFileChange = useCallback((file) => {
    if (file) {
      setFiles(prev => ({ ...prev, video: file }));
      setProjectData(prev => ({ ...prev, videoLink: '' }));
      setPreviews(prev => ({ ...prev, video: URL.createObjectURL(file) }));
    }
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to update this project?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsSubmitting(true);

      try {
        const formData = new FormData();
        formData.append('title', projectData.title);
        formData.append('description', projectData.description);
        formData.append('category', projectData.category);
        formData.append('liveLink', projectData.liveLink);
        formData.append('githubLink', projectData.githubLink);
        formData.append('order', projectData.order);
        
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
          formData.append('videoLink', projectData.videoLink);
        } else if (files.video) {
          formData.append('video', files.video);
        }

        const response = await fetch(`/api/projects/${id}`, {
          method: 'PUT',
          body: formData,
        });

        if (!response.ok) throw new Error('Update failed');
        Swal.fire('Updated!', 'Your project has been updated.', 'success');
        router.refresh();
        router.push('/allProjects');
      } catch (error) {
        Swal.fire('Error!', error.message || 'Update failed', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure to delete project ?',
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
        setIsSubmitting(true);
        const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Deletion failed');
        Swal.fire('Deleted!', 'Your project has been deleted.', 'success');
        router.push('/allProjects');
      } catch (error) {
        Swal.fire('Error!', error.message || 'Deletion failed', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!user) return <RedirectToSignIn />;
  if (!projectData.title) return <LoadingSpinner />;

  return (
    <motion.div
      className="min-h-screen bg-base-100 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto mt-24 my-5 p-6 border border-primary shadow-sm shadow-primary rounded-lg"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.h2
          className="text-2xl font-semibold text-center mb-6 text-primary border-b-2 border-primary pb-2 w-[40%] mx-auto"
          variants={fieldVariant}
          transition={{ duration: 0.5 }}
        >
          Update Project
        </motion.h2>

        <FormSection title="Title" variants={fieldVariant} transition={{ delay: 0.1 }}>
          <input
            value={projectData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
            required
          />
        </FormSection>

        <FormSection title="Description" variants={fieldVariant} transition={{ delay: 0.2 }}>
          <TinyMCEEditor value={projectData.description} onChange={(value) => handleInputChange('description', value)} />
        </FormSection>

        <FormSection title="Live Link" variants={fieldVariant} transition={{ delay: 0.3 }}>
          <input
            type="url"
            value={projectData.liveLink}
            onChange={(e) => handleInputChange('liveLink', e.target.value)}
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
          />
        </FormSection>

        <FormSection title="GitHub Link" variants={fieldVariant} transition={{ delay: 0.4 }}>
          <input
            type="url"
            value={projectData.githubLink}
            onChange={(e) => handleInputChange('githubLink', e.target.value)}
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
          />
        </FormSection>

        <FormSection title="Category" variants={fieldVariant} transition={{ delay: 0.5 }}>
          <div className="relative">
            <select
              value={projectData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md appearance-none focus:ring-2 focus:ring-primary pr-10"
            >
              <option value="" disabled className="bg-base-100 text-neutral">
                Select a Category
              </option>
              {categories.map(cat => (
                <option
                  key={cat._id}
                  value={cat._id}
                  className="bg-primary py-2 text-white hover:bg-base-100"
                >
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </FormSection>

        <FormSection title="Appearance Order" variants={fieldVariant} transition={{ delay: 0.55 }}>
          <input
            type="number"
            value={projectData.order}
            onChange={(e) => handleInputChange('order', e.target.value)}
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
            placeholder="Lower numbers appear first"
          />
        </FormSection>

        <FormSection title="Images" variants={fieldVariant} transition={{ delay: 0.6 }}>
          <CustomFileUpload
            id="images"
            accept="image/*"
            multiple={true}
            onChange={handleImagesChange}
            label="Choose or drop project images"
            helperText="Upload screenshots, mockups, layouts, etc. (Max 10MB each)"
          />
          {imagesList.length > 0 && (
            <div className="mt-6 border-2 border-dashed border-base-300 rounded-2xl p-4">
              <p className="text-sm font-semibold mb-3">Project Images ({imagesList.length}):</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagesList.map((item) => (
                  <div
                    key={item.id}
                    className={`relative rounded-xl overflow-hidden border-2 bg-neutral/5 p-2 transition-all duration-200 ${
                      item.isCover ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-base-300"
                    }`}
                  >
                    <img
                      src={item.type === 'existing' ? item.url : item.preview}
                      alt="preview"
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <div className="mt-2 flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => handleSetCover(item.id)}
                        className={`text-xs py-1 px-2 rounded-md font-medium transition-colors ${
                          item.isCover
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
        </FormSection>

        <FormSection title="Video" variants={fieldVariant} transition={{ delay: 0.7 }}>
          <div className="">
            <div>
              <label className="block text-sm font-medium mb-2">Video File</label>
              <FileUpload
                preview={previews.video}
                onFileChange={handleVideoFileChange}
                accept="video/*"
                isVideo
              />
            </div>
            <div className="text-center text-lg text-primary my-3">or</div>
            <div>
              <label className="block text-sm font-medium mb-2">Video URL</label>
              <input
                type="url"
                value={projectData.videoLink}
                onChange={(e) => handleVideoUrlChange(e.target.value)}
                placeholder="Paste video URL (e.g., YouTube, Vimeo)"
                className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
              />
            </div>
            {projectData.videoLink && (
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Video Preview:</p>
                {projectData.videoLink.includes("awesomescreenshot") ? (
                  <div className="flex flex-col items-center justify-center p-6 bg-base-200 border-2 border-dashed border-primary rounded-2xl text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                      <Video className="w-6 h-6 animate-pulse" />
                    </div>
                    <p className="text-sm font-bold text-base-content mb-1">Awesome Screenshot Link</p>
                    <p className="text-xs text-base-content/60 mb-4">Awesome Screenshot prevents embedding. Preview by opening the link below.</p>
                    <a
                      href={projectData.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary text-white"
                    >
                      Open Link in New Tab
                    </a>
                  </div>
                ) : (projectData.videoLink?.startsWith("https://www.youtube") ||
                  projectData.videoLink?.startsWith("https://youtu.be")) ? (
                  <iframe
                    src={projectData.videoLink.includes("watch?v=") ? projectData.videoLink.replace("watch?v=", "embed/") : projectData.videoLink}
                    className="mt-2 w-[90%] mx-auto h-[350px] rounded-md border border-primary "
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    controls
                    src={projectData.videoLink}
                    className="mt-2 w-full rounded-md border border-primary h-[350px] object-contain bg-black"
                  />
                )}
              </div>
            )}
          </div>
        </FormSection>

        <motion.div
          className="flex justify-between mt-6"
          variants={fieldVariant}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-error text-white rounded-md hover:bg-error/95 w-full mr-2 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Delete Project
              </>
            )}
          </motion.button>

          <motion.button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md w-full ml-2 hover:bg-primary/95 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save size={18} />
                Update Project
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.form>

      <motion.div
        className="w-full flex justify-center items-center mt-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <Link href="/admin">
          <button className="flex item-center gap-2 px-12 text-lg bg-primary p-4 w-full text-white font-medium rounded-full hover:bg-primary/80">
            <MoveLeft /> Go to Panel List
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

const LoadingSpinner = () => (
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
    <span className="text-primary text-lg">Loading Project...</span>
  </motion.div>
);

const FormSection = ({ title, children, variants, transition }) => (
  <motion.div
    className="mb-4"
    variants={variants}
    transition={transition}
  >
    <label className="block text-sm label font-medium mb-2">{title}</label>
    {children}
  </motion.div>
);

const FileUpload = ({ preview, onFileChange, accept, isVideo }) => (
  <>
  <CustomFileUpload
    id={isVideo ? "video" : "image"}
    accept={accept}
    multiple={false}
    onChange={(e) => onFileChange(e.target.files[0])}
    label={isVideo ? "Choose or drop video file" : "Choose or drop preview image"}
    helperText={isVideo ? "Video demo of the project (Max 50MB)" : "Format: PNG, JPG, WebP (Max 10MB)"}
    maxSizeMB={isVideo ? 50 : 10}
  />
    {preview && (
      <div className="mt-4">
        {isVideo ? (
          <video
            controls
            src={preview}
            className="mt-2 max-w-full sm:max-w-[80%] mx-auto rounded-md border border-primary p-4"
          />
        ) : (
          <img
            src={preview}
            alt="Preview"
            className="mt-2 max-w-full sm:max-w-[80%] mx-auto rounded-md border border-primary p-4"
          />
        )}
      </div>
    )}
  </>
);
