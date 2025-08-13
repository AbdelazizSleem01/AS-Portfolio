'use client';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (!mounted) return null;

  return (
    <label className="flex items-center cursor-pointer gap-2 lg:pl-24" aria-label="Toggle dark mode">
      <input
        type="checkbox"
        checked={theme === 'dark'}
        onChange={toggleTheme}
        className="sr-only"
        aria-labelledby="theme-toggle-label"
      />
      <span id="theme-toggle-label" className="sr-only">
        Dark Mode
      </span>
      <div
        className={`w-16 h-8 flex items-center rounded-full p-1 transition-colors duration-1000 mx-3 ${
          theme === 'dark' ? 'bg-primary' : 'bg-primary'
        }`}
      >
        <motion.div
          className="w-7 h-7 bg-neutral rounded-full shadow-lg flex items-center justify-center"
          initial={false}
          animate={{ x: theme === 'dark' ? 30 : 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 50 }}
        >
          {theme === 'dark' ? (
            <MoonIcon className="h-4 w-4 text-black" aria-hidden="true" />
          ) : (
            <SunIcon className="h-4 w-4 text-white" aria-hidden="true" />
          )}
        </motion.div>
      </div>
    </label>
  );
}