'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowBigLeft } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export default function PostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();


  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchPost = async () => {
      try {
        const slug = params?.slug;
        if (!slug) throw new Error('Invalid post identifier');

        const response = await fetch(`/api/posts/${slug}`, { signal });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setPost(data);

      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load post content');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    return () => controller.abort();
  }, [params?.slug]);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} post  | ${process.env.NEXT_PUBLIC_META_TITLE}`;
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute(
          'content',
          `This is the ${post.title} post. ${post.content}`
        );
    }
  }, [post]);


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
        {/* Spinner Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Animated Spinner */}
          <div className="relative inline-block w-12 h-12">
            <div className="absolute w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>

          {/* Loading Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xl font-medium text-primary">
              Loading Post Content
            </span>
          </motion.div>
        </motion.div>
      </div>
    );
  }



  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <div className="text-2xl text-red-600 mb-4">⚠️ Error Loading Content</div>
        <p className="text-primary mb-8 max-w-xl">{error}</p>
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 transition-colors">
          ← Return to Blog Index
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="bg-base-100 min-h-screen"
    >
      {post && (
        <article className="container mx-auto max-w-4xl mt-24 border-2 border-primary rounded-lg bg-neutral text-base-100">
          {/* Cover Image with Fallback */}
          <motion.figure
            variants={slideUp}
            className="mb-8   overflow-hidden shadow-lg"
          >
            <img
              src={post.coverImage}
              alt={post.title || 'Article cover image'}
              className="w-full h-auto object-cover border-b-2 border-primary rounded-t-md"
              loading="eager"
            />
          </motion.figure>

          {/* Article Header */}
          <header className="mb-12 px-5">
            <motion.div variants={slideUp} className="mt-4 flex items-center gap-4">
              {post.userImage && (
                <img
                  src={post.userImage}
                  alt="Author"
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-base-100/80 text-sm">Author</p>
                <p className="text-primary font-medium">{post.name}</p>
              </div>
            </motion.div>
            <motion.h1
              variants={slideUp}
              className="text-4xl font-bold text-primary mb-4 leading-tight"
            >
              {post.title || 'Untitled Post'}
            </motion.h1>

            <motion.div variants={slideUp} className="flex items-center space-x-4 text-base-100/60">
              <time className="text-sm">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 bg-blue-100 text-primary rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </header>

          {/* Article Content */}
          <motion.section
            variants={fadeIn}
            className="prose prose-lg max-w-none mb-8 px-5"
          >
            {post.excerpt && (
              <p className="text-xl text-base-100/60 mb-8 font-light italic mt-[-20px]">
                {post.excerpt}
              </p>
            )}

            <div
              style={{ whiteSpace: 'pre-wrap' }} 
              className="mt-[-20px] px-10"
            >
              {post.content || 'Content not available'}
            </div>
          </motion.section>
        </article>
      )}

      {/* Footer Navigation */}
      <motion.footer
        variants={fadeIn}
        className="border-t flex justify-center mt-5 border-primary pt-8 pb-12"
      >
        <Link href="/blog">
          <button className="btn btn-primary px-8 text-white rounded-full shadow-lg hover:shadow-xl transition-all gap-2">
            <ArrowBigLeft />
            Back to All Blogs
          </button>
        </Link>
      </motion.footer>
    </motion.div>
  );
}