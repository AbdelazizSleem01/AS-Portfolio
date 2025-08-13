'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Download } from 'lucide-react';

export default function HomePage() {
  const [selectedHeader, setSelectedHeader] = useState(null);
  const [themeColor, setThemeColor] = useState("#418aff");
  const controls = useAnimation();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [cursorScale, setCursorScale] = useState(1);

  // Smooth spring values for cursor movement
  const smoothX = useSpring(mouseX, { stiffness: 500, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 500, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const hovered = e.target.closest('[data-cursor-hover]');

      setCursorScale(hovered ? 1.5 : 1);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const getPrimaryColor = () => {
      const root = getComputedStyle(document.documentElement);
      return root.getPropertyValue("--primary").trim() || "#418aff";
    };
    setThemeColor(getPrimaryColor());
    const observer = new MutationObserver(() => setThemeColor(getPrimaryColor()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const defaultHeader = {
    title: "Hello, My name is Abdelaziz Sleem",
    description: "👋 Hi, I’m Abdelaziz Sleem, a passionate Full-Stack Developer specializing in crafting modern, user-friendly web experiences. With expertise in frontend technologies like React, Next.js, Tailwind CSS, and TypeScript, I build responsive, high-performance interfaces that delight users. On the backend, I work with Node.js and MongoDB to create scalable, efficient systems that power seamless digital experiences. I also enhance UI/UX with libraries like DaisyUI and ShadCn UI, ensuring every project is both visually stunning and functionally robust. As a freelance developer, I’m committed to delivering high-quality solutions that solve real-world problems while continuously pushing the boundaries of what’s possible in web development. My goal is to become a leading influencer in the freelance market, sharing knowledge and empowering others through open-source contributions and mentorship. 🌍✨",
    imageUrl: "/imgs/my-img.jpeg",
    githubLink: "https://github.com/AbdelazizSleem01",
    linkedInLink: "https://www.linkedin.com/in/abdelaziz-sleem-600a1027a/"
  };


  useEffect(() => {

    const savedHeader = localStorage.getItem('selectedHeader');
    if (savedHeader) {
      setSelectedHeader(JSON.parse(savedHeader));
    } else {
      setSelectedHeader(defaultHeader);
    }

    if (typeof window !== 'undefined') {
      const Typed = require('typed.js');
      const typed = new Typed('.typing', {
        strings: ['FullStack Developer,', 'Frontend Developer,', 'Backend Developer,'],
        typeSpeed: 120,
        backSpeed: 60,
        loop: true,
      });
      return () => typed.destroy();
    }
  }, []);

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 1, y: 20, rotate: -5 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { type: 'spring', stiffness: 150, damping: 15 }
    }
  };

  return (
    <div className="w-full h-full bg-base-100 text-base-content overflow-hidden pt-20">
      {/* Animated Mouse Cursor */}
      <motion.div
        className="fixed w-10 h-10 bg-primary rounded-full pointer-events-none z-50"
        style={{
          x: useTransform(smoothX, x => x - 10),
          y: useTransform(smoothY, y => y - 50),
          scale: cursorScale,
          background: `radial-gradient(circle at center, ${themeColor} 0%, transparent 70%)`,
          filter: 'blur(9px)'
        }}
        animate={{
          opacity: [0.4, 0.5, 0.5],
          scale: [cursorScale, cursorScale * 1.1, cursorScale],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="h-full w-full mx-auto relative top-12 pb-[165px] xl:px-16 px-8 flex md:flex-row flex-col gap-8 justify-center items-center pb-10 pt-4">
        <motion.div
          className="w-full md:w-1/2 relative"
          variants={itemVariants}
          initial="hidden"
          animate={controls}
        >
          {selectedHeader?.imageUrl && (
            <motion.img
              className="relative z-10 rounded-full lg:max-w-[60%] max-w-[60%] mx-auto outline outline-[.7rem] outline-offset-[.1rem] outline-primary/60"
              src={selectedHeader?.imageUrl}
              alt={selectedHeader?.title}
              animate={{
                y: [0, -20, 0],
                boxShadow: [
                  '0px 0px 20px 0px var(--primary)',
                  '0px 0px 35px 10px var(--primary)',
                  '0px 0px 20px 0px var(--primary)',
                ],
                outlineColor: [`${themeColor}60`, `${themeColor}30`, `${themeColor}60`],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          )}
        </motion.div>

        {/* Text Content Section */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col justify-center gap-4 md:text-left text-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Animated Headers */}
          <motion.h1
            className="md:text-4xl sm:text-3xl text-2xl font-semibold font-serif"
            whilehover={{ scale: 1.02 }}
          >
            {selectedHeader?.title || "Hello, My name is Abdelaziz Sleem"}
          </motion.h1>

          <motion.h2
            className="capitalize text-secondary font-semibold"
            whilehover={{ x: 10 }}
          >
            I'm <span className="typing text-primary"></span>
          </motion.h2>

          <motion.p
            className="text-neutral text-justify"
            dangerouslySetInnerHTML={{
              __html: selectedHeader?.description ||
                "Experienced full-stack developer with 4+ years of expertise in Laravel, NestJS, Nuxt.js, Next.js, Android, and some Flutter experience.🥰.",
            }}
            variants={itemVariants}
            whilehover={{ scale: 1.01 }}
          ></motion.p>

          {/* Interactive Buttons */}
          <motion.div
            className=" flex flex-col md:flex-row gap-4 font-serif"
            variants={containerVariants}
          >
            {selectedHeader?.githubLink && (
              <Link
                title="Visit Abdelaziz Sleem's GitHub Profile"
                href={selectedHeader.githubLink}
                target="_blank"
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 flex items-center justify-center gap-2"
                role="button"
                component={motion.a}
                whilehover={{
                  scale: 1.05,
                  boxShadow: "0px 5px 15px rgba(0,0,0,0.3)"
                }}
                whiletap={{ scale: 0.95 }}
              >
                Github
                <motion.img
                  className="w-8 h-8"
                  src="/imgs/github.png"
                  alt=""
                  whilehover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  aria-hidden="true"
                />
              </Link>
            )}

            {selectedHeader?.linkedInLink && (
              <Link
                href={selectedHeader.linkedInLink}
                target="_blank"
                title="Visit Abdelaziz Sleem's LinkedIn Profile"
                passHref
                legacyBehavior
              >
                <motion.a
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/95 transition flex items-center justify-center gap-2"
                  whilehover={{
                    scale: 1.05,
                    boxShadow: "0px 5px 15px rgba(0,0,0,0.3)"
                  }}
                  whiletap={{ scale: 0.95 }}
                  role="button"
                >
                  LinkedIn
                  <motion.img
                    className="w-8 h-8"
                    src="/imgs/linkedin.png"
                    alt=""
                    whilehover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    aria-hidden="true"
                  />
                </motion.a>
              </Link>
            )}
            <motion.a
              title="Download Abdelaziz Sleem's CV"
              href="/imgs/Abdelaziz Sleem CV.pdf"
              download="Abdelaziz Sleem CV.pdf"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center justify-center gap-2"
              whilehover={{
                scale: 1.05,
                boxShadow: "0px 5px 15px rgba(0,0,0,0.3)"
              }}
              whiletap={{ scale: 0.95 }}
              aria-label="Download CV document"
            >
              Download CV
              <Download
                className="w-7 h-7 rounded-sm"
                aria-hidden="true"
              />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Background Elements */}
      <motion.div
        className="absolute w-4 h-4 bg-primary/20 rounded-full"
        style={{
          top: '20%',
          left: '10%'
        }}
        animate={{
          y: [0, -40, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      <motion.div
        className="absolute w-4 h-4 bg-primary/20 rounded-full"
        style={{
          top: '20%',
          left: '50%'
        }}
        animate={{
          y: [0, -40, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}

      />
      <motion.div
        className="absolute w-8 h-4 bg-primary/20 rounded-full"
        style={{
          top: '80%',
          left: '10%'
        }}
        animate={{
          x: [0, -80, 0],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

    </div>
  );
}
