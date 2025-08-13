'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ArrowBigLeft, Save, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function UpdateCategory() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state for update and delete

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

    // SweetAlert2 confirmation for update
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this category?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsLoading(true); // Start loading

      try {
        const res = await fetch(`/api/categories/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        });

        if (res.ok) {
          Swal.fire('Updated!', 'Category updated successfully', 'success');
          router.push('/allCategories');
        } else {
          const errorData = await res.json();
          Swal.fire('Error!', errorData.error || 'Failed to update category', 'error');
        }
      } catch (error) {
        console.error('Error updating category:', error);
        Swal.fire('Error!', 'An unexpected error occurred', 'error');
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    // SweetAlert2 confirmation for delete
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsLoading(true); // Start loading
      try {
        const res = await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          Swal.fire('Deleted!', 'Category deleted successfully', 'success');
          router.push('/allCategories');
        } else {
          const errorData = await res.json();
          Swal.fire('Error!', errorData.error || 'Failed to delete category', 'error');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        Swal.fire('Error!', 'An unexpected error occurred', 'error');
      } finally {
        setIsLoading(false); // Stop loading
      }
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
              className="w-full py-3 gap-2 bg-primary rounded-md text-white font-medium hover:bg-primary/95 focus:outline-none focus:ring-1 focus:border-black flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              {isLoading ? (
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
                <>
                  <Save size={18} />
                  Update Category
                </>
              )}
            </motion.button>
            <motion.button
              type="button"
              onClick={handleDelete}
              className="w-full py-3 bg-red-500 gap-2 rounded-md text-white font-medium hover:bg-red-600 focus:outline-none focus:ring-1 focus:border-black flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              {isLoading ? (

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
                <>
                  <Trash2 size={18} />
                  Delete Category
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div >

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
    </>
  );
}