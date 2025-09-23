"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type DashboardProps = {
  onClose?: () => void;
};

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

  const handleFileUpload = async (
    files: File[],
    category: "best-practice" | "greeting-video"
  ) => {
    if (!files.length) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);

        const res = await fetch(
          "https://kia-project.onrender.com/api/uploads/",
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

        toast.success(`${file.name} uploaded successfully`);
      }
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploaded = Array.from(e.target.files);
      handleFileUpload(uploaded, "best-practice");
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploaded = Array.from(e.target.files);
      handleFileUpload(uploaded, "greeting-video");
    }
  };

  return (
    <div className="relative h-full mx-16 bg-white text-gray-900 p-6 md:p-10">
      <h1 className="text-2xl font-extrabold mb-4 text-black">
        Upload Your Contents
      </h1>

      <p className="text-sm text-gray-700 mb-8 leading-relaxed">
        Over the past year, we have all worked with dedication to provide our
        customers with unforgettable ownership experiences. Now, we want to
        share the brilliant results of these efforts. Please share your best
        practices, creative ideas, ownership programs and differentiated
        customer experiences implemented in your region. We want to learn from
        each and be inspired by your innovative ideas across markets.
        <br />
        <br />
        Your success is our collective achievement. Feel free to share your
        experiences from the past year, including innovative concepts of unique
        campaigns, programs and differentiated customer experiences. Your
        stories will be a great source of inspiration for colleagues in other
        regions. Let&apos;s build a growing GOFF community together.
      </p>

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
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
        </label>
      </section>

      <p className="text-sm text-gray-700 mb-8 leading-relaxed">
        We are creating a forum within your GOFF, and to start out, we plan to
        invite each region to create a simple story video.
        <br />
        <br />
        Please send us a video with a message to your colleagues worldwide,
        especially a message of encouragement.
        <br />
        These videos will be a part of the GOFF page allowing you to welcome new
        ownership and build a sense of engagement.
        <br />
        Please make sure the video is short (approx. 30-60 seconds). It can be
        recorded with your phone, and please make sure the video is in
        horizontal format (not vertical) and shot in HD, so the quality is
        maintained.
      </p>

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
            onChange={handleVideoUpload}
            disabled={isUploading}
          />
        </label>
      </section>
    </div>
  );
}
