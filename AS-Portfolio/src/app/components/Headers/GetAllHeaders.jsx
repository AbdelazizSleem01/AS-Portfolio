"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "../AdminStyle.css";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowBigLeft } from "lucide-react";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";

const GetAllHeader = () => {
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRouter();

  const { user } = useUser();

  if (!user) {
      return <RedirectToSignIn />;

  }

  useEffect(() => {
    document.title = `All Headers | ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        `All headers on ${process.env.NEXT_PUBLIC_META_TITLE}. Click on a header to view its details.`
      );
  }, []);

  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const response = await fetch(`/api/headers`);
        if (!response.ok) {
          throw new Error("Failed to fetch headers");
        }
        const data = await response.json();
        setHeaders(data.headers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHeaders();
  }, []);

  const handleSelectHeader = (header) => {
    localStorage.setItem('selectedHeader', JSON.stringify(header));
    toast.success(`${header.title} selected!`);
    route.push('/');
  };

  if (loading) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-screen gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-12 h-12 border-4 border-t-4 border-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <motion.span
          className="text-primary text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Loading...
        </motion.span>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-red-500 mt-10"
      >
        Error: {error}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-base-100 min-h-screen "
    >
      <div className="Heading w-full flex justify-center items-center mt-10 sm:mt-20">
        <h1 className="text-2xl semiHead w-2/3 sm:text-3xl lg:text-4xl font-bold text-center text-primary">
          Headers
        </h1>
      </div>

      <div className="space-y-6 p-4 sm:p-6">
        {headers.map((header, index) => (
          <motion.div
            key={header._id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: false }}
            className="hero bg-neutral w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto rounded-md"
          >
            <div className="hero-content flex-col lg:flex-row w-full p-4 sm:p-6 lg:p-10">
              {header.imageUrl && (
                <motion.img
                  src={header.imageUrl}
                  alt={header.title}
                  className="w-full sm:w-[50%] md:w-[40%] lg:w-[30%] rounded-lg shadow-2xl border"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: false }}
                />
              )}
              <div className="flex flex-col items-center lg:items-start lg:ml-8 mt-4 lg:mt-0">
                <motion.h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary text-center lg:text-left"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: false }}
                >
                  {header.title}
                </motion.h1>
                <motion.p
                  className="py-4 sm:py-6 text-base-100 text-center lg:text-left"
                  dangerouslySetInnerHTML={{
                    __html: header.description.split("<br>")[0],
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: false }}
                />
                <div className="flex flex-col sm:flex-row justify-between items-center w-full mt-4 space-y-4 sm:space-y-0 sm:space-x-4">
                  {header.linkedInLink && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: false }}
                    >
                      <Link
                        href={header.linkedInLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm text-white bg-primary px-4 py-1 rounded hover:bg-primary-600"
                      >
                        LinkedIn <img className="w-6 h-6" src="/imgs/linkedin.png" alt="linkedin-icon" />
                      </Link>
                    </motion.div>
                  )}
                  {header.githubLink && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: false }}
                    >
                      <Link
                        href={header.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm text-white bg-gray-800 px-4 py-1 rounded hover:bg-gray-900"
                      >
                        GitHub <img className="w-6 h-6" src="/imgs/github.png" alt="github-icon" />
                      </Link>
                    </motion.div>
                  )}
                  <motion.button
                    onClick={() => handleSelectHeader(header)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: false }}
                    className="flex items-center justify-center gap-2 text-sm text-white bg-green-500 px-5 py-2 rounded hover:bg-green-600"
                  >
                    Select <img className="w-5 h-5 rounded-sm" src="/imgs/select.gif" alt="select-icon" />
                  </motion.button>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: false }}
                  >
                    <Link href={`updateHeader/${header._id}`} className="flex items-center justify-center gap-2">
                      <button className="flex items-center justify-center gap-2 text-sm text-white bg-error w-full px-5 py-2 rounded hover:bg-opacity-95">
                        Edit <img className="w-5 h-5 rounded-sm bg-white" src="/imgs/setting.gif" alt="setting-icon" />
                      </button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="flex justify-center mt-8 sm:mt-10 pb-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: false }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/admin">
            <button className="btn btn-primary px-8 text-white rounded-full shadow-lg hover:shadow-xl transition-all gap-2">
              <ArrowBigLeft />
              Return to Admin Dashboard
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default GetAllHeader;