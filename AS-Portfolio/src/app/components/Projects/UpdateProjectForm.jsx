'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { motion, useAnimation } from 'framer-motion';
import { RedirectToSignIn, useUser } from '@clerk/nextjs';
import { ChevronDown, Trash2, Save, MoveLeft } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import Swal from 'sweetalert2';
import Link from 'next/link';

const fieldVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function UpdateProjectForm() {
  const controls = useAnimation();
  const { id } = useParams();
  const { user } = useUser();
  const router = useRouter();
  const editorRef = useRef(null);
  const [files, setFiles] = useState({ image: null, video: null });
  const [previews, setPreviews] = useState({ image: null, video: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    category: '',
    liveLink: '',
    githubLink: '',
    videoLink: '',
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
          fetch('/api/categories'),
        ]);

        const project = await projectRes.json();
        const categoriesData = await categoriesRes.json();

        setProjectData({
          ...project,
          videoLink: project.videoLink || '',
          description: project.description || '<p>Write description</p>',
        });
        setCategories(categoriesData.categories);
        setPreviews({
          image: project.imageUrl,
          video: project.videoLink || project.videoUrl,
        });
      } catch (error) {
        toast.error('Failed to load project data');
      }
    };

    fetchData();
  }, [id]);

  const handleFile = useCallback(
    (type, file) => {
      if (!file) return;

      if (previews[type]) URL.revokeObjectURL(previews[type]);
      const preview = URL.createObjectURL(file);
      setFiles((prev) => ({ ...prev, [type]: file }));
      setPreviews((prev) => ({ ...prev, [type]: preview }));

      if (type === 'video') {
        setProjectData((prev) => ({ ...prev, videoLink: '' }));
      }
    },
    [previews]
  );

  const handleVideoUrlChange = useCallback((value) => {
    setProjectData((prev) => ({
      ...prev,
      videoLink: value,
    }));
    setFiles((prev) => ({ ...prev, video: null }));
    setPreviews((prev) => ({ ...prev, video: value }));
  }, []);

  const handleVideoFileChange = useCallback((file) => {
    if (file) {
      setFiles((prev) => ({ ...prev, video: file }));
      setProjectData((prev) => ({ ...prev, videoLink: '' }));
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
      title: 'Are you sure?',
      text: 'Do you want to update this project?',
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
        formData.append('description', editorRef.current.getContent());
        formData.append('category', projectData.category);
        formData.append('liveLink', projectData.liveLink);
        formData.append('githubLink', projectData.githubLink);
        if (files.image) formData.append('image', files.image);
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
      title: 'Are you sure to delete project?',
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
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || 'no-api-key'}
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={projectData.description}
            init={{
              height: 400,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
                'emoticons',
                'textcolor',
              ],
              toolbar:
                'undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | \
                forecolor backcolor | fontselect fontsizeselect | emoticons | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              font_formats:
                'Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; Times New Roman=times new roman,times,serif',
              fontsize_formats: '8px 9px 10px 11px 12px 14px 16px 18px 20px 24px 28px 32px 36px 40px 44px',
            }}
          />
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
            <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </FormSection>

        <FormSection title="Image" variants={fieldVariant} transition={{ delay: 0.6 }}>
          <FileUpload
            preview={previews.image}
            onFileChange={(file) => handleFile('image', file)}
            accept="image/*"
          />
        </FormSection>

        <FormSection title="Video" variants={fieldVariant} transition={{ delay: 0.7 }}>
          <div>
            <label className="block text-sm font-medium mb-2">Video File</label>
            <FileUpload
              preview={previews.video}
              onFileChange={handleVideoFileChange}
              accept="video/*"
              isVideo
            />
            <div className="text-center text-lg text-primary my-3">or</div>
            <label className="block text-sm font-medium mb-2">Video URL</label>
            <input
              type="url"
              value={projectData.videoLink}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
              placeholder="Paste video URL (e.g., YouTube, Vimeo)"
              className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
            />
            {projectData.videoLink && (
              <div className="mt-4 h-[350px] overflow-hidden">
                <p className="text-sm">Video Preview:</p>
                {(projectData.videoLink?.startsWith('https://www.youtube') ||
                  projectData.videoLink?.startsWith('https://youtu.be') ||
                  projectData.videoLink?.startsWith('https://www.awesomescreenshot.com/')) ? (
                  <iframe
                    src={projectData.videoLink}
                    className="mt-2 w-[90%] mx-auto h-[350px] rounded-md border border-primary"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    controls
                    src={projectData.videoLink}
                    className="mt-2 w-full rounded-md border border-primary"
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
  <motion.div className="mb-4" variants={variants} transition={transition}>
    <label className="block text-sm label font-medium mb-2">{title}</label>
    {children}
  </motion.div>
);

const FileUpload = ({ preview, onFileChange, accept, isVideo }) => (
  <>
    <input
      type="file"
      onChange={(e) => onFileChange(e.target.files[0])}
      accept={accept}
      className="file-input file-input-primary w-full bg-neutral/10 mt-1 rounded-md"
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
