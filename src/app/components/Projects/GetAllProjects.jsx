"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  GripVertical,
  Save,
  Trash2,
  Edit3,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Layers,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  FolderGit2,
  Eye,
  RefreshCw,
  Clock,
  ArrowUpDown
} from "lucide-react";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import ProjectImageCarousel from "./ProjectImageCarousel";
import ProjectDetailsModal from "./ProjectDetailsModal";

export default function GetProjects() {
  const { user } = useUser();
  const [projects, setProjects] = useState([]);
  const [originalProjects, setOriginalProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const hasChanges = useMemo(() => {
    return (
      JSON.stringify(projects.map((p) => p._id)) !==
      JSON.stringify(originalProjects.map((p) => p._id))
    );
  }, [projects, originalProjects]);

  useEffect(() => {
    document.title = `Project Management | ${process.env.NEXT_PUBLIC_META_TITLE || "Admin"}`;
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects`);
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data.projects || []);
      setOriginalProjects(data.projects || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Extract unique categories from projects list
  const categoriesList = useMemo(() => {
    const map = new Map();
    projects.forEach((p) => {
      if (p.category && typeof p.category === "object" && p.category._id) {
        map.set(p.category._id, p.category.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === "all" ||
        (p.category && typeof p.category === "object" && p.category._id === selectedCategory) ||
        p.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [projects, searchTerm, selectedCategory]);

  const handleReorder = (newOrder) => {
    // If filtering is active, update position in main array
    if (searchTerm || selectedCategory !== "all") {
      const newMap = new Map(newOrder.map((item, idx) => [item._id, idx]));
      const updatedAll = [...projects].sort((a, b) => {
        const indexA = newMap.has(a._id) ? newMap.get(a._id) : 999;
        const indexB = newMap.has(b._id) ? newMap.get(b._id) : 999;
        return indexA - indexB;
      });
      setProjects(updatedAll);
    } else {
      setProjects(newOrder);
    }
  };

  const saveOrder = async () => {
    try {
      setIsSaving(true);
      // Map new numeric order
      const updatedOrderProjects = projects.map((p, idx) => ({
        ...p,
        order: idx,
      }));

      const response = await fetch("/api/projects/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: updatedOrderProjects }),
      });

      if (!response.ok) throw new Error("Failed to save order");

      toast.success("Project display order updated!");
      setProjects(updatedOrderProjects);
      setOriginalProjects(updatedOrderProjects);
    } catch (err) {
      toast.error(err.message || "Failed to update order");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDetails = (project) => {
    setCurrentProject(project);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setCurrentProject(null);
  };

  if (!user) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* ─── Header Section ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-secondary/10 p-6 sm:p-8 border border-primary/20 shadow-xl backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Portfolio Manager</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
              Projects Showcase
            </h1>
            <p className="text-base-content/70 text-sm sm:text-base max-w-xl">
              Drag and reorder projects to customize how they appear on your public website.
            </p>
          </div>

          {/* Quick Stats & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <AnimatePresence>
              {hasChanges && (
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={saveOrder}
                  disabled={isSaving}
                  className="btn btn-success text-white shadow-lg shadow-success/20 gap-2 rounded-2xl px-5"
                >
                  {isSaving ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save New Order
                </motion.button>
              )}
            </AnimatePresence>

            <Link href="/addProject">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-primary text-white shadow-lg shadow-primary/20 gap-2 rounded-2xl px-5"
              >
                <Plus className="w-4 h-4" />
                Add New Project
              </motion.button>
            </Link>

            <Link href="/admin">
              <button className="btn btn-outline rounded-2xl gap-2 hover:bg-base-content/10">
                <ArrowLeft className="w-4 h-4" />
                Panel
              </button>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ─── Metric Counter Badges ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-base-200/50 backdrop-blur-md p-4 rounded-2xl border border-base-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-base-content">{projects.length}</p>
            <p className="text-xs text-base-content/60 font-medium">Total Projects</p>
          </div>
        </div>

        <div className="bg-base-200/50 backdrop-blur-md p-4 rounded-2xl border border-base-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-base-content">{categoriesList.length}</p>
            <p className="text-xs text-base-content/60 font-medium">Active Categories</p>
          </div>
        </div>

        <div className="bg-base-200/50 backdrop-blur-md p-4 rounded-2xl border border-base-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <ArrowUpDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-base-content uppercase tracking-wider">
              {hasChanges ? "Unsaved" : "Synced"}
            </p>
            <p className="text-xs text-base-content/60 font-medium">
              {hasChanges ? "Pending Save" : "Order Set"}
            </p>
          </div>
        </div>

        <div className="bg-base-200/50 backdrop-blur-md p-4 rounded-2xl border border-base-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-info/10 text-info flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-base-content uppercase tracking-wider">Drag & Drop</p>
            <p className="text-xs text-base-content/60 font-medium">Reorder Anytime</p>
          </div>
        </div>
      </div>

      {/* ─── Search & Filter Controls ─── */}
      <div className="bg-base-200/40 backdrop-blur-md p-4 rounded-2xl border border-base-300 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            placeholder="Search project title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-base-100 pl-10 pr-4 py-2.5 rounded-xl border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        {/* Category filter & Refresh */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 bg-base-100 px-3 py-1.5 rounded-xl border border-base-300 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-base-content/50" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-sm focus:outline-none cursor-pointer pr-4"
            >
              <option value="all">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchProjects}
            className="p-2.5 rounded-xl bg-base-100 border border-base-300 text-base-content/70 hover:text-primary transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ─── Projects List / Table ─── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-base-200/50 animate-pulse rounded-2xl border border-base-300"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-error/10 rounded-3xl border border-error/20 max-w-md mx-auto">
          <p className="text-error font-bold mb-2">Error Loading Projects</p>
          <p className="text-sm text-base-content/70 mb-4">{error}</p>
          <button onClick={fetchProjects} className="btn btn-error btn-sm text-white">
            Try Again
          </button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-base-200/30 rounded-3xl border border-dashed border-base-300">
          <FolderGit2 className="w-12 h-12 text-base-content/30 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-base-content/70 mb-1">No Projects Found</h3>
          <p className="text-sm text-base-content/50 mb-6">
            {searchTerm || selectedCategory !== "all"
              ? "Try adjusting your search or category filter."
              : "You haven't created any projects yet."}
          </p>
          <Link href="/addProject">
            <button className="btn btn-primary text-white rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> Create First Project
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-base-200/40 backdrop-blur-md rounded-3xl border border-base-300 p-4 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between px-2 pb-4 mb-2 border-b border-base-300 text-xs font-bold uppercase tracking-wider text-base-content/50">
            <span>Reorder & Info</span>
            <span>Actions</span>
          </div>

          <Reorder.Group
            axis="y"
            values={filteredProjects}
            onReorder={handleReorder}
            className="space-y-3"
          >
            {filteredProjects.map((project, index) => {
              const catName =
                project.category && typeof project.category === "object"
                  ? project.category.name
                  : "";

              return (
                <Reorder.Item
                  key={project._id}
                  value={project}
                  className="group bg-base-100 rounded-2xl border border-base-300/80 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all cursor-grab active:cursor-grabbing overflow-hidden"
                >
                  <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Drag grip + Image Preview + Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Drag Handle */}
                      <div className="p-2 rounded-lg bg-base-200 text-base-content/40 group-hover:text-primary transition-colors shrink-0">
                        <GripVertical className="w-5 h-5" />
                      </div>

                      {/* Cover Thumbnail */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-base-200 border border-base-300 shrink-0">
                        {project.imageUrl ? (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-base-content/40">
                            No Img
                          </div>
                        )}
                        {project.images && project.images.length > 1 && (
                          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                            +{project.images.length - 1}
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-base text-base-content group-hover:text-primary transition-colors truncate">
                            {project.title}
                          </h3>
                          {catName && (
                            <span className="bg-primary/10 text-primary border border-primary/20 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                              {catName}
                            </span>
                          )}
                          <span className="bg-base-200 text-base-content/60 text-[11px] font-medium px-2 py-0.5 rounded-md">
                            #Order: {project.order ?? index}
                          </span>
                        </div>
                        <div
                          className="text-xs text-base-content/60 line-clamp-1"
                          dangerouslySetInnerHTML={{
                            __html: project.description?.replace(/<[^>]*>?/gm, "") || "",
                          }}
                        />
                      </div>
                    </div>

                    {/* Right: Quick Links & Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleDetails(project)}
                        className="btn btn-sm btn-ghost text-info hover:bg-info/10 rounded-xl"
                        title="Quick View Details"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden md:inline text-xs">Preview</span>
                      </button>

                      <Link href={`/updateProject/${project._id}`}>
                        <button
                          className="btn btn-sm btn-ghost text-primary hover:bg-primary/10 rounded-xl"
                          title="Edit Project"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span className="hidden md:inline text-xs">Edit</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </div>
      )}

      {/* ─── Project Details Modal ─── */}
      <ProjectDetailsModal
        project={currentProject}
        isOpen={showDetails && !!currentProject}
        onClose={closeDetails}
      />
    </div>
  );
}
