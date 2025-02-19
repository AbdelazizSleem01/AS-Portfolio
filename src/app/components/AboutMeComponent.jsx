"use client";
import React, { useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Link from "next/link";

const AboutMeComponent = () => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const skillIconVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1 },
  };

  return (
    <div id="about" className="w-full lg:h-screen h-full m-auto flex items-center justify-center mt-4 py-12 bg-base-100">
      <div className="Heading w-full h-full flex flex-col justify-center items-center sm:px-4 px-2">
        <motion.h1
          className="text-3xl w-full text-center text-primary font-bold px-4 py-1 md:mt-0 mt-8"
          variants={itemVariants}
        >
          About Me
        </motion.h1>
        <motion.div
          className="lg:w-[90%] w-full mx-auto flex flex-col lg:gap-24 lg:flex-row items-center justify-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          onViewportEnter={() => controls.start("visible")}
          onViewportLeave={() => controls.start("hidden")}
          viewport={{ amount: 0.2 }}
        >
          <div className="relative ">
            {/* Side Img 1 - nextjs Skill */}
            <motion.img
              className="absolute bg-slate-100 outline outline-primary z-20 lg:left-[1.5rem] -top-3 left-[0.75rem] lg:w-[6rem] lg:h-[6rem] sm:w-[4.5rem] sm:h-[4.5rem] w-[2.25rem] h-[2.25rem] rounded-full"
              src="/imgs/icon-nextjs.png"
              alt="nextjs Skill"
              variants={skillIconVariants}
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            />

            {/* Side Img 2 - React Skill */}
            <motion.img
              className="absolute bg-slate-100 outline outline-primary z-20 lg:top-[9rem] sm:top-[8rem] top-[4rem] sm:-left-[2.25rem] -left-[1.5rem] lg:w-[6rem] lg:h-[6rem] sm:w-[4.5rem] sm:h-[4.5rem] w-[2.25rem] h-[2.25rem] rounded-full"
              src="/imgs/react.ico"
              alt="React Skill"
              variants={skillIconVariants}
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            />

            {/* Side Img 3 - Node.js Skill */}
            <motion.img
              className="absolute bg-slate-100 outline outline-primary z-20 lg:top-[17rem] sm:top-[15rem] top-[8rem] left-[1.5rem] lg:w-[6rem] lg:h-[6rem] sm:w-[4.5rem] sm:h-[4.5rem] w-[2.25rem] h-[2.25rem] rounded-full"
              src="/imgs/icons-node.png"
              alt="Node.js Skill"
              variants={skillIconVariants}
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            />

            {/* Main Img - Your Profile Picture */}
            <motion.img
              className="rounded-full relative object-cover right-0 lg:w-[22rem] lg:h-[22rem] sm:w-[18rem] sm:h-[18rem] w-[9rem] h-[9rem] outline sm:outline-offset-[.5em] outline-offset-[.25em] outline-primary"
              src="/imgs/my-img.jpeg"
              alt="Abdelaziz Sleem"
              variants={itemVariants}

            />
          </div>

          {/* About Me Content */}
          <motion.div
            className=" lg:w-[60%] p-3 w-full h-full shadow-xl shadow-primary/40 flex flex-col mt-9 justify-center items-center sm:px-4 px-2 rounded-xl bg-natural border border-primary"
            variants={containerVariants}
          >

            <motion.p
              className="md:text-[16px] sm:text-base text-sm mt-2 text-justify sm:px-2 text-natural"
              variants={itemVariants}
            >
              Hi, I'm <span className="font-bold text-primary">Abdelaziz Sleem</span>, a passionate{" "}
              <span className="font-bold text-primary">Fullstack Developer</span> with a focus on{" "}
              <span className="font-bold text-primary">Frontend Development</span>. I work as a{" "}
              <span className="font-bold text-primary">Freelance Developer</span>, crafting responsive and user-friendly
              websites. My expertise lies in building responsive websites using{" "}
              <span className="font-bold text-primary">HTML</span>,{" "}
              <span className="font-bold text-primary">CSS</span>, and{" "}
              <span className="font-bold text-primary">JavaScript</span>. I also work with modern libraries and
              frameworks like <span className="font-bold text-primary">Tailwind CSS</span>,{" "}
              <span className="font-bold text-primary">Bootstrap</span>,{" "}
              <span className="font-bold text-primary">React</span>, and{" "}
              <span className="font-bold text-primary">Next.js</span> for frontend development.
            </motion.p>

            <motion.p
              className="md:text-[16px] sm:text-base text-sm mt-2 text-justify sm:px-2 text-natural"
              variants={itemVariants}
            >
              On the backend, I use <span className="font-bold text-primary">Node.js</span> with{" "}
              <span className="font-bold text-primary">MongoDB</span> as my database of choice. I also integrate UI
              component libraries like <span className="font-bold text-primary">DaisyUI</span> and{" "}
              <span className="font-bold text-primary">ShadCn UI</span> to create stunning and functional interfaces.
            </motion.p>

            <motion.p
              className="md:text-[16px] sm:text-base text-sm mt-2 text-justify sm:px-2 text-natural"
              variants={itemVariants}
            >
              As a freelancer, I've completed several projects, and I aspire to become a{" "}
              <span className="font-bold text-primary">big freelance influencer</span> in the labor market, delivering
              high-quality solutions to clients worldwide.
            </motion.p>

            {/* Button */}
            <Link href={'/ContactMe'}>
              <motion.button
                className="lg:mt-4 lg:px-5 px-3 lg:py-3 py-2 bg-primary rounded-md lg:text-lg text-base text-white font-semibold"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Hire Me
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutMeComponent;