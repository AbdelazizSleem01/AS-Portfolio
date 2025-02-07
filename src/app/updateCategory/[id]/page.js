'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ArrowBigLeft } from 'lucide-react';
import ConfirmationModal from '@/app/components/ConfirmationModal';

export default function UpdateCategory() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [name, setName] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${id}`);
        if (res.ok) {
          const data = await res.json();
          setName(data.category.name); // Ensure the response structure matches
        } else {
          toast.error('Failed to load category');
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        toast.error('An unexpected error occurred');
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        toast.success('Category updated successfully');
        router.push('/allCategories');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleDelete = (e) => {
    e.preventDefault(); // Prevent form submission
    setIsDeleteModalOpen(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Category deleted successfully');
        router.push('/allCategories');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('An unexpected error occurred');
    }
    setIsDeleteModalOpen(false); // Close the modal
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
          Update Category
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

          <div className="flex gap-3">
            <motion.button
              type="submit"
              className="w-full py-3 bg-primary rounded-md text-white font-medium hover:bg-primary/95 focus:outline-none focus:ring-1 focus:border-black"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Update Category
            </motion.button>
            <motion.button
              type="button" // Set type to "button" to prevent form submission
              onClick={handleDelete}
              className="w-full py-3 bg-red-500 rounded-md text-white font-medium hover:bg-red-600 focus:outline-none focus:ring-1 focus:border-black"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Delete Category
            </motion.button>
          </div>
        </form>
      </motion.div>

      <motion.div
        className="w-full flex justify-center items-center my-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Link href="/categories">
          <button className="btn btn-primary text-white px-8 rounded-full shadow-lg hover:shadow-xl transition-all gap-2">
            <ArrowBigLeft />
            Return to Admin Dashboard
          </button>
        </Link>
      </motion.div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this category? 😥"
      />
    </>
  );
}