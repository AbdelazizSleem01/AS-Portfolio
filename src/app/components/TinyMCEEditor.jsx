"use client";

import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyMCEEditor({ value = "", onChange }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const getInitialTheme = () => {
      return document.documentElement.getAttribute("data-theme") || "light";
    };
    setTheme(getInitialTheme());

    // Observe theme changes to dynamically toggle TinyMCE dark skin
    const observer = new MutationObserver(() => {
      setTheme(getInitialTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      observer.disconnect();
      document.body.classList.remove("tox-fullscreen-active");
    };
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-80 flex items-center justify-center border border-dashed border-primary/30 rounded-md bg-neutral/5 animate-pulse">
        <span className="text-primary text-sm">Loading Editor...</span>
      </div>
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "no-api-key";

  return (
    <div className="w-full text-black relative">
      <Editor
        key={theme}
        apiKey={apiKey === "no-api-key" ? undefined : apiKey}
        value={value}
        onEditorChange={(content) => {
          if (onChange) {
            onChange(content);
          }
        }}
        init={{
          height: 450,
          menubar: true,
          setup: (editor) => {
            editor.on("FullscreenStateChanged", (e) => {
              if (e.state) {
                document.body.classList.add("tox-fullscreen-active");
              } else {
                document.body.classList.remove("tox-fullscreen-active");
              }
            });
          },
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "directionality",
            "wordcount",
            "help",
          ],
          toolbar:
            "undo redo | blocks | bold italic underline strikethrough | " +
            "forecolor backcolor | alignleft aligncenter alignright alignjustify | " +
            "ltr rtl | bullist numlist outdent indent | " +
            "link image table media | removeformat | code fullscreen preview | help",
          color_map: [
            "00000000", "Transparent (Clear)",
            "000000", "Black",
            "4B5563", "Dark Gray",
            "9CA3AF", "Gray",
            "E5E7EB", "Light Gray",
            "FFFFFF", "White",
            "EF4444", "Red",
            "F97316", "Orange",
            "F59E0B", "Amber",
            "FDE047", "Yellow",
            "84CC16", "Lime",
            "22C55E", "Green",
            "06B6D4", "Cyan",
            "3B82F6", "Blue",
            "6366F1", "Indigo",
            "8B5CF6", "Purple",
            "EC4899", "Pink"
          ],
          color_cols: 6,
          custom_colors: true,
          content_style:
            theme === "dark"
              ? "body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:16px; background-color: #1d232a; color: #a6adbb; direction: rtl; text-align: right; }"
              : "body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:16px; background-color: #ffffff; color: #1f2937; direction: rtl; text-align: right; }",
          skin: theme === "dark" ? "oxide-dark" : "oxide",
          content_css: theme === "dark" ? "dark" : "default",
          directionality: "rtl",
          branding: false,
          promotion: false,
        }}
      />
    </div>
  );
}
