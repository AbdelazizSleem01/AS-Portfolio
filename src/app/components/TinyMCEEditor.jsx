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

    return () => observer.disconnect();
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
    <div className="w-full text-black">
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
