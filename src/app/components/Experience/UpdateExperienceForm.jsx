"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import { Trash2, Save, MoveLeft, Briefcase } from "lucide-react";
import TinyMCEEditor from "../TinyMCEEditor";
import Swal from "sweetalert2";
import Link from "next/link";

export default function UpdateExperienceForm() {
  const { id } = useParams();
  const { user } = useUser();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [experienceData, setExperienceData] = useState({
    company: "",
    role: "",
    from: "",
    to: "",
    current: false,
    description: "",
    order: 0,
  });

  useEffect(() => {
    document.title = `Update Experience | ${process.env.NEXT_PUBLIC_META_TITLE}`;

    const fetchExperience = async () => {
      try {
        const response = await fetch(`/api/experiences/${id}`);
        if (!response.ok) throw new Error("Failed to load experience");
        const data = await response.json();
        setExperienceData({
          company: data.company || "",
          role: data.role || "",
          from: data.from || "",
          to: data.to || "",
          current: !!data.current,
          description: data.description || "",
          order: data.order || 0,
        });
      } catch (error) {
        toast.error("Failed to load experience data");
      }
    };

    fetchExperience();
  }, [id]);

  const handleInputChange = useCallback((field, value) => {
    setExperienceData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this work experience?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsSubmitting(true);

      try {
        const response = await fetch(`/api/experiences/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(experienceData),
        });

        if (!response.ok) throw new Error("Update failed");
        Swal.fire("Updated!", "Your experience has been updated.", "success");
        router.refresh();
        router.push("/allExperiences");
      } catch (error) {
        Swal.fire("Error!", error.message || "Update failed", "error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure to delete this experience?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        setIsSubmitting(true);
        const response = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Deletion failed");
        Swal.fire("Deleted!", "Your experience has been deleted.", "success");
        router.push("/allExperiences");
      } catch (error) {
        Swal.fire("Error!", error.message || "Deletion failed", "error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const fieldVariant = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  if (!user) return <RedirectToSignIn />;
  if (!experienceData.company) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="w-12 h-12 border-4 border-t-4 border-primary rounded-full animate-spin" />
        <span className="text-primary text-lg">Loading Experience...</span>
      </div>
    );
  }

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
          className="text-2xl font-semibold text-center mb-6 text-primary border-b-2 border-primary pb-2 w-[40%] mx-auto flex items-center justify-center gap-2"
          variants={fieldVariant}
        >
          <Briefcase /> Update Experience
        </motion.h2>

        {/* Company Name */}
        <div className="mb-4">
          <label className="block text-sm label font-medium mb-2">Company Name</label>
          <input
            value={experienceData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
            required
          />
        </div>

        {/* Job Role */}
        <div className="mb-4">
          <label className="block text-sm label font-medium mb-2">Role / Position</label>
          <input
            value={experienceData.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
            required
          />
        </div>

        {/* Timeframe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm label font-medium mb-2">From Date</label>
            <input
              value={experienceData.from}
              onChange={(e) => handleInputChange("from", e.target.value)}
              className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm label font-medium mb-2">To Date</label>
            <input
              value={experienceData.to}
              onChange={(e) => handleInputChange("to", e.target.value)}
              disabled={experienceData.current}
              className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
            />
          </div>
        </div>

        {/* Current Job Checkbox */}
        <div className="mb-6 flex items-center gap-2">
          <input
            id="current-edit"
            type="checkbox"
            checked={experienceData.current}
            onChange={(e) => {
              handleInputChange("current", e.target.checked);
              if (e.target.checked) handleInputChange("to", "Present");
            }}
            className="checkbox checkbox-primary"
          />
          <label htmlFor="current-edit" className="text-sm font-medium cursor-pointer">
            I currently work here
          </label>
        </div>

        {/* Appearance Order */}
        <div className="mb-4">
          <label className="block text-sm label font-medium mb-2">Appearance Order</label>
          <input
            type="number"
            value={experienceData.order}
            onChange={(e) => handleInputChange("order", e.target.value)}
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
            placeholder="Lower numbers appear first"
          />
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <label className="block text-sm label font-medium mb-2">Description</label>
          <TinyMCEEditor
            value={experienceData.description}
            onChange={(value) => handleInputChange("description", value)}
          />
        </div>

        {/* Actions Grid */}
        <motion.div className="flex justify-between mt-6" variants={fieldVariant}>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-error text-white rounded-md hover:bg-error/95 w-full mr-2 flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 size={18} />
                Delete Experience
              </>
            )}
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md w-full ml-2 hover:bg-primary/95 flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} />
                Update Experience
              </>
            )}
          </button>
        </motion.div>
      </motion.form>

      {/* Back Button */}
      <motion.div
        className="w-full flex justify-center items-center mt-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Link href="/admin">
          <button className="flex items-center gap-2 px-12 text-lg bg-primary p-4 w-full text-white font-medium rounded-full hover:bg-primary/80 max-w-xs">
            <MoveLeft /> Go to Panel List
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
