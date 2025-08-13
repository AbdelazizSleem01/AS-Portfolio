"use client"
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin, CodeXmlIcon } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };
    const handleSubscribe = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address');
            return;
        }
        if (isLoading) return;

        setIsLoading(true);

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    toast.error('This email is already subscribed.');
                } else {
                    toast.error(data.error || 'Subscription failed');
                }
            } else {
                toast.success('Verification email sent! Please check your inbox to confirm.');
                setEmail('');
            }
        } catch (error) {
            toast.error('Subscription failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const socialLinks = [
        { name: 'github', url: 'https://github.com/AbdelazizSleem01', icon: '/imgs/github-f.png', title: "Visit Abdelaziz Sleem's GitHub Profile" },
        { name: 'linkedin', url: 'https://www.linkedin.com/in/abdelaziz-sleem-600a1027a/', icon: '/imgs/linkedIn-f.png', title: "Visit Abdelaziz Sleem's LinkedIn Profile" },
        { name: 'facebook', url: 'https://www.facebook.com/profile.php?id=100028557526450', icon: '/imgs/facebook-f.png', title: "Visit Abdelaziz Sleem's Facebook Profile" }
    ];

    return (
        <motion.div
            id='footer'
            style={{ opacity, y }}
            className="mt-8 bg-primary pt-9"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20%" }}
            variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 50 }
            }}
            transition={{ duration: 0.6, type: 'spring' }}
        >
            <div className="mx-auto w-full max-w-[1166px] px-4 xl:px-0">
                {/* Main Content Sections */}
                <div className="flex flex-col gap-8 justify-between sm:px-[18px] md:flex-row md:px-10">

                    {/* Brand Section */}
                    <motion.div
                        variants={itemVariants}
                        className="md:w-[316px]"
                        whileHover={{ y: -5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <motion.h1
                            whileHover={{ scale: 1.02 }}
                            className="text-white font-extrabold"
                        >
                            <div className="flex items-center gap-4">
                                <Link href={'/'} title="My LOGO" className="flex items-center gap-2 text-xl font-semibold text-base-100 bg-neutral rounded-lg px-2 hover:bg-neutral/90 transition-all">
                                    <motion.img
                                        src="/imgs/Logo.png"
                                        alt="logo"
                                        className="w-12 h-12 object-contain"
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 4 }}
                                    />
                                    Abdelaziz Sleem
                                    <CodeXmlIcon className="text-base-100" />
                                </Link>
                            </div>
                        </motion.h1>
                        <motion.p
                            className="mt-[18px] text-[15px] font-normal text-white/[80%]"
                            variants={itemVariants}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            Full Stack Developer specializing in modern web development. Let's build something amazing together!
                        </motion.p>
                        <motion.div
                            className="mt-[18px] flex gap-4"
                            variants={itemVariants}
                        >
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    title={social.title}
                                    whileHover={{ y: -5, scale: 1.1, rotate: [0, 15, -15, 0] }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="bg-white p-1 rounded-lg hover:shadow-lg transition-all"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={social.url}
                                >
                                    <Image
                                        src={social.icon}
                                        alt={`${social.name} icon`}
                                        width={36}
                                        height={36}
                                        className="object-contain"
                                    />
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Contact Section */}
                    <motion.div
                        variants={itemVariants}
                        className="md:w-[300px]"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring' }}
                    >
                        {[
                            { icon: <Phone />, text: '+20 01119268163', subtitle: 'Support Number', href: 'tel:+20 01119268163', title: 'Contact Me' },
                            { icon: <Mail />, text: 'abdelazizsleem957@gmail.com', subtitle: 'Support Email', href: 'mailto:abdelazizsleem957@gmail.com', title: 'Contact Me Via Email' },
                            { icon: <MapPin />, text: 'Benha, Qalubia, Egypt', subtitle: 'Address', href: '#', title: 'My Location' }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="mt-[23px] flex items-center"
                                variants={itemVariants}
                                whileHover={{ x: 10 }}
                            >
                                <motion.div
                                    className="flex h-[38px] w-[38px] items-center justify-center rounded-[75%] bg-white/10"
                                    whileHover={{ rotate: 360 }}
                                >
                                    {item.icon}
                                </motion.div>
                                <div className="ml-4">
                                    <a href={item.href} title={item.title} className="block font-Inter text-[14px] font-medium text-white hover:text-white/80 transition-colors">
                                        {item.text}
                                    </a>
                                    <p className="font-Inter text-[12px] font-medium text-white/60">{item.subtitle}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Pages Section */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-6 md:mt-0 md:max-w-[250px]"
                        whileHover={{ scale: 1.02 }}
                    >
                        <motion.p
                            className="text-white font-inter text-[18px] font-medium leading-normal mb-4"
                            variants={itemVariants}
                        >
                            Quick Links
                        </motion.p>
                        <ul className="space-y-3">
                            {[
                                ['Home', '/', 'Home page'],
                                ['Projects', '/projects-page', 'My Projects page'],
                                ['Blog', '/blog', 'Posts '],
                                ['Contact', '/ContactMe', 'Contact Me'],
                                ['Services', '/My-Service', 'My Services '],
                            ].map(([title, url, titleDes], index) => (
                                <motion.li
                                    key={title}
                                    variants={itemVariants}
                                    whileHover={{ x: 10 }}
                                    transition={{ type: 'spring' }}
                                    custom={index}
                                >
                                    <Link
                                        href={url}
                                        title={titleDes}
                                        className="text-white hover:text-white/80 font-inter text-[15px] font-normal hover:font-semibold block transition-all"
                                    >
                                        {title}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Subscribe Section */}
                <motion.div
                    className="mt-12 w-full"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="max-w-2xl mx-auto px-4">
                        <motion.div
                            className="text-center mb-6"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-white text-xl font-semibold mb-2">
                                Stay Updated with My Work
                            </h3>
                            <p className="text-white/80 text-sm">
                                Subscribe to get notifications about new projects and articles
                            </p>
                        </motion.div>
                        <motion.form
                            onSubmit={handleSubscribe}
                            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center"
                        >
                            <motion.input
                                type="email"
                                placeholder="Enter your email"
                                aria-label="Enter your email for subscription"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full md:w-64 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.button
                                type="submit"
                                className="w-full md:w-auto px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Subscribe to updates"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <span>Subscribing</span>
                                        <svg
                                            className="animate-spin h-5 w-5 text-primary"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                    </div>
                                ) : (
                                    'Subscribe Now'
                                )}
                            </motion.button>
                        </motion.form>
                    </div>
                </motion.div>

                {/* Divider */}
                <motion.hr
                    className="mt-12 border-white/20"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                />

                {/* Copyright */}
                <motion.div
                    className="flex items-center justify-center pb-8 pt-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <p className="text-xs font-normal text-white/80 text-center">
                        © {new Date().getFullYear()} Abdelaziz Sleem. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Footer;