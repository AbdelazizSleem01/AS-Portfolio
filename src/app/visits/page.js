"use client";
import { useEffect, useState } from "react";

export default function VisitCounter() {
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    // Increment visits
    fetch("/api/visit", { method: "POST" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to record visit");
        }
        return response.json();
      })
      .then((data) => console.log(data.message))
      .catch((error) => console.error(error));

    // Fetch total visits
    fetch("/api/visit")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch visits");
        }
        return response.json();
      })
      .then((data) => setVisits(data.count))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    document.title = `All Visits | ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        `A personal and creative portfolio website showcasing my projects, skills, and experiences. Visit count: ${visits}`
      );
  }, [visits]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h2 className="text-3xl font-bold text-neutral">Welcome to My Portfolio! 🚀</h2>
      <div className="mt-4 px-6 py-3 bg-gradient-to-r from-primary to-black text-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold">Total Visits: {visits}</h1>
      </div>
    </div>
  );
}