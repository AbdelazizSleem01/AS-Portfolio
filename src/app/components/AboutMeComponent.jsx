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
  FiMail,
  FiGlobe,
  FiHeart
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
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 10 }
    },
  };

  const skillIconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 250, damping: 12 }
    },
  };

  const skills = [
    { icon: RiNextjsFill, name: "Next.js", color: "from-gray-800 to-gray-600" },
    { icon: RiReactjsFill, name: "React", color: "from-cyan-500 to-blue-500" },
    { icon: RiNodejsFill, name: "Node.js", color: "from-green-600 to-emerald-500" },
    { icon: SiTailwindcss, name: "Tailwind", color: "from-sky-500 to-blue-400" },
    { icon: SiMongodb, name: "MongoDB", color: "from-green-700 to-green-500" },
    { icon: SiTypescript, name: "TypeScript", color: "from-blue-600 to-blue-400" },
  ];

  const stats = [
    { number: "2.5+", label: "Years Experience", icon: FiAward },
    { number: "12+", label: "Projects Completed", icon: FiGlobe },
    { number: "99%", label: "Client Satisfaction", icon: FiHeart }
  ];

  return (
    <div id="about" className="w-full min-h-screen flex items-center justify-center py-20 bg-base-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-80 h-80 bg-primary/5 rounded-full -top-40 -left-40"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-secondary/5 rounded-full -bottom-40 -right-40"
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.3, 0.1, 0.3] }}
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
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center gap-4 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-2xl">
                <FiUser className="text-3xl text-base-100" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                About Me
              </h2>
            </motion.div>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-6">
              Passionate developer crafting digital experiences that make a difference
            </p>
            <div className="w-32 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
          </motion.div>

          <div className="w-full max-w-7xl mx-auto">
            <motion.div className="space-y-8" variants={containerVariants}>
              <motion.div
                className="bg-base-200 rounded-3xl p-8 shadow-2xl border border-base-300"
                variants={itemVariants}
              >
                <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
                  <motion.div
                    className="relative flex-shrink-0"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.img
                      className="w-48 h-48 lg:w-64 lg:h-64 object-cover rounded-full shadow-xl border-4 border-primary/20"
                      src="/imgs/my-img.jpg"
                      alt="Abdelaziz Sleem"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {skills.map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          className="absolute bg-base-100 p-1 rounded-xl shadow-lg border border-base-300"
                          style={{
                            top: `${(45 + 50 * Math.sin((index * Math.PI) / 3)).toFixed(3)}%`,
                            left: `${(45 + 50 * Math.cos((index * Math.PI) / 3)).toFixed(3)}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                          variants={skillIconVariants}
                          whileHover={{ scale: 1.4, rotate: 360 }}
                          animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: index * 0.2,
                          }}
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${skill.color}`}>
                            <skill.icon className="text-sm text-base-100" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <div className="flex-1 text-center lg:text-left space-y-4">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
                        <FiAward className="text-xl text-base-100" />
                      </div>
                      <h3 className="text-2xl font-bold text-base-content">Fullstack Developer</h3>
                    </div>

                    <p className="text-base leading-relaxed text-base-content/80">
                      Hi, I'm <span className="font-bold text-primary">Abdelaziz Sleem</span>, a passionate{" "}
                      <span className="font-bold text-primary">Fullstack Developer</span> with expertise in modern web technologies.
                      I specialize in creating responsive, performant applications that deliver exceptional user experiences.
                    </p>

                    <div className="grid gap-3 mt-5">
                      <div className="flex items-center gap-3 p-3 bg-base-100 rounded-xl">
                        <FiCode className="text-primary text-lg" />
                        <div>
                          <span className="font-semibold">Frontend:</span>
                          <span className="text-base-content/70 ml-2">React, Next.js, TypeScript, Tailwind CSS</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-base-100 rounded-xl">
                        <FiServer className="text-primary text-lg" />
                        <div>
                          <span className="font-semibold">Backend:</span>
                          <span className="text-base-content/70 ml-2">Node.js, MongoDB, REST APIs</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-base-100 rounded-xl">
                        <FiLayout className="text-primary text-lg" />
                        <div>
                          <span className="font-semibold">Tools:</span>
                          <span className="text-base-content/70 ml-2">DaisyUI, ShadCn, Git, Figma</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="bg-base-100 rounded-2xl p-4 text-center border border-base-300"
                      >
                        <div className="flex justify-center mb-2">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="text-primary text-lg" />
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
                        <div className="text-xs text-base-content/70 font-medium">{stat.label}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-6 border border-primary/20"
                variants={itemVariants}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <FiUser className="text-primary text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-base-content">My Vision</h3>
                </div>
                <p className="text-base-content/80 leading-relaxed">
                  I aspire to become a <span className="font-bold text-primary">leading influencer</span> in the tech industry,
                  delivering innovative solutions while mentoring the next generation of developers through open-source contributions
                  and knowledge sharing.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-center">
                <Link href="/ContactMe" title="Contact Me">
                  <motion.button
                    className="group relative bg-gradient-to-r from-primary to-secondary text-base-100 font-semibold text-lg px-8 py-4 rounded-2xl shadow-lg overflow-hidden"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(163, 29, 29, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="relative z-10 flex items-center gap-3">
                      <FiMail className="text-xl" />
                      <span>Let's Work Together</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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