"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Editor } from "@tinymce/tinymce-react";
import Link from "next/link";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";

export default function CreateHeaderForm() {
  const [title, setTitle] = useState("");
  const [linkedInLink, setLinkedInLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("<p>Write description</p>");

  const editorRef = useRef(null);
  const { user } = useUser();
  const router = useRouter();

  if (!user) {
    return <RedirectToSignIn />;
  }

  useEffect(() => {
    document.title = `Create Header | ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        `Create a professional header for your portfolio using ${process.env.NEXT_PUBLIC_META_TITLE}. Share your skills, experience, and achievements with potential employers and clients.`
      );
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", editorRef.current.getContent());
    formData.append("linkedInLink", linkedInLink);
    formData.append("githubLink", githubLink);
    formData.append("image", image);

    try {
      const response = await fetch(`/api/headers`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Header Created:", data);
        toast.success("Header created successfully!");
        router.push("/allHeaders");
      } else {
        console.error("Error creating header");
        toast.error("Failed to create header!");
      }
    } catch (error) {
      console.error("Error creating header:", error);
      toast.error("An unexpected error occurred!");
    } finally {
      setIsLoading(false);
    }
  };

  // Framer Motion variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const fieldVariant = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="min-h-screen bg-base-100 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="max-w-4xl mx-auto my-5 mt-24 p-6 border border-primary text-neutral shadow-lg rounded-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-2xl font-semibold text-center mb-6"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Create a New Header
        </motion.h2>

        {/* Header Title */}
        <motion.div className="mb-4" variants={fieldVariant}>
          <label htmlFor="title" className="block text-sm label font-medium">
            Header Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Header Title"
            required
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
          />
        </motion.div>

        {/* Header Description */}
        <motion.div
          className="mb-4"
          variants={fieldVariant}
          transition={{ delay: 0.1 }}
        >
          <label htmlFor="description" className="block text-sm label font-medium">
            Header Description
          </label>
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "no-api-key"}
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={description}
            init={{
              height: 400,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
                "emoticons",
                "textcolor",
              ],
              toolbar:
                "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | \
                forecolor backcolor | fontselect fontsizeselect | emoticons | help",
              content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              font_formats:
                "Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; Times New Roman=times new roman,times,serif",
              fontsize_formats: "8px 9px 10px 11px 12px 14px 16px 18px 20px 24px 28px 32px 36px 40px 44px",
            }}
          />
        </motion.div>

        {/* LinkedIn Link */}
        <motion.div
          className="mb-4"
          variants={fieldVariant}
          transition={{ delay: 0.2 }}
        >
          <label htmlFor="linkedInLink" className="block text-sm label font-medium">
            LinkedIn Link
          </label>
          <input
            id="linkedInLink"
            type="url"
            value={linkedInLink}
            onChange={(e) => setLinkedInLink(e.target.value)}
            placeholder="LinkedIn Link"
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
          />
        </motion.div>

        {/* GitHub Link */}
        <motion.div
          className="mb-4"
          variants={fieldVariant}
          transition={{ delay: 0.3 }}
        >
          <label htmlFor="githubLink" className="block text-sm label font-medium">
            GitHub Link
          </label>
          <input
            id="githubLink"
            type="url"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
            placeholder="GitHub Link"
            className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
          />
        </motion.div>

        {/* Image Upload */}
        <motion.div
          className="mb-4"
          variants={fieldVariant}
          transition={{ delay: 0.4 }}
        >
          <label htmlFor="image" className="block text-sm label font-medium">
            Upload Image
          </label>
          <input
            accept="image/*"
            id="image"
            type="file"
            onChange={handleImageChange}
            required
            className="w-full bg-neutral/10 mt-1 file-input file-input-primary rounded-md"
          />
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm">Selected Image Preview:</p>
              <img
                src={imagePreview}
                alt="Image preview"
                className="mt-2 max-w-[35%] mx-auto rounded-md border border-primary p-4"
              />
            </div>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          variants={fieldVariant}
          transition={{ delay: 0.5 }}
        >
          <button
            type="submit"
            className="w-full py-3 bg-primary rounded-md text-white font-medium hover:bg-primary/80 flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              "Create Header"
            )}
          </button>
        </motion.div>
      </motion.form>

      {/* Panel Link */}
      <motion.div
        className="w-full flex justify-center items-center my-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link href="/admin">
          <button className="text-lg bg-primary p-4 w-full text-white font-medium rounded-md hover:bg-primary/80">
            Go to Panel List
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
