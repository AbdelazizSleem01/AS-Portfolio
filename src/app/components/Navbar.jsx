"use client";
import { CodeXmlIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "next-themes";
import {
  FiBook,
  FiBriefcase,
  FiFolder,
  FiMail,
  FiShield,
  FiUser,
} from "react-icons/fi";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const linkVariants = {
    hover: { transition: { duration: 0.8 } },
    tap: { scale: 0.95 },
  };

  const underlineVariants = {
    hidden: { scaleX: 0 },
    hover: { scaleX: 1 },
  };

  const navLinks = [
    // {
    //   href: "/about-page",
    //   icon: <FiUser className="w-4 h-4" />,
    //   text: "About Me",
    //   title: "About Abdelaziz Sleem",
    // },
    {
      href: "/projects-page",
      icon: <FiFolder className="w-4 h-4" />,
      text: "Projects",
      title: "View Abdelaziz Sleem's Projects",
    },
    {
      href: "/ContactMe",
      icon: <FiMail className="w-4 h-4" />,
      text: "Contact",
      title: "Contact Abdelaziz Sleem",
    },
    {
      href: "/privacy-policy",
      icon: <FiShield className="w-4 h-4" />,
      text: "Privacy Policy",
      title: "Privacy Policy of Abdelaziz Sleem",
    },
    {
      href: "/blog",
      icon: <FiBook className="w-4 h-4" />,
      text: "Blog",
      title: "Read Abdelaziz Sleem's Blog",
    },
    {
      href: "/My-Service",
      icon: <FiBriefcase className="w-4 h-4" />,
      text: "My Service",
      title: "View Abdelaziz Sleem's Services",
    },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-base-100 shadow-lg px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <Link
          href="/"
          title="My Logo"
          className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-primary"
        >
          {theme === "dark" ? (
            <motion.img
              src="/imgs/Logo.png"
              alt="Dark Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <motion.img
              src="/imgs/light_Logo.png"
              alt="Light Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            />
          )}
          <span className="hidden sm:inline whitespace-nowrap">Abdelaziz Sleem</span>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <motion.button
        className="lg:hidden text-primary"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <span className="sr-only">
          {isOpen ? "Close navigation menu" : "Open navigation menu"}
        </span>
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Desktop Navigation Links (Centered) */}
      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 xl:gap-2">
        {navLinks.map((link) => (
          <motion.div
            key={link.href}
            className="relative group"
            onHoverStart={() => setActiveLink(link.href)}
            onHoverEnd={() => setActiveLink("")}
          >
            <Link
              href={link.href}
              title={link.title}
              className={`
                flex items-center gap-1.5 px-2 xl:px-3 py-2
                text-sm xl:text-base font-medium text-primary 
                hover:bg-primary/10 rounded-md transition-colors whitespace-nowrap
              `}
            >
              {link.icon}
              <span className="relative">
                {link.text}
                <motion.span
                  variants={underlineVariants}
                  initial="hidden"
                  whileHover="hover"
                  className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary origin-left"
                />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Right side: ThemeToggle */}
      <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
        <ThemeToggle />
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className="lg:hidden absolute top-full left-0 w-full bg-base-100 overflow-hidden shadow-lg"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, maxHeight: "1000px" },
          closed: { opacity: 0, maxHeight: 0 },
        }}
      >
        <div className="p-5 space-y-4">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              variants={{
                open: { y: 0, opacity: 1, transition: { delay: index * 0.08, duration: 0.4 } },
                closed: { y: 20, opacity: 0 },
              }}
            >
              <Link
                href={link.href}
                className="block px-5 py-3 text-base sm:text-lg font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors border-b border-primary/30 last:border-none"
                onClick={() => setIsOpen(false)}
              >
                {link.text}
              </Link>
            </motion.div>
          ))}

          <motion.div
            variants={{
              open: { opacity: 1, transition: { delay: 0.5 } },
              closed: { opacity: 0 },
            }}
            className="flex justify-center pt-5"
          >
            <ThemeToggle />
          </motion.div>
        </div>
      </motion.div>
    </nav>
  );
}

export default Navbar;