"use client";
import React, { useState, useRef } from "react";
import { UploadCloud, File, AlertCircle } from "lucide-react";

const CustomFileUpload = ({
  id,
  accept = "image/*",
  multiple = false,
  onChange,
  required = false,
  maxSizeMB = 10,
  label = "Choose files",
  helperText = "Images up to 10MB",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const processFiles = (files) => {
    setError("");
    const validFiles = [];
    const names = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Size check
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File "${file.name}" exceeds the ${maxSizeMB}MB limit.`);
        return;
      }
      validFiles.push(file);
      names.push(file.name);
    }

    if (validFiles.length > 0) {
      setSelectedFileNames(names);
      
      // Simulate input event for parent onChange handler
      const dataTransfer = new DataTransfer();
      validFiles.forEach((file) => dataTransfer.items.add(file));
      
      if (inputRef.current) {
        inputRef.current.files = dataTransfer.files;
        // Trigger parent onChange
        onChange({ target: { files: dataTransfer.files } });
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`relative w-full rounded-2xl border-2 border-dashed py-8 px-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? "border-primary bg-primary/5 scale-[0.99] shadow-lg shadow-primary/5"
            : "border-base-300 hover:border-primary/50 hover:bg-base-content/5"
        }`}
      >
        {/* Hidden File Input */}
        <input
          ref={inputRef}
          type="file"
          id={id}
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          required={required && selectedFileNames.length === 0}
          className="hidden"
        />

        <div className="p-4 rounded-full bg-primary/10 text-primary mb-3 transition-transform duration-300 group-hover:scale-110">
          <UploadCloud className="w-8 h-8 animate-pulse" />
        </div>

        <p className="text-sm font-semibold text-base-content mb-1">
          {label}
        </p>
        <p className="text-xs text-base-content/50">
          Drag & drop files here, or <span className="text-primary font-bold underline">browse</span>
        </p>

        {helperText && (
          <p className="text-[11px] text-base-content/40 mt-2 font-medium">
            {helperText}
          </p>
        )}

        {/* Selected files feedback */}
        {selectedFileNames.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-lg">
            {selectedFileNames.map((name, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-success/10 text-success border border-success/20 font-medium"
              >
                <File className="w-3 h-3" />
                {name.length > 20 ? name.substring(0, 17) + "..." : name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Error alert */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-xs text-error font-medium pl-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default CustomFileUpload;
