"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";
import { motion } from "framer-motion";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import Swal from "sweetalert2";
import { Save, Trash2 } from "lucide-react";

export default function UpdateHeaderForm() {
  const [header, setHeader] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const editorRef = useRef(null);
  const { user } = useUser();

  useEffect(() => {
    document.title = `Update Header | ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        `Update your header details on ${process.env.NEXT_PUBLIC_META_TITLE}`
      );
    document
      .querySelector('meta[name="keywords"]')
      ?.setAttribute(
        "content",
        `update, header, ${process.env.NEXT_PUBLIC_META_TITLE}`
      );
  }, []);

  useEffect(() => {
    const fetchHeader = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/headers/${id}`);
        if (!response.ok) throw new Error("Failed to fetch header");
        const data = await response.json();
        setHeader({
          ...data,
          description: data.description || "<p>Write description</p>",
        });
        if (data.imageUrl) {
          setImagePreview(data.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching header:", error);
        toast.error("Error fetching header data");
      } finally {
        setLoading(false);
      }
    };

    fetchHeader();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this header?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append("Id", id);
      formData.append("title", header.title);
      formData.append("description", editorRef.current.getContent());
      formData.append("githubLink", header.githubLink);
      formData.append("linkedInLink", header.linkedInLink);
      if (image) formData.append("image", image);

      try {
        const response = await fetch(`/api/headers/${id}`, {
          method: "PUT",
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to update header");
        Swal.fire("Updated!", "Header updated successfully!", "success");
        router.push("/allHeaders");
      } catch (error) {
        console.error("Error updating header:", error);
        Swal.fire("Error!", "Failed to update header", "error");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        setIsDeleting(true);
        const response = await fetch(`/api/headers/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete header");
        Swal.fire("Deleted!", "Header deleted successfully!", "success");
        router.push("/allHeaders");
      } catch (error) {
        console.error("Error deleting header:", error);
        Swal.fire("Error!", "Failed to delete header", "error");
      } finally {
        setIsDeleting(false);
      }
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

  // Conditional rendering after all hooks
  if (!user) {
    return <RedirectToSignIn />;
  }

  if (loading) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-screen gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-12 h-12 border-4 border-t-4 border-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <motion.span className="text-primary text-lg">
          Loading Header...
        </motion.span>
      </motion.div>
    );
  }

  if (!header) {
    return <p className="text-center text-lg">Header not found.</p>;
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
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
        Update Header
      </motion.h2>

      <motion.div className="mb-4" variants={fieldVariant}>
        <label htmlFor="title" className="label block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={header.title}
          onChange={(e) => setHeader({ ...header, title: e.target.value })}
          className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
          required
        />
      </motion.div>

      <motion.div
        className="mb-4"
        variants={fieldVariant}
        transition={{ delay: 0.1 }}
      >
        <label
          htmlFor="description"
          className="label block text-sm font-medium"
        >
          Description
        </label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "no-api-key"}
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue={header.description}
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
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | \
                alignleft aligncenter alignright alignjustify | forecolor backcolor | \
                bullist numlist outdent indent | link image media table | emoticons charmap | removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            font_formats:
              "Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; Times New Roman=times new roman,times,serif",
            fontsize_formats:
              "8px 9px 10px 11px 12px 14px 16px 18px 20px 24px 28px 32px 36px 40px 44px",
          }}
        />
      </motion.div>

      <motion.div
        className="mb-4"
        variants={fieldVariant}
        transition={{ delay: 0.2 }}
      >
        <label htmlFor="githubLink" className="label block text-sm font-medium">
          GitHub Link
        </label>
        <input
          id="githubLink"
          type="url"
          value={header.githubLink}
          onChange={(e) => setHeader({ ...header, githubLink: e.target.value })}
          className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
          required
        />
      </motion.div>

      <motion.div
        className="mb-4"
        variants={fieldVariant}
        transition={{ delay: 0.3 }}
      >
        <label
          htmlFor="linkedInLink"
          className="label block text-sm font-medium"
        >
          LinkedIn Link
        </label>
        <input
          id="linkedInLink"
          type="url"
          value={header.linkedInLink}
          onChange={(e) =>
            setHeader({ ...header, linkedInLink: e.target.value })
          }
          className="w-full bg-neutral/10 p-3 mt-1 input input-bordered rounded-md"
          required
        />
      </motion.div>

      <motion.div
        className="mb-4"
        variants={fieldVariant}
        transition={{ delay: 0.4 }}
      >
        <label htmlFor="image" className="label block text-sm font-medium">
          Image
        </label>
        <input
          accept="image/*"
          id="image"
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(file ? URL.createObjectURL(file) : header.imageUrl);
          }}
          className="file-input file-input-primary w-full bg-neutral/10 mt-1 rounded-md"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Image preview"
            className="mt-4 max-w-[35%] mx-auto rounded-md border border-primary p-4"
          />
        )}
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 mt-6"
        variants={fieldVariant}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          type="submit"
          className="flex-1 py-3 bg-primary rounded-md text-white font-medium hover:bg-primary/95 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isUpdating || isDeleting}
        >
          {isUpdating ? (
            <>
              <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save size={18} />
              Update Header
            </>
          )}
        </motion.button>
        <motion.button
          type="button"
          onClick={handleDelete}
          className="flex-1 py-3 bg-error text-white rounded-md hover:bg-error/90 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isUpdating || isDeleting}
        >
          {isDeleting ? (
            <>
              <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 size={18} />
              Delete Header
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.form>
  );
}
