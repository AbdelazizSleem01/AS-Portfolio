"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { MoveLeft, Briefcase } from "lucide-react";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import TinyMCEEditor from "../TinyMCEEditor";

export default function CreatedExperienceForm() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [current, setCurrent] = useState(false);
  const [order, setOrder] = useState(0);
  const [description, setDescription] = useState("<p>Write experience description</p>");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    document.title = `Add Work Experience | ${process.env.NEXT_PUBLIC_META_TITLE}`;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          role,
          from,
          to: current ? "Present" : to,
          current,
          description,
          order,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add experience");
      }

      toast.success("Work experience added successfully!");
      router.push("/allExperiences");
    } catch (error) {
      toast.error(error.message || "Failed to create experience!");
    } finally {
      setIsLoading(false);
    }
  };

  const fieldVariant = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  if (!user) {
    return <RedirectToSignIn />;
  }

  return (
    <motion.div
      className="min-h-screen bg-base-100 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-4xl mx-auto mt-24 my-5 p-6 border border-primary text-neutral shadow-sm shadow-primary rounded-lg"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.h2
          className="text-2xl font-semibold text-center mb-6 flex items-center justify-center gap-2"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Briefcase className="text-primary" /> Add Work Experience
        </motion.h2>

        <form onSubmit={handleSubmit}>
          {/* Company Name */}
          <motion.div className="mb-4" variants={fieldVariant}>
            <label htmlFor="company" className="block text-sm label font-medium">
              Company Name
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Google, Freelance, Acme Corp"
              required
              className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
            />
          </motion.div>

          {/* Job Role */}
          <motion.div className="mb-4" variants={fieldVariant}>
            <label htmlFor="role" className="block text-sm label font-medium">
              Role / Position
            </label>
            <input
              id="role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Senior Full-Stack Developer"
              required
              className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
            />
          </motion.div>

          {/* Timeframe Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <motion.div variants={fieldVariant}>
              <label htmlFor="from" className="block text-sm label font-medium">
                From Date
              </label>
              <input
                id="from"
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="e.g., Jan 2021 or 2021-01"
                required
                className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
              />
            </motion.div>

            <motion.div variants={fieldVariant}>
              <label htmlFor="to" className="block text-sm label font-medium">
                To Date
              </label>
              <input
                id="to"
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="e.g., Dec 2023 or Present"
                disabled={current}
                className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
              />
            </motion.div>
          </div>

          {/* Current Job Checkbox */}
          <motion.div className="mb-6 flex items-center gap-2" variants={fieldVariant}>
            <input
              id="current"
              type="checkbox"
              checked={current}
              onChange={(e) => {
                setCurrent(e.target.checked);
                if (e.target.checked) setTo("Present");
              }}
              className="checkbox checkbox-primary"
            />
            <label htmlFor="current" className="text-sm font-medium cursor-pointer">
              I currently work here
            </label>
          </motion.div>

          {/* Project Appearance Order */}
          <motion.div className="mb-4" variants={fieldVariant}>
            <label htmlFor="order" className="block text-sm label font-medium">
              Appearance Order (lower numbers appear first)
            </label>
            <input
              id="order"
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="e.g., 0, 1, 2"
              className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
            />
          </motion.div>

          {/* Job Description */}
          <motion.div className="mb-6" variants={fieldVariant}>
            <label htmlFor="description" className="block text-sm label font-medium">
              Description / Key Responsibilities
            </label>
            <TinyMCEEditor value={description} onChange={setDescription} />
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={fieldVariant}>
            <button
              type="submit"
              className="w-full py-3 bg-primary rounded-md text-white font-medium hover:bg-primary/80 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Add Experience"
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>

      {/* Back Button */}
      <motion.div
        className="w-full flex justify-center items-center my-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Link href="/admin">
          <button className="flex items-center gap-2 px-12 text-lg bg-primary p-4 w-full text-white font-medium rounded-full hover:bg-primary/80 max-w-xs">
            <MoveLeft /> Go to Panel
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
