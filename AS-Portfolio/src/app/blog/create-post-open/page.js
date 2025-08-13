'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const CreatePostPage = () => {
  const router = useRouter();

  useEffect(() => {
    document.title = `Create New Post | ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        `Create a new post on ${process.env.NEXT_PUBLIC_META_TITLE}`
      );
  }, []);

  const [formData, setFormData] = useState({

    name: '',
    title: '',
    content: '',
    slug: '',
    excerpt: '',
    tags: [],
    coverImage: null,
    userImage: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('slug', formData.slug);
    formDataToSend.append('excerpt', formData.excerpt);
    formDataToSend.append('tags', formData.tags.join(', '));
    formDataToSend.append('coverImage', formData.coverImage);
    formDataToSend.append('userImage', formData.userImage);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      const result = await response.json();
      router.push(`/blog`);
      toast.success('Post created successfully!');
    } catch (err) {
      toast.error(err.message || 'An error occurred while creating the post', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fieldVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };


  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
      .trim();
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-base-100 p-8"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto my-5 mt-24 p-6 border border-primary text-neutral shadow-lg rounded-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-2xl font-semibold text-center mb-6"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Create New Post
        </motion.h2>

        {error && (
          <motion.div
            className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}
        {/* name Field */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
          variants={fieldVariant}>
          <label className="block text-sm label font-medium">
            Name
          </label>
          <input
            type="text"
            placeholder='Enter your name'
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}


          />
        </motion.div>

        {/* user Image Field */}
        <motion.div className="mb-4" variants={fieldVariant}>
          <label htmlFor="userImage" className="block text-sm label font-medium">
            User Image
          </label>
          <input
            accept="image/*"
            id="userImage"
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              setFormData({ ...formData, userImage: file });
            }}
            className="w-full bg-neutral/10 mt-1 file-input file-input-primary rounded-md"

          />
          {formData.userImage && (
            <div className="mt-4">
              <p className="text-sm">Image Preview:</p>
              <img
                src={URL.createObjectURL(formData.userImage)}
                alt="Image preview"
                className="mt-2 max-w-32 mx-auto rounded-full border-2 border-primary"
              />
            </div>
          )}
        </motion.div>

        {/* Title Field */}
        <motion.div className="mb-4" variants={fieldVariant}>
          <label className="block text-sm label font-medium">
            Title of subject
          </label>
          <input
            type="text"
            placeholder='Enter your title'
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
            value={formData.title}
            onChange={(e) => {
              const newTitle = e.target.value;
              setFormData(prev => ({
                ...prev,
                title: newTitle,
                slug: generateSlug(newTitle)
              }));
            }}

          />
        </motion.div>

        {/* Slug Field */}
        <motion.div
          className="mb-4"
          variants={fieldVariant}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm label font-medium">
            Slug
          </label>
          <input
            type="text"
            placeholder='Enter your slug'
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}

          />
        </motion.div>

        {/* Content Field */}
        <motion.div
          className="mb-4"
          variants={fieldVariant}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm label font-medium">
            Content (Markdown)
          </label>
          <textarea
            className="w-full bg-neutral/10 p-3 mt-1 textarea textarea-bordered h-64 rounded-md"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}

          />
        </motion.div>
        {/* Excerpt Field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Excerpt</span>
          </label>
          <textarea
            className="textarea textarea-primary"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            maxLength={160}
            placeholder="A brief summary of your post"
            required
          />
        </div>

        {/* Tags Field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Tags (comma-separated)</span>
          </label>
          <input
            type="text"
            className="input input-primary"
            value={formData.tags.join(', ')}
            onChange={(e) => setFormData({
              ...formData,
              tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
            })}
            placeholder="nextjs, SEO, tutorial"
            required
          />
        </div>
        {/* Cover Image Field */}
        <motion.div
          className="mb-6"
          variants={fieldVariant}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm label font-medium">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({
              ...formData,
              coverImage: e.target.files[0]
            })}
            className="w-full bg-neutral/10 mt-1 file-input file-input-primary rounded-md"

          />
          {formData.coverImage && (
            <div className="mt-4">
              <p className="text-sm">Image Preview:</p>
              <img
                src={URL.createObjectURL(formData.coverImage)}
                alt="Cover preview"
                className="mt-2 max-w-[35%] mx-auto rounded-md border border-primary p-2"
              />
            </div>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          variants={fieldVariant}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary rounded-md text-white font-medium hover:bg-primary/80"
          >
            {loading ?
              (
                <div className='flex items-center gap-3 justify-center'>
                  Creating Post...
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )
              : 'Create Post'}
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default CreatePostPage;
