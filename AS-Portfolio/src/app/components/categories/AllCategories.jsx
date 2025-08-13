"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';
import { RedirectToSignIn, useUser } from '@clerk/nextjs';

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);

  const { user } = useUser();

  if (!user) {
      return <RedirectToSignIn />;

  }


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="Heading max-w-4xl mx-auto mt-24 mb-5  shadow-lg rounded-lg">
      <motion.h2
        className="text-2xl semiHead font-semibold text-center mb-6 text-primary"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        Categories
      </motion.h2>
      {categories.length > 0 ? (
        <ul className="space-y-5 p-6 border border-primary rounded-md">
          {categories.map((cat) => (
            <motion.li
              key={cat._id}
              className="flex items-center justify-between border border-primary p-2 rounded"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className='text-neutral'>{cat.name}</span>
              <Link href={`/updateCategory/${cat._id}`} className="btn btn-primary text-white hover:btn-primary/80">
                Edit
                <Edit/>
              </Link>
            </motion.li>
          ))}
          <Link href="/addCategory" className="flex items-center justify-center my-4 text-center bg-primary hover:btn-primary/80 text-white py-3 rounded">
            Create New Category
          </Link>
        </ul>
      ) : (
        <p>No categories found.</p>
      )}
    </div>
  );
}