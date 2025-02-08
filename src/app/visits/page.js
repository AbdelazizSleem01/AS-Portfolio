"use client";
import { useEffect, useState } from 'react';

export default function VisitCounter() {
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    fetch('/api/visit')
      .then((response) => response.json())
      .then((data) => setVisitCount(data.count))
      .catch((error) => console.error('Error tracking visit:', error));
  }, []);

  useEffect(() => {
    document.title = `All Visits | ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        `A personal and creative portfolio website showcasing my projects, skills, and experiences. Visit count: ${visitCount}`
      );
    
    document.querySelector('meta[name="keywords"]')?.setAttribute(
      'content',
      'portfolio, developer, web developer, software engineer, junior developer, full stack developer'
    );
  }, [visitCount]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h2 className="text-3xl font-bold text-neutral">Welcome to My Portfolio! 🚀</h2>
      <div className="mt-4 px-6 py-3 bg-gradient-to-r from-primary to-black text-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold">Total Visits: {visitCount}</h1>
      </div>
    </div>
  );
}
