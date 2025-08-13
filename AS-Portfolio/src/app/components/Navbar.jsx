"use client";
import { CodeXmlIcon, Lock, Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useTheme } from 'next-themes';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
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
    tap: { scale: 0.95 }
  };

  const underlineVariants = {
    hidden: { scaleX: 0 },
    hover: { scaleX: 1 }
  };

  const mobileMenuVariants = {
    open: { opacity: 1, maxHeight: "1000px" },
    closed: { opacity: 0, maxHeight: 0 }
  };

  const mobileLinkVariants = {
    open: { y: 0, opacity: 1 },
    closed: { y: 20, opacity: 0 },
    // duration
    transition: { duration: .5 }

  };

  const navLinks = [
    { href: '/about-page', text: 'About Me', title: "About Abdelaziz Sleem" },
    { href: '/projects-page', text: 'Projects', title: "View Abdelaziz Sleem's Projects" },
    { href: '/ContactMe', text: 'Contact', title: "Contact Abdelaziz Sleem" },
    { href: '/privacy-policy', text: 'Privacy Policy', title: "Privacy Policy of Abdelaziz Sleem" },
    { href: '/blog', text: 'Blog', title: "Read Abdelaziz Sleem's Blog" },
    { href: '/My-Service', text: 'My Service', title: "View Abdelaziz Sleem's Services" }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-base-100 shadow-lg px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-4">
        <Link href={'/'} title="My Logo" className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-primary">
          {theme === 'dark' ? (
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
          <span className="hidden sm:inline">Abdelaziz Sleem</span>
        </Link>
        <CodeXmlIcon className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
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

      {/* Desktop Navigation */}
      <div className="hidden lg:flex gap-2 items-center xl:gap-6">
        {navLinks.map((link) => (
          <motion.div
            key={link.href}
            className="relative"
            onHoverStart={() => setActiveLink(link.href)}
            onHoverEnd={() => setActiveLink('')}
          >
            <Link
              title={link.title}
              href={link.href}
              className="relative px-1 mx-1 py-1 text-sm xl:text-[16px] font-semibold text-primary hover:bg-primary/20 rounded-md transition"
            >
              <motion.span
                variants={linkVariants}
                animate={activeLink === link.href ? "hover" : ""}
                className="relative z-10 hover:scale-105"
              >
                {link.text}
              </motion.span>
              <motion.div
                variants={underlineVariants}
                className="absolute bottom-0 left-0 w-full h-[2px] bg-primary origin-left"
              />
            </Link>
          </motion.div>
        ))}

        <ThemeToggle />

        <motion.div
          className="tooltip tooltip-bottom tooltip-primary hidden md:block"
          data-tip="For admins only"
          whileHover={{ scale: 1.05 }}
        >
          <Link href={'/admin'} title="For Admin Only">
            <motion.button
              className="btn bg-primary hover:bg-primary/80 text-white flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-md text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Admin <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      {/* Mobile Navigation */}
      <motion.div
        className="lg:hidden absolute top-full left-0 w-full bg-base-100 overflow-hidden text-center shadow-lg"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: {
            opacity: 1,
            maxHeight: "1000px",
          },
          closed: {
            opacity: 0,
            maxHeight: 0,
            transition: { staggerChildren: 0.4 },
          },
        }}
        style={{ maxHeight: "1000px" }}
      >
        <div className="p-4 space-y-3 sm:space-y-4">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              variants={{
                open: { y: 0, opacity: 1, transition: { delay: index * 0.1, duration: 0.4 } },
                closed: { y: 20, opacity: 0 },
              }}
            >
              <Link
                href={link.href}
                className="block px-4 py-2 text-base sm:text-[17px] font-medium text-primary hover:bg-primary/20 rounded-lg transition-colors border-b-2 border-primary/50"
                onClick={() => setIsOpen(false)}
              >
                {link.text}
              </Link>
            </motion.div>
          ))}

          {/* Theme Toggle with animation */}
          <motion.div variants={{ open: { opacity: 1, transition: { delay: 0.5 } }, closed: { opacity: 0 } }} className="flex justify-center pt-4">
            <ThemeToggle />
          </motion.div>

          {/* Admin Panel Button with animation */}
          <motion.div variants={{ open: { opacity: 1, transition: { delay: 0.6 } }, closed: { opacity: 0 } }} className="pt-2">
            <Link href={'/admin'} title="For Admin Only" onClick={() => setIsOpen(false)} >
              <button title="For Admin Only" className="w-full btn bg-primary hover:bg-primary/80 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm sm:text-base">
                Admin Panel <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

    </nav>
  );
}

export default Navbar;
