"use client";
import { useEffect } from "react";
import AboutMeComponent from "./components/AboutMeComponent";
import HomePageCertificates from "./components/Certificates/HomePageCertificate";
import FeedbackSection from "./components/Feedback/FeedbackSection";
import HomePage from "./components/HomePage";
import HomePageProjects from "./components/Projects/HomePageProjects";
import HomePageSkills from "./components/Skills/HomePageSkills";

export default function Home() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const userAgent = navigator.userAgent;
        const email = localStorage.getItem("userEmail") || "Unknown";

        // Get IP Address
        const ipRes = await fetch("https://api64.ipify.org?format=json");
        const { ip } = await ipRes.json();

        // Get Geolocation
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            await fetch("/api/visit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, userAgent, ip, latitude, longitude }),
            });
          },
          async () => {
            // If geolocation fails, send request without it
            await fetch("/api/visit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, userAgent, ip }),
            });
          }
        );
      } catch (error) {
        console.error("Error tracking visit:", error);
      }
    };

    trackVisit();
  }, []);

  return (
    <div>
      <HomePage />
      <AboutMeComponent />
      <HomePageProjects />
      <HomePageSkills />
      <HomePageCertificates />
      <FeedbackSection />
    </div>
  );
}
