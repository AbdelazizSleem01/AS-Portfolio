'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useEditor, EditorContent } from '@tiptap/react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { RedirectToSignIn, useUser } from '@clerk/nextjs';
import { ChevronDown, Shapes, Loader2, Trash2, Save, Link } from 'lucide-react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextColor from '@tiptap/extension-color';
import { FontSize } from '../FontSize';
import TextToolbar from '../TextToolbar';

const fetcher = (...args) => fetch(...args).then(res => res.json());

const fieldVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function UpdateProjectForm() {
  const { id } = useParams();
  const { user } = useUser();
  const router = useRouter();
  const [files, setFiles] = useState({ image: null, video: null });
  const [previews, setPreviews] = useState({ image: null, video: null });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectData, setProjectData] = useState(null); // Local state for form data

  const { data: project, error, isLoading } = useSWR(`/api/projects/${id}`, fetcher, {
    revalidateOnFocus: false,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextColor,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      FontSize,
    ],
    content: '',
  });

  useEffect(() => {
    document.title = `Update Project | ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        `Update your project details on ${process.env.NEXT_PUBLIC_META_TITLE}`
      );
  }, []);

  // Initialize local state when project data loads
  useEffect(() => {
    if (project) {
      setProjectData(project);
      editor?.commands.setContent(project.description);
      setPreviews({
        image: project.imageUrl,
        video: project.videoLink,
      });
    }
  }, [project, editor]);

  const handleFile = useCallback((type, file) => {
    if (!file) return;

    if (previews[type]) URL.revokeObjectURL(previews[type]);
    const preview = URL.createObjectURL(file);
    setFiles(prev => ({ ...prev, [type]: file }));
    setPreviews(prev => ({ ...prev, [type]: preview }));
  }, [previews]);

  useEffect(() => () => {
    Object.values(previews).forEach(url => url && URL.revokeObjectURL(url));
  }, [previews]);

  const handleInputChange = useCallback((field, value) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', projectData.title);
      formData.append('description', editor.getHTML());
      formData.append('category', projectData.category);
      formData.append('liveLink', projectData.liveLink);
      formData.append('githubLink', projectData.githubLink);
      if (files.image) formData.append('image', files.image);
      if (files.video) formData.append('video', files.video);

      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Update failed');
      toast.success('Project updated!');
      router.refresh();
      router.push('/allProjects');
    } catch (error) {
      toast.error(error.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Deletion failed');
      toast.success('Project deleted');
      router.push('/allProjects');
    } catch (error) {
      toast.error(error.message || 'Deletion failed');
    } finally {
      setIsSubmitting(false);
      setShowDeleteModal(false);
    }
  };

  if (!user) return <RedirectToSignIn />;
  if (error) return <div>Failed to load project</div>;
  if (isLoading || !projectData) return <LoadingSpinner />;

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
          className="text-2xl font-semibold text-center mb-6"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Update Project
        </motion.h2>

        <FormSection title="Title" variants={fieldVariant}>
          <input
            value={projectData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
            required
          />
        </FormSection>

        <FormSection title="Description" variants={fieldVariant} transition={{ delay: 0.1 }}>
          <EditorContent
            editor={editor}
            className="w-full bg-neutral/10 p-3 mt-1 input-bordered rounded-md"
          />
          <TextToolbar editor={editor} />
        </FormSection>

        <FormSection title="Live Link" variants={fieldVariant} transition={{ delay: 0.2 }}>
          <input
            type="url"
            value={projectData.liveLink}
            onChange={(e) => handleInputChange('liveLink', e.target.value)}
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
          />
        </FormSection>

        <FormSection title="GitHub Link" variants={fieldVariant} transition={{ delay: 0.3 }}>
          <input
            type="url"
            value={projectData.githubLink}
            onChange={(e) => handleInputChange('githubLink', e.target.value)}
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
          />
        </FormSection>

        <FormSection title="Category" variants={fieldVariant} transition={{ delay: 0.4 }}>
          <CategorySelect
            value={projectData.category}
            onChange={value => handleInputChange('category', value)}
          />
        </FormSection>

        <FormSection title="Image" variants={fieldVariant} transition={{ delay: 0.5 }}>
          <FileUpload
            preview={previews.image}
            onFileChange={file => handleFile('image', file)}
            accept="image/*"
          />
        </FormSection>

        <FormSection title="Video" variants={fieldVariant} transition={{ delay: 0.6 }}>
          <FileUpload
            preview={previews.video}
            onFileChange={file => handleFile('video', file)}
            accept="video/*"
            isVideo
          />
        </FormSection>

        <motion.div
          className="flex justify-between mt-6"
          variants={fieldVariant}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            type="button"
            onClick={() => setShowDeleteModal(true)}
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

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isDeleting={isSubmitting}
      />

      <motion.div
        className="w-full flex justify-center items-center my-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Link href="/admin">
          <button className="text-lg bg-primary p-4 w-full text-white font-medium rounded-md hover:bg-primary/80 transition-colors">
            Go to Panel List
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

const CategorySelect = ({ value, onChange }) => {
  const { data } = useSWR('/api/categories', fetcher);

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md appearance-none focus:ring-2 focus:ring-primary pr-10"
      >
        <option value="" disabled className="bg-base-100 text-neutral">
          Select a Category
        </option>
        {data?.categories?.map(cat => (
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
  );
};

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

const DeleteModal = ({ isOpen, onClose, onConfirm, isDeleting }) => (
  <motion.div
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: isOpen ? 1 : 0 }}
    transition={{ duration: 0.3 }}
    style={{ display: isOpen ? 'flex' : 'none' }}
  >
    <motion.div
      className="bg-gray-50 p-6 rounded-lg shadow-lg mx-auto text-center border border-gray-300"
      initial={{ scale: 0.8 }}
      animate={{ scale: isOpen ? 1 : 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Are you sure you want to delete this project? 😢
      </h2>
      <div className="flex justify-center gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 w-full"
        >
          NO
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-white rounded-full animate-spin mx-auto" />
          ) : (
            "YES"
          )}
        </button>
      </div>
    </motion.div>
  </motion.div>
);