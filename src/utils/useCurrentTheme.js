"use client";
import { useState, useEffect } from "react";

export function useCurrentTheme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const getTheme = () => {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr) return attr;
      const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
      if (saved) return saved;
      return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    };

    setTheme(getTheme());

    const observer = new MutationObserver(() => {
      setTheme(getTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const handleCustomEvent = () => setTheme(getTheme());
    window.addEventListener("themeChange", handleCustomEvent);

    return () => {
      observer.disconnect();
      window.removeEventListener("themeChange", handleCustomEvent);
    };
  }, []);

  return theme;
}
