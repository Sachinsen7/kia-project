"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

type DashboardProps = {
  onClose?: () => void;
};

type Category = "Best Practices" | "Greeting Videos";

export default function Dashboard({}: DashboardProps) {
  const [contentViews, setContentViews] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  useEffect(() => {
    try {
      const v = Number(localStorage.getItem("dashboard_visitors") || "0") + 1;
      localStorage.setItem("dashboard_visitors", String(v));

      const c = Number(localStorage.getItem("dashboard_content_views") || "0");
      setContentViews(c);
    } catch {}
  }, []);

  const incrementContentViews = () => {
    try {
      const next = contentViews + 1;
      setContentViews(next);
      localStorage.setItem("dashboard_content_views", String(next));
    } catch {}
  };

  const handleFileUpload = async (videos: File[], category: Category) => {
    if (!videos.length) return;

    setIsUploading(true);
    try {
      const uploadedFiles: string[] = [];

      for (const video of videos) {
        const formData = new FormData();
        formData.append("video", video); // must match backend Multer field
        formData.append("category", category);

        const res = await fetch(
          "https://kia-project.onrender.com/api/uploads/video",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Upload failed");
        }

        uploadedFiles.push(video.name);
      }

      toast.success(
        uploadedFiles.length === 1
          ? `${uploadedFiles[0]} uploaded successfully`
          : `${uploadedFiles.length} videos uploaded successfully`
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Upload failed: ${error.message}`);
      } else {
        toast.error("Upload failed due to an unknown error");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    category: Category
  ) => {
    if (e.target.files) {
      handleFileUpload(Array.from(e.target.files), category);
    }
  };

  return (
    <div className="relative h-full mx-16 bg-white text-gray-900 p-6 md:p-10">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: { background: "#333", color: "#fff" },
        }}
      />

      <h1 className="text-2xl font-extrabold mb-4 text-black">
        Upload Your Contents
      </h1>

      <p className="text-sm text-gray-700 mb-8 leading-relaxed">
        Share your best practices and greeting videos for the GOFF community.
      </p>

      {/* Best Practices */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2 text-black">
          Best Practices
        </h2>

        <label className="flex items-center justify-center cursor-pointer border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-50 transition h-16 shadow-sm">
          <span className="text-gray-700 font-medium">
            {isUploading ? "Uploading..." : "Click to upload content"}
          </span>
          <input
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e, "Best Practices")}
            disabled={isUploading}
          />
        </label>
      </section>

      {/* Greeting Videos */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2 text-black">
          Greeting Videos
        </h2>

        <label className="flex items-center justify-center cursor-pointer border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-50 transition h-16 shadow-sm mb-4">
          <span className="text-gray-700 font-medium">
            {isUploading ? "Uploading..." : "Click to upload video"}
          </span>
          <input
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e, "Greeting Videos")}
            disabled={isUploading}
          />
        </label>
      </section>
    </div>
  );
}
