"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, Calendar, MapPin, Building, ChevronRight } from "lucide-react";

const HomePageExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch("/api/experiences");
        if (!response.ok) throw new Error("Failed to fetch experiences");
        const data = await response.json();
        setExperiences(data.experiences || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center bg-base-100">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || experiences.length === 0) {
    return null; // Don't show the section if it errors or is empty
  }

  return (
    <section id="experience" className="py-24 bg-base-200 relative overflow-hidden">
      {/* Background blobs for premium glassmorphism vibe */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Briefcase className="text-3xl text-primary animate-pulse" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Work Experience
            </h2>
          </div>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            My professional journey and the companies I've helped build amazing products with
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Timeline Path */}
        <div className="relative border-l-2 border-primary/20 md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:bottom-0 md:before:w-0.5 md:before:bg-primary/20 space-y-12">
          {experiences.map((exp, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={exp._id}
                className={`relative flex flex-col md:flex-row items-stretch ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline node circle */}
                <div className="absolute left-[-9px] md:left-1/2 md:-translate-x-1/2 top-4 w-4 h-4 bg-primary rounded-full border-4 border-base-100 shadow-md ring-4 ring-primary/10 z-20" />

                {/* Content Box */}
                <motion.div
                  className="w-full md:w-[calc(50%-2rem)] ml-6 md:ml-0"
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                >
                  <div className="bg-base-100 rounded-3xl p-6 md:p-8 shadow-xl border border-base-300 hover:shadow-2xl hover:border-primary/20 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
                    {/* Top border animation */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                    {/* Date/Timeframe badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 bg-primary/10 rounded-lg">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-primary">
                        {exp.from} — {exp.current ? "Present" : exp.to}
                      </span>
                      {exp.current && (
                        <span className="badge badge-success text-white badge-sm font-semibold animate-pulse ml-2">
                          Active
                        </span>
                      )}
                    </div>

                    {/* Job Title & Company */}
                    <h3 className="text-2xl font-bold text-base-content group-hover:text-primary transition-colors">
                      {exp.role}
                    </h3>

                    <div className="flex items-center gap-2 mt-2 text-base-content/75 font-semibold">
                      <Building className="w-4 h-4 text-secondary" />
                      <span>{exp.company}</span>
                    </div>

                    {/* Description content */}
                    {exp.description && (
                      <div
                        className="mt-6 prose prose-sm text-base-content/70 leading-relaxed border-t border-base-200 pt-4 flex-grow"
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                    )}
                  </div>
                </motion.div>

                {/* Empty column for alignment (only visible on desktop) */}
                <div className="hidden md:block w-[calc(50%-2rem)]" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomePageExperience;
