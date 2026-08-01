"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useClerk } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";
import {
  LayoutDashboard,
  Image,
  List,
  FilePlus,
  FolderPlus,
  Shapes,
  Database,
  PlusCircle,
  Settings,
  Award,
  MessageSquare,
  Users,
  Mail,
  FileText,
  BookOpen,
  BarChart3,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Shield,
  Home,
} from "lucide-react";

const sidebarGroups = [
  {
    label: "Overview",
    colorClass: "from-blue-500/20 to-cyan-500/20 text-blue-500",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    items: [
      { href: "/admin", text: "Admin Home", icon: Shield },
      { href: "/Dashboard", text: "Analytics", icon: LayoutDashboard },
    ],
  },
  {
    label: "Content",
    colorClass: "from-emerald-500/20 to-teal-500/20 text-emerald-500",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    items: [
      { href: "/addHeader", text: "Create Header", icon: Image },
      { href: "/allHeaders", text: "All Headers", icon: List },
      { href: "/addCategory", text: "Create Category", icon: Shapes },
      { href: "/allCategories", text: "All Categories", icon: Database },
    ],
  },
  {
    label: "Projects",
    colorClass: "from-purple-500/20 to-pink-500/20 text-purple-500",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    items: [
      { href: "/addProject", text: "Create Project", icon: FilePlus },
      { href: "/allProjects", text: "All Projects", icon: FolderPlus },
    ],
  },
  {
    label: "Experience",
    colorClass: "from-amber-500/20 to-orange-500/20 text-amber-500",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    items: [
      { href: "/addExperience", text: "Create Experience", icon: Briefcase },
      { href: "/allExperiences", text: "All Experiences", icon: List },
    ],
  },
  {
    label: "Skills",
    colorClass: "from-indigo-500/20 to-blue-500/20 text-indigo-500",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
    items: [
      { href: "/addSkill", text: "Create Skill", icon: PlusCircle },
      { href: "/allSkills", text: "All Skills", icon: Settings },
    ],
  },
  {
    label: "Achievements",
    colorClass: "from-yellow-500/20 to-amber-500/20 text-yellow-500",
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    items: [
      { href: "/addCertificate", text: "Create Certificate", icon: Award },
      { href: "/allCertificates", text: "All Certificates", icon: List },
    ],
  },
  {
    label: "Interactions",
    colorClass: "from-rose-500/20 to-pink-500/20 text-rose-500",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-500",
    items: [
      { href: "/allFeedbacks", text: "All Feedbacks", icon: MessageSquare },
      { href: "/Subscribe-Page", text: "Subscribers", icon: Users },
      { href: "/contacts", text: "Contacts", icon: Mail },
      {
        href: "/pending-questions",
        text: "Pending Questions",
        icon: MessageSquare,
      },
    ],
  },
  {
    label: "Blog",
    colorClass: "from-cyan-500/20 to-blue-500/20 text-cyan-500",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-500",
    items: [
      { href: "/blog/create-post-open", text: "Create Post", icon: FileText },
      { href: "/blog/admin-posts", text: "All Posts", icon: BookOpen },
    ],
  },
  {
    label: "Analytics",
    colorClass: "from-violet-500/20 to-purple-500/20 text-violet-500",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    items: [{ href: "/visits", text: "Visits Analytics", icon: BarChart3 }],
  },
];

const AdminLayout = ({ children, pageTitle }) => {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({});

  // Auto-open group that contains active link
  useEffect(() => {
    const activeGroupIndex = sidebarGroups.findIndex((group) =>
      group.items.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
    );
    if (activeGroupIndex !== -1) {
      setOpenGroups((prev) => ({
        ...prev,
        [sidebarGroups[activeGroupIndex].label]: true,
      }));
    }
  }, [pathname]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleGroup = (label) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const sidebarWidth = collapsed ? "w-[80px]" : "w-[280px]";

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-base-200/90 dark:bg-base-300/40 backdrop-blur-md overflow-x-hidden">
      {/* ─── Brand / Logo ─── */}
      <div className={`py-5 border-b border-base-content/10 shrink-0 transition-all ${
        collapsed && !isMobile ? "px-2 flex justify-center" : "px-5"
      }`}>
        <div className={`flex items-center ${collapsed && !isMobile ? "justify-center" : "gap-3"}`}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {(!collapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="overflow-hidden"
            >
              <h2 className="text-base font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight truncate">
                Admin Panel
              </h2>
              <p className="text-[10px] uppercase tracking-wider text-base-content/40 font-bold mt-0.5">
                Dashboard
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* ─── Navigation ─── */}
      <nav className={`flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-1 scrollbar-thin ${
        collapsed && !isMobile ? "px-2" : "px-3"
      }`}>
        {sidebarGroups.map((group, groupIdx) => {
          const isGroupOpen = openGroups[group.label] ?? false;
          const hasActiveChild = group.items.some((item) =>
            isActive(item.href)
          );

          return (
            <div key={group.label} className="mb-2">
              {/* Group header */}
              {(!collapsed || isMobile) ? (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors ${
                    hasActiveChild
                      ? "text-primary"
                      : "text-base-content/40 hover:text-base-content/60"
                  }`}
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      isGroupOpen ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </button>
              ) : (
                groupIdx > 0 && <div className="h-px bg-base-content/10 my-2 mx-2" />
              )}

              {/* Group items */}
              <AnimatePresence initial={false}>
                {(isGroupOpen || collapsed) && (
                  <motion.div
                    initial={collapsed ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={collapsed ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden space-y-1 mt-1"
                  >
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link key={item.href} href={item.href} scroll={false}>
                          <div
                            className={`group relative flex items-center transition-all duration-200 cursor-pointer ${
                              collapsed && !isMobile
                                ? "w-10 h-10 mx-auto justify-center rounded-xl"
                                : "px-3 py-2 gap-3 rounded-xl"
                            } ${
                              active
                                ? "bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-md shadow-primary/10"
                                : "text-base-content/70 hover:bg-base-content/5 hover:text-base-content"
                            }`}
                            title={collapsed && !isMobile ? item.text : undefined}
                          >
                            {/* Icon Wrapper badge */}
                            <div className={`shrink-0 transition-colors ${
                              collapsed && !isMobile
                                ? "p-0 bg-transparent"
                                : `p-1.5 rounded-lg ${active ? "bg-white/20" : "bg-primary/10"}`
                            }`}>
                              <Icon
                                className={`w-4.5 h-4.5 ${
                                  active
                                    ? "text-white"
                                    : collapsed && !isMobile
                                    ? "text-base-content/70 group-hover:text-primary transition-colors"
                                    : "text-primary"
                                }`}
                              />
                            </div>

                            {(!collapsed || isMobile) && (
                              <span className="text-sm truncate">
                                {item.text}
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* ─── Theme Toggle ─── */}
      <div className={`border-t border-base-content/10 py-3 shrink-0 flex items-center ${
        collapsed && !isMobile ? "justify-center px-2" : "justify-between px-4"
      }`}>
        {(!collapsed || isMobile) && (
          <span className="text-xs font-semibold uppercase tracking-wider text-base-content/40 pl-1">
            Theme Mode
          </span>
        )}
        <ThemeToggle compact={collapsed && !isMobile} />
      </div>

      {/* ─── Back to Site ─── */}
      <div className={`border-t border-base-content/10 py-2 shrink-0 ${
        collapsed && !isMobile ? "px-2" : "px-3"
      }`}>
        <Link href="/" scroll={false}>
          <div
            className={`flex items-center transition-colors cursor-pointer rounded-xl text-base-content/60 hover:bg-base-content/5 hover:text-base-content ${
              collapsed && !isMobile
                ? "w-10 h-10 mx-auto justify-center p-0"
                : "px-3 py-2.5 gap-3"
            }`}
            title={collapsed && !isMobile ? "Back to Site" : undefined}
          >
            <div className="p-1.5 rounded-lg bg-base-content/5">
              <Home className="w-4 h-4 shrink-0" />
            </div>
            {(!collapsed || isMobile) && (
              <span className="text-sm font-medium">Back to Site</span>
            )}
          </div>
        </Link>
      </div>

      {/* ─── User / Sign Out ─── */}
      <div className={`border-t border-base-content/10 py-3 shrink-0 ${
        collapsed && !isMobile ? "px-2" : "px-4"
      }`}>
        <div className={`flex items-center ${
          collapsed && !isMobile ? "justify-center" : "gap-3"
        }`}>
          {user?.imageUrl && (
            <div
              className="relative group cursor-pointer"
              title={collapsed && !isMobile ? `${user?.firstName || "Admin"} (Click to Sign Out)` : undefined}
              onClick={collapsed && !isMobile ? () => signOut() : undefined}
            >
              <img
                src={user.imageUrl}
                alt=""
                className="w-9 h-9 rounded-full border-2 border-primary/30 shrink-0 object-cover"
              />
              {collapsed && !isMobile && (
                <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <LogOut className="w-4 h-4" />
                </div>
              )}
            </div>
          )}
          {(!collapsed || isMobile) && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-base-content truncate">
                  {user?.firstName || "Admin"}
                </p>
                <p className="text-[10px] text-base-content/50 truncate">
                  {user?.primaryEmailAddress?.emailAddress || "admin"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => signOut()}
                className="p-2 rounded-xl hover:bg-error/10 text-base-content/40 hover:text-error transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-base-100 relative">
      {/* ─── Desktop Sidebar ─── */}
      <aside
        className={`hidden lg:flex flex-col ${sidebarWidth} border-r border-base-300/50 fixed top-0 left-0 h-screen z-40 transition-all duration-300`}
      >
        <SidebarContent />

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-base-200 border border-base-300 rounded-full flex items-center justify-center text-base-content/50 hover:text-primary hover:border-primary transition-colors shadow-sm z-50"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </aside>

      {/* ─── Mobile Drawer ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 h-screen w-[280px] z-50 lg:hidden shadow-2xl"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-base-300 text-base-content/60 hover:text-error transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Main Content ─── */}
      <main
        className={`flex-1 transition-all duration-300 ${collapsed ? "lg:ml-[80px]" : "lg:ml-[280px]"
          }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-base-100/90 backdrop-blur-md border-b border-base-300/50 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-base-200 text-base-content/70 hover:text-base-content transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Page title */}
            <div className="flex-1 min-w-0">
              {pageTitle && (
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-base-content via-base-content/85 to-base-content/70 bg-clip-text text-transparent truncate">
                  {pageTitle}
                </h1>
              )}
            </div>

            {/* Right side – user avatar on mobile */}
            <div className="lg:hidden shrink-0">
              {user?.imageUrl && (
                <img
                  src={user.imageUrl}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-primary/30"
                />
              )}
            </div>
          </div>
        </header>

        {/* Page content with top separation padding */}
        <div className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-73px)] relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
