"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiCode,
  FiServer,
  FiLayout,
  FiStar,
  FiAward,
  FiGlobe,
  FiPlay,
} from "react-icons/fi";
import { RiReactjsLine, RiNextjsLine, RiNodejsLine } from "react-icons/ri";
import {
  SiMongodb,
  SiTailwindcss,
  SiTypescript,
  SiJavascript,
} from "react-icons/si";

export default function HomePage() {
  const [selectedHeader, setSelectedHeader] = useState(null);
  const [themeColor, setThemeColor] = useState("#418aff");
  const [typingText, setTypingText] = useState("Full-Stack Developer");
  const controls = useAnimation();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [cursorScale, setCursorScale] = useState(1);
  const typingRef = useRef(null);

  const smoothX = useSpring(mouseX, { stiffness: 500, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 500, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const hovered = e.target.closest("[data-cursor-hover]");

      setCursorScale(hovered ? 1.5 : 1);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const getPrimaryColor = () => {
      const root = getComputedStyle(document.documentElement);
      return root.getPropertyValue("--primary").trim() || "#418aff";
    };
    setThemeColor(getPrimaryColor());
    const observer = new MutationObserver(() =>
      setThemeColor(getPrimaryColor())
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const defaultHeader = {
    title: "Hello, I'm Abdelaziz Sleem",
    description:
      "👋 Hi, I'm Abdelaziz Sleem, a passionate Full-Stack Developer specializing in crafting modern, user-friendly web experiences. With expertise in frontend technologies like React, Next.js, Tailwind CSS, and TypeScript, I build responsive, high-performance interfaces that delight users. On the backend, I work with Node.js and MongoDB to create scalable, efficient systems that power seamless digital experiences.",
    imageUrl: "/imgs/my-img.jpg",
    githubLink: "https://github.com/AbdelazizSleem01",
    linkedInLink: "https://www.linkedin.com/in/abdelaziz-sleem-7ab4593b1/",
    mostaqlLink: "https://mostaql.com/u/Zezosleen/portfolio",
  };

  useEffect(() => {
    const savedHeader = localStorage.getItem("selectedHeader");
    if (savedHeader) {
      setSelectedHeader({ ...defaultHeader, ...JSON.parse(savedHeader) });
    } else {
      setSelectedHeader(defaultHeader);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && typingRef.current) {
      const Typed = require("typed.js");

      const options = {
        strings: [
          "Full-Stack Developer",
          "Frontend Developer",
          "Backend Developer",
        ],
        typeSpeed: 80,
        backSpeed: 50,
        backDelay: 1500,
        startDelay: 500,
        loop: true,
        showCursor: true,
        cursorChar: "|",
        smartBackspace: true,
      };

      const typed = new Typed(typingRef.current, options);

      return () => {
        typed.destroy();
      };
    }
  }, []);

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, rotate: -5 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { type: "spring", stiffness: 150, damping: 15 },
    },
  };

  const techIcons = [
    { icon: RiReactjsLine, name: "React", color: "#61DAFB" },
    { icon: RiNextjsLine, name: "Next.js", color: "#000000" },
    { icon: RiNodejsLine, name: "Node.js", color: "#339933" },
    { icon: SiMongodb, name: "MongoDB", color: "#47A248" },
    { icon: SiTailwindcss, name: "Tailwind", color: "#06B6D4" },
    { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
  ];

  return (
    <div className="w-full h-full bg-base-100 text-base-content overflow-hidden pt-20">
      <motion.div
        className="fixed w-10 h-10 bg-primary rounded-full pointer-events-none z-50 overflow-hidden"
        style={{
          x: useTransform(smoothX, (x) => x - 10),
          y: useTransform(smoothY, (y) => y - 50),
          scale: cursorScale,
          background: `radial-gradient(circle at center, ${themeColor} 0%, transparent 70%)`,
          filter: "blur(9px)",
        }}
        animate={{
          opacity: [0.4, 0.5, 0.5],
          scale: [cursorScale, cursorScale * 1.1, cursorScale],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="h-full w-full mx-auto relative top-12 pb-[165px] xl:px-16 px-8 flex md:flex-row flex-col gap-8 justify-center items-center pb-10 pt-4">
        {/* Left Section - Profile Image */}
        <motion.div
          className="w-full md:w-2/5 relative flex justify-center"
          variants={itemVariants}
          initial="hidden"
          animate={controls}
        >
          {selectedHeader?.imageUrl && (
            <div className="relative">
              <motion.div
                className="relative  z-10 rounded-full lg:max-w-[400px] max-w-[300px] mx-auto border-8 border-primary/20"
                animate={{
                  y: [0, -15, 0],
                  boxShadow: [
                    "0px 0px 30px 0px var(--primary)",
                    "0px 0px 50px 15px var(--primary)",
                    "0px 0px 30px 0px var(--primary)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  className="rounded-full w-full h-auto"
                  src={selectedHeader?.imageUrl}
                  alt={selectedHeader?.title}
                />
              </motion.div>

              {/* Floating Tech Icons Around Image */}
              {techIcons.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  className="absolute bg-base-100 p-3 rounded-full shadow-lg border"
                  style={{
                    top: `${(45 + 60 * Math.sin((index * Math.PI) / 3)).toFixed(3)}%`,
                    left: `${(43 + 60 * Math.cos((index * Math.PI) / 3)).toFixed(3)}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                >
                  <tech.icon
                    className="text-2xl"
                    style={{ color: tech.color }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right Section - Content */}
        <motion.div
          className="w-full md:w-3/5 flex flex-col justify-center gap-6 md:text-left text-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div
            className="flex items-center gap-3 mb-2 justify-center md:justify-start"
            variants={itemVariants}
          >
            <FiAward className="text-2xl text-primary" />
            <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              Available for Freelance
            </span>
          </motion.div>

          <motion.h1
            className="md:text-5xl sm:text-4xl text-3xl font-bold font-serif leading-tight"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            {selectedHeader?.title || "Hello, I'm Abdelaziz Sleem"}
          </motion.h1>

          <motion.h2
            className="text-xl text-secondary font-semibold flex items-center gap-2 justify-center md:justify-start"
            variants={itemVariants}
          >
            <FiCode className="text-primary" />
            I'm a{" "}
            <span
              ref={typingRef}
              className="text-primary font-bold min-h-[1.5em] inline-block"
            />
          </motion.h2>

          <motion.p
            className="text-neutral text-lg leading-relaxed"
            dangerouslySetInnerHTML={{
              __html:
                selectedHeader?.description ||
                "Experienced full-stack developer with 4+ years of expertise in Laravel, NestJS, Nuxt.js, Next.js, Android, and some Flutter experience. 🥰",
            }}
            variants={itemVariants}
          ></motion.p>

          {/* Tech Stack Overview */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center md:justify-start"
            variants={itemVariants}
          >
            {techIcons.map((tech, index) => (
              <motion.div
                key={tech.name}
                className="flex items-center gap-2 bg-base-200 px-3 py-2 rounded-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ delay: index * 0.1 }}
              >
                <tech.icon style={{ color: tech.color }} />
                <span className="text-sm font-medium">{tech.name}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 font-serif mt-4"
            variants={containerVariants}
          >
            {selectedHeader?.githubLink && (
              <Link
                title="Visit Abdelaziz Sleem's GitHub Profile"
                href={selectedHeader.githubLink}
                target="_blank"
                className="px-5 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex items-center justify-center gap-3 transition-all duration-300"
                data-cursor-hover
              >
                <FiGithub className="text-lg" />
                <span>GitHub</span>
              </Link>
            )}

            {selectedHeader?.linkedInLink && (
              <Link
                href={selectedHeader.linkedInLink}
                target="_blank"
                title="Visit Abdelaziz Sleem's LinkedIn Profile"
                className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-3 transition-all duration-300"
                data-cursor-hover
              >
                <FiLinkedin className="text-lg" />
                <span>LinkedIn</span>
              </Link>
            )}

           
            {selectedHeader?.mostaqlLink && (
              <Link
                href={selectedHeader.mostaqlLink}
                target="_blank"
                title="Visit Abdelaziz Sleem's Mostaql Portfolio"
                className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-3 transition-all duration-300"
                data-cursor-hover
              >
                <Image src="/imgs/mostaql.png" alt="Mostaql" width={18} height={18} />
                <span>Mostaql</span>
              </Link>
            )}

            <motion.a
              title="Download Abdelaziz Sleem's CV"
              href="/imgs/Abdelaziz Sleem CV.pdf"
              download="Abdelaziz Sleem CV.pdf"
              className="px-5 py-2 text-sm bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 flex items-center justify-center gap-3 transition-all duration-300"
              data-cursor-hover
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 8px 25px rgba(239, 68, 68, 0.3)",
              }}
            >
              <FiDownload className="text-lg" />
              <span>Download CV</span>
            </motion.a>

         
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6"
            variants={containerVariants}
          >
            <motion.div
              className="text-center p-4 bg-base-200 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-center gap-2">
                <FiGlobe className="text-primary text-xl" />
                <span className="text-2xl font-bold">3+</span>
              </div>
              <p className="text-sm text-neutral">Years Experience</p>
            </motion.div>

            <motion.div
              className="text-center p-4 bg-base-200 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-center gap-2">
                <FiLayout className="text-primary text-xl" />
                <span className="text-2xl font-bold">30+</span>
              </div>
              <p className="text-sm text-neutral">Projects Done</p>
            </motion.div>

            <motion.div
              className="text-center p-4 bg-base-200 rounded-lg col-span-2 md:col-span-1"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-center gap-2">
                <FiStar className="text-primary text-xl" />
                <span className="text-2xl font-bold">99%</span>
              </div>
              <p className="text-sm text-neutral">Client Satisfaction</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Animations */}
      <motion.div
        className="absolute w-4 h-4 bg-primary/20 rounded-full"
        style={{
          top: "20%",
          left: "10%",
        }}
        animate={{
          y: [0, -40, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-4 h-4 bg-primary/20 rounded-full"
        style={{
          top: "20%",
          left: "50%",
        }}
        animate={{
          y: [0, -40, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-8 h-4 bg-primary/20 rounded-full"
        style={{
          top: "80%",
          left: "10%",
        }}
        animate={{
          x: [0, -80, 0],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
