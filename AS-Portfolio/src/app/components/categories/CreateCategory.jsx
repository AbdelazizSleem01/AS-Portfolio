'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { RedirectToSignIn, useUser } from '@clerk/nextjs';

export default function CreateCategory() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { user } = useUser();

  if (!user) {
      return <RedirectToSignIn />;

  }

  useEffect(() => {
    document.title = `Create Category | ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        `Create a new category on my portfolio. | ${process.env.NEXT_PUBLIC_META_TITLE}`
      );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });

      if (res.ok) {
        toast.success('Category created successfully');
        router.push('/allCategories');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false); // Stop loading in any case
    }
  };

  return (
    <>
      <motion.div
        className="max-w-4xl mx-auto mt-32 mb-5 p-6 border border-primary shadow-lg rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-2xl font-semibold text-center mb-6 text-neutral"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          Create New Category
        </motion.h2>

        <form onSubmit={handleSubmit}>
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <label htmlFor="name" className="label">
              <span className="label-text text-neutral">Category Name</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
              className="input input-bordered bg-neutral/10 text-neutral w-full"
            />
          </motion.div>

          <motion.button
            type="submit"
            className="w-full py-3 bg-primary rounded-md text-white font-medium hover:bg-primary/95 focus:outline-none focus:ring-1 focus:border-black flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? (
              // Loading spinner SVG
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
            ) : (
              'Create Category'
            )}
          </motion.button>
        </form>
      </motion.div>
      <motion.div
        className="w-full flex justify-center items-center my-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Link href="/categories">
          <motion.button
            className="text-lg bg-primary p-4 text-white font-medium rounded-md hover:bg-primary/95 px-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Categories
          </motion.button>
        </Link>
      </motion.div>
    </>
  );
}