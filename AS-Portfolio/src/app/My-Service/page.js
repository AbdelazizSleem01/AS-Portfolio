'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';


export default function ServicesPage() {


    useEffect(() => {
        document.title = `My Service | ${process.env.NEXT_PUBLIC_META_TITLE}`;
        document
            .querySelector('meta[name="description"]')
            ?.setAttribute(
                'content',
                `Discover my services at ${process.env.NEXT_PUBLIC_META_TITLE}`
            );
        // kaywords
        document.querySelector('meta[name="keywords"]')
            ?.setAttribute(
                'content',
                'web development, software development, graphic design, digital marketing, business development'
            );
    }, []);



    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    const hoverVariants = {
        hover: { scale: 1.05, boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)' }
    };

    return (
        <div className="min-h-screen bg-base-100 py-20 px-4 sm:px-8 lg:px-16 mt-8">
            {/* Header Section */}
            <motion.div
                className="text-center mb-16"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    className="text-5xl font-bold text-primary mb-4"
                    variants={itemVariants}
                >
                    My Services
                </motion.h1>
                <motion.p
                    className="text-lg text-neutral max-w-2xl mx-auto"
                    variants={itemVariants}
                >
                    Hi, I'm Abdelaziz Sleem, a passionate Fullstack Developer with a focus on Frontend Development. I specialize in crafting responsive, user-friendly websites and applications using modern technologies.
                </motion.p>
            </motion.div>

            {/* Services Grid */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Service Card 1: Frontend Development */}
                <motion.div
                    className="bg-base-100 p-8 rounded-lg shadow-lg border border-base-300 hover:border-primary transition-all"
                    variants={itemVariants}
                    whileHover="hover"
                >
                    <motion.p
                        className="text-4xl text-primary mb-4 hover:cursor-pointer"
                        whileHover={{ translateX: 10, transition: { duration: 0.5 } }}
                    >
                        💻
                    </motion.p>
                    <h2 className="text-2xl font-bold text-primary mb-4">Frontend Development</h2>
                    <p className="text-neutral mb-4">
                        I create stunning, responsive, and user-friendly interfaces using modern technologies like <strong>React</strong>, <strong>Next.js</strong>, <strong>Tailwind CSS</strong>, and <strong>Bootstrap</strong>.
                    </p>
                    <ul className="list-disc list-inside text-neutral">
                        <li>Responsive Design</li>
                        <li>UI/UX Optimization</li>
                        <li>Component Libraries Integration</li>
                    </ul>
                </motion.div>

                {/* Service Card 2: Backend Development */}
                <motion.div
                    className="bg-base-100 p-8 rounded-lg shadow-lg border border-base-300 hover:border-primary transition-all"
                    variants={itemVariants}
                    whileHover="hover"
                >
                    <motion.div
                        className="text-4xl text-primary mb-4 hover:cursor-pointer"
                        whileHover={{ translateX: 10, transition: { duration: 0.5 } }}
                    >
                        🛠️
                    </motion.div>
                    <h2 className="text-2xl font-bold text-primary mb-4">Backend Development</h2>
                    <p className="text-neutral mb-4">
                        I build robust and scalable backend systems using <strong>Node.js</strong> and <strong>MongoDB</strong>, ensuring seamless data management and API integrations.
                    </p>
                    <ul className="list-disc list-inside text-neutral">
                        <li>RESTful APIs</li>
                        <li>Database Design</li>
                        <li>Authentication & Security</li>
                    </ul>
                </motion.div>

                {/* Service Card 3: Fullstack Development */}
                <motion.div
                    className="bg-base-100 p-8 rounded-lg shadow-lg border border-base-300 hover:border-primary transition-all"
                    variants={itemVariants}
                    whileHover="hover"
                >
                    <motion.div
                        className="text-4xl text-primary mb-4 hover:cursor-pointer"
                        whileHover={{ translateX: 10, transition: { duration: 0.5 } }}
                    >
                        🌐
                    </motion.div>
                    <h2 className="text-2xl font-bold text-primary mb-4">Fullstack Development</h2>
                    <p className="text-neutral mb-4">
                        I deliver end-to-end solutions, combining frontend and backend expertise to build complete web applications tailored to your needs.
                    </p>
                    <ul className="list-disc list-inside text-neutral">
                        <li>End-to-End Solutions</li>
                        <li>Performance Optimization</li>
                        <li>Deployment & Maintenance</li>
                    </ul>
                </motion.div>

                {/* Service Card 4: UI/UX Design */}
                <motion.div
                    className="bg-base-100 p-8 rounded-lg shadow-lg border border-base-300 hover:border-primary transition-all"
                    variants={itemVariants}
                    whileHover="hover"
                >
                    <motion.div
                        className="text-4xl text-primary mb-4 hover:cursor-pointer"
                        whileHover={{ translateX: 10, transition: { duration: 0.5 } }}
                    >
                        🎨
                    </motion.div>
                    <h2 className="text-2xl font-bold text-primary mb-4">UI/UX Design</h2>
                    <p className="text-neutral mb-4">
                        I design intuitive and visually appealing interfaces using tools like <strong>Figma</strong> and integrate them seamlessly into your application.
                    </p>
                    <ul className="list-disc list-inside text-neutral">
                        <li>Wireframing & Prototyping</li>
                        <li>User-Centered Design</li>
                        <li>Interactive Components</li>
                    </ul>
                </motion.div>

                {/* Service Card 5: Freelance Consulting */}
                <motion.div
                    className="bg-base-100 p-8 rounded-lg shadow-lg border border-base-300 hover:border-primary transition-all"
                    variants={itemVariants}
                    whileHover="hover"
                >
                    <motion.div
                        className="text-4xl text-primary mb-4 hover:cursor-pointer"
                        whileHover={{ translateX: 10, transition: { duration: 0.5 } }}
                    >
                        📈
                    </motion.div>
                    <h2 className="text-2xl font-bold text-primary mb-4">Freelance Consulting</h2>
                    <p className="text-neutral mb-4">
                        I provide expert advice and guidance to help you achieve your goals, whether it's building a new project or improving an existing one.
                    </p>
                    <ul className="list-disc list-inside text-neutral">
                        <li>Project Planning</li>
                        <li>Technical Guidance</li>
                        <li>Freelance Strategies</li>
                    </ul>
                </motion.div>

                {/* Service Card 6: Custom Solutions */}
                <motion.div
                    className="bg-base-100 p-8 rounded-lg shadow-lg border border-base-300 hover:border-primary transition-all"
                    variants={itemVariants}
                    whileHover="hover"
                >
                    <motion.div
                        className="text-4xl text-primary mb-4 hover:cursor-pointer"
                        whileHover={{ translateX: 10, transition: { duration: 0.5 } }}
                    >
                        🔧
                    </motion.div>
                    <h2 className="text-2xl font-bold text-primary mb-4">Custom Solutions</h2>
                    <p className="text-neutral mb-4">
                        I create custom solutions tailored to your unique requirements, ensuring your project stands out in the market.
                    </p>
                    <ul className="list-disc list-inside text-neutral">
                        <li>Tailored Development</li>
                        <li>Innovative Features</li>
                        <li>Scalable Architecture</li>
                    </ul>
                </motion.div>
            </motion.div>
        </div>
    );
}