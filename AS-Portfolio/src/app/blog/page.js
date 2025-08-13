"use client"
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCards';
import Link from 'next/link';



const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = `Latest Posts  | ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      'Check out the latest blog posts from the creators of this website.'
    );
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className=' flex justify-between'>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl text-primary font-bold mb-8"
        >
          Latest Posts
        </motion.h1>
        <Link href={'/blog/create-post-open'}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-end text-lg bg-primary py-3 px-8 text-white rounded-md hover:bg-primary/95 mb-12"
          >
            Create New Post
          </motion.button>
        </Link>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <PostCard key={post._id} post={post} index={index} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;