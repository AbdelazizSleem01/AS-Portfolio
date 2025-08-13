"use client";

import { useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, LockKeyhole, Database, Mail } from 'lucide-react';

// Create animated versions of the icons
const MotionShield = motion(ShieldCheck);
const MotionLock = motion(LockKeyhole);
const MotionData = motion(Database);
const MotionMail = motion(Mail);

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Define SectionHeading as a plain JS component with improved styling
function SectionHeading({ number, title }) {
  return (
    <div className="mb-4 border-b-2 pb-2 border-primary">
      <h2 className="text-3xl font-bold text-primary ">
        <span className="text-primary">{number}.</span> {title}
      </h2>
    </div>
  );
}

const PrivacyPolicy = () => {

  useEffect(() => {
    document.title = `Privacy Policy | ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        `A detailed privacy policy for Abdelaziz Sleem's portfolio website, covering all relevant data handling and protection measures.`
      );
    // kaywords
    document.querySelector('meta[name="keywords"]')
      ?.setAttribute(
        'content',
        'Abdelaziz Sleem, portfolio, privacy policy, data handling, protection measures'
      );
  }, []);

  // Refs for each section
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);
  const section5Ref = useRef(null);
  const section6Ref = useRef(null);
  const section7Ref = useRef(null);
  const section8Ref = useRef(null);
  const section9Ref = useRef(null);

  // Use the useInView hook to detect when sections are in view
  const section1InView = useInView(section1Ref, { once: false }); // Set `once: false` to trigger every time
  const section2InView = useInView(section2Ref, { once: false });
  const section3InView = useInView(section3Ref, { once: false });
  const section4InView = useInView(section4Ref, { once: false });
  const section5InView = useInView(section5Ref, { once: false });
  const section6InView = useInView(section6Ref, { once: false });
  const section7InView = useInView(section7Ref, { once: false });
  const section8InView = useInView(section8Ref, { once: false });
  const section9InView = useInView(section9Ref, { once: false });

  return (
    <>
      {/* Meta tags via Head (optional for additional meta information) */}
      <Head>
        <meta
          name="description"
          content="Privacy Policy for Abdelaziz Sleem's portfolio website."
        />
        <meta
          name="keywords"
          content="portfolio, web development, react, nextjs, abdelaziz sleem, privacy policy"
        />
      </Head>

      <div
        className="container mx-auto py-12 px-6 mt-20 min-h-screen "
      >
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {/* Title Section */}
          <motion.div
            variants={sectionVariants}
            className="mb-12 text-center"
          >
            <MotionShield
              className="w-24 h-24 text-primary mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
            <h1 className="text-5xl font-extrabold text-primary mb-4">
              Privacy Policy
            </h1>
            <motion.p
              className="text-lg text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Effective Date: {new Date().toLocaleDateString()}
            </motion.p>
          </motion.div>

          {/* 1. Introduction */}
          <motion.section
            ref={section1Ref}
            variants={sectionVariants}
            initial="hidden"
            animate={section1InView ? "visible" : "hidden"}
            className="mb-10"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <MotionLock
                className="md:w-1/3 text-primary"
                whileHover={{ rotate: -5 }}
                size={120}
              />
              <div className="md:w-2/3 text-primary">
                <SectionHeading number="1" title="Introduction" />
                <p className="text-neutral text-base leading-relaxed">
                  Welcome to Abdelaziz Sleem&apos;s portfolio website. Your privacy is important to me. This Privacy Policy explains how I collect, use, and protect your information when you visit my website.
                </p>
              </div>
            </div>
          </motion.section>

          {/* 2. Information I Collect */}
          <motion.section
            ref={section2Ref}
            variants={sectionVariants}
            initial="hidden"
            animate={section2InView ? "visible" : "hidden"}
            className="mb-10"
          >
            <SectionHeading number="2" title="Information I Collect" />
            <p className="mb-4 text-neutral">
              I may collect and process the following types of information:
            </p>
            <div className="ml-6 space-y-2 text-neutral">
              <p>
                <strong>Personal Information:</strong> If you contact me through a form, I may collect your name, email address, and any message you send.
              </p>
              <p>
                <strong>Usage Data:</strong> I may collect non-personal data, such as IP address, browser type, and pages visited, to improve the website experience.
              </p>
            </div>
          </motion.section>

          {/* 3. How I Use Your Information */}
          <motion.section
            ref={section3Ref}
            variants={sectionVariants}
            initial="hidden"
            animate={section3InView ? "visible" : "hidden"}
            className="mb-10"
          >
            <SectionHeading number="3" title="How I Use Your Information" />
            <p className="mb-4 text-neutral">
              I use the collected information to:
            </p>
            <ul className="list-disc ml-8 space-y-1 text-neutral">
              <li>Respond to inquiries and communications.</li>
              <li>Improve website performance and user experience.</li>
              <li>Analyze website traffic and usage trends.</li>
            </ul>
          </motion.section>

          {/* 4. Cookies and Tracking Technologies */}
          <motion.section
            ref={section4Ref}
            variants={sectionVariants}
            initial="hidden"
            animate={section4InView ? "visible" : "hidden"}
            className="mb-10"
          >
            <SectionHeading number="4" title="Cookies and Tracking Technologies" />
            <p className="text-neutral">
              This website may use cookies to enhance functionality and track analytics. You can disable cookies through your browser settings if preferred.
            </p>
          </motion.section>

          {/* 5. Third-Party Services */}
          <motion.section
            ref={section5Ref}
            variants={sectionVariants}
            initial="hidden"
            animate={section5InView ? "visible" : "hidden"}
            className="mb-10"
          >
            <SectionHeading number="5" title="Third-Party Services" />
            <p className="text-neutral">
              I may use third-party services (e.g., analytics, hosting) that collect and process data independently. These services have their own privacy policies.
            </p>
          </motion.section>

          {/* 6. Data Protection */}
          <motion.section
            ref={section6Ref}
            variants={sectionVariants}
            initial="hidden"
            animate={section6InView ? "visible" : "hidden"}
            className="mb-10"
          >
            <SectionHeading number="6" title="Data Protection" />
            <p className="text-neutral">
              I take reasonable measures to secure your information. However, no data transmission over the internet is completely secure.
            </p>
          </motion.section>

          {/* 7. Your Rights */}
          <motion.section
            ref={section7Ref}
            variants={sectionVariants}
            initial="hidden"
            animate={section7InView ? "visible" : "hidden"}
            className="mb-10"
          >
            <SectionHeading number="7" title="Your Rights" />
            <p className="mb-4 text-neutral">
              You have the right to:
            </p>
            <ul className="list-disc ml-8 space-y-1 text-neutral">
              <li>Request access to the personal information I hold about you.</li>
              <li>Request corrections or deletion of your data.</li>
              <li>Opt out of cookies and tracking.</li>
            </ul>
          </motion.section>

          {/* 8. Changes to This Privacy Policy */}
          <motion.section
            ref={section8Ref}
            variants={sectionVariants}
            initial="hidden"
            animate={section8InView ? "visible" : "hidden"}
            className="mb-10"
          >
            <SectionHeading number="8" title="Changes to This Privacy Policy" />
            <p className="text-neutral">
              I may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.
            </p>
          </motion.section>

          {/* 9. Contact Information */}
          <motion.section
            ref={section9Ref}
            variants={sectionVariants}
            initial="hidden"
            animate={section9InView ? "visible" : "hidden"}
            className="mb-10"
          >
            <SectionHeading number="9" title="Contact Information" />
            <motion.div
              className="mt-6 p-6 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <a
                href="mailto:abdelazizsleem957@gmail.com"
                className="text-xl font-semibold text-primary flex items-center gap-3"
              >
                <MotionMail
                  className="text-primary"
                  animate={{ x: [-5, 5, -5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                abdelazizsleem957@gmail.com
              </a>
            </motion.div>
          </motion.section>
        </motion.div>
      </div>
    </>
  );
};

export default PrivacyPolicy;