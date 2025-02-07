"use client";
import { useEffect, useState } from "react";

export default function VisitCounter() {
  const [visits, setVisits] = useState(0);

  // useEffect(() => {
  //   fetch("/api/visit", { method: "POST" }); // Increment visits
  //   fetch("/api/visit")
  //     .then((res) => res.json())
  //     .then((data) => setVisits(data.count));
  // }, []);

  useEffect(() => {
    document.title = `All Visits | ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      `A personal and creative portfolio website showcasing my projects, skills, and experiences. Visit count: ${visits}`
    );
  }, []);


  useEffect(() => {
    let storedVisits = localStorage.getItem("visits");
    let updatedVisits = storedVisits ? Number(storedVisits) + 1 : 1;
    localStorage.setItem("visits", updatedVisits);
    setVisits(updatedVisits);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h2 className="text-3xl font-bold text-neutral" >
        Welcome to My Portfolio! 🚀
      </h2>
      <div className="mt-4 px-6 py-3 bg-gradient-to-r from-primary to-black text-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold">Total Visits: {visits}</h1>
      </div>
    </div>
  );
}
