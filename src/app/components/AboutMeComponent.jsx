"use client";
import React, { useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Link from "next/link";
import { 
  FiCode, 
  FiServer, 
  FiLayout, 
  FiDatabase, 
  FiUser,
  FiAward,
  FiMail
} from "react-icons/fi";
import { 
  RiNextjsFill,
  RiReactjsFill,
  RiNodejsFill
} from "react-icons/ri";
import { 
  SiTailwindcss,
  SiMongodb,
  SiTypescript,
  SiJavascript
} from "react-icons/si";

const AboutMeComponent = () => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    },
  };

  const skillIconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { type: "spring", stiffness: 200, damping: 15 }
    },
  };

  const floatingVariants = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const skills = [
    { icon: RiNextjsFill, name: "Next.js", color: "text-black dark:text-white" },
    { icon: RiReactjsFill, name: "React", color: "text-cyan-400" },
    { icon: RiNodejsFill, name: "Node.js", color: "text-green-500" },
    { icon: SiTailwindcss, name: "Tailwind", color: "text-blue-400" },
    { icon: SiMongodb, name: "MongoDB", color: "text-green-600" },
    { icon: SiTypescript, name: "TypeScript", color: "text-blue-600" },
  ];

  return (
    <div id="about" className="w-full min-h-screen flex items-center justify-center py-20 bg-base-100 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-72 h-72 bg-primary/5 rounded-full -top-36 -left-36"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-secondary/5 rounded-full -bottom-48 -right-48"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          className="flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Header */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <FiUser className="text-3xl text-primary" />
              <h2 className="text-4xl lg:text-5xl font-bold text-primary">
                About Me
              </h2>
            </motion.div>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full max-w-7xl mx-auto">
            {/* Left Side - Image with Floating Skills */}
            <motion.div className="relative flex justify-center" variants={itemVariants}>
              <div className="relative">
                <motion.div
                  className="relative z-1 rounded-full mt-2 border-8 border-primary/20 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.img
                    className="w-80 h-80 lg:w-96 lg:h-96 object-cover rounded-full"
                    src="/imgs/my-img.jpg"
                    alt="Abdelaziz Sleem"
                  />
                </motion.div>

                {/* Floating Skill Icons */}
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    className={`absolute bg-base-100 p-4 rounded-2xl shadow-lg border border-base-300 flex items-center justify-center ${skill.color}`}
                    style={{
                      top: `${45 + 55 * Math.sin((index * Math.PI) / 3)}%`,
                      left: `${40 + 55 * Math.cos((index * Math.PI) / 3)}%`,
                    }}
                    variants={skillIconVariants}
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 360,
                      transition: { duration: 0.5 }
                    }}
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  >
                    <skill.icon className="text-2xl lg:text-3xl" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Content */}
            <motion.div className="space-y-6" variants={containerVariants}>
              {/* Introduction Card */}
              <motion.div
                className="bg-base-200/50 backdrop-blur-sm rounded-3xl p-8 border border-base-300 shadow-xl"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiAward className="text-2xl text-primary" />
                  <h3 className="text-2xl font-bold text-base-content">
                    Fullstack Developer
                  </h3>
                </div>
                
                <div className="space-y-4 text-base leading-relaxed">
                  <p>
                    Hi, I'm <span className="font-bold text-primary">Abdelaziz Sleem</span>, a passionate{" "}
                    <span className="font-bold text-primary">Fullstack Developer</span> with a focus on{" "}
                    <span className="font-bold text-primary">Frontend Development</span>. I work as a{" "}
                    <span className="font-bold text-primary">Freelance Developer</span>, crafting responsive and user-friendly websites.
                  </p>

                  <div className="flex items-center gap-2 text-sm">
                    <FiCode className="text-primary" />
                    <span className="font-semibold">Frontend:</span>
                    <span>HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind CSS</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <FiServer className="text-primary" />
                    <span className="font-semibold">Backend:</span>
                    <span>Node.js, MongoDB, REST APIs</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <FiLayout className="text-primary" />
                    <span className="font-semibold">UI Libraries:</span>
                    <span>DaisyUI, ShadCn UI, Bootstrap</span>
                  </div>
                </div>
              </motion.div>

              {/* Goals Card */}
              <motion.div
                className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 border border-primary/20 shadow-xl"
                variants={itemVariants}
                whileHover={{ y: 1, transition: { type: "spring", stiffness: 300 } }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiUser className="text-2xl text-primary" />
                  <h3 className="text-2xl font-bold text-base-content">
                    My Vision
                  </h3>
                </div>
                
                <p className="text-base leading-relaxed mb-6">
                  As a freelancer, I've completed several projects, and I aspire to become a{" "}
                  <span className="font-bold text-primary">leading freelance influencer</span> in the tech industry, 
                  delivering high-quality solutions to clients worldwide while contributing to open-source and mentoring aspiring developers.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-base-100 rounded-2xl p-4 shadow-lg">
                    <div className="text-2xl font-bold text-primary">2+</div>
                    <div className="text-sm text-base-content/70">Years Exp</div>
                  </div>
                  <div className="bg-base-100 rounded-2xl p-4 shadow-lg">
                    <div className="text-2xl font-bold text-primary">30+</div>
                    <div className="text-sm text-base-content/70">Projects</div>
                  </div>
                  <div className="bg-base-100 rounded-2xl p-4 shadow-lg">
                    <div className="text-2xl font-bold text-primary">99%</div>
                    <div className="text-sm text-base-content/70">Satisfaction</div>
                  </div>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
                <Link href="/ContactMe" title="Contact Me">
                  <motion.button
                    className="group mt-8  relative bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg px-8 py-4 rounded-2xl shadow-lg overflow-hidden"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(66, 153, 225, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="relative z-10 flex items-center gap-3">
                      <FiMail className="text-xl" />
                      <span>Hire Me</span>
                    </div>
                    <div className="absolute inset-0  bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutMeComponent;