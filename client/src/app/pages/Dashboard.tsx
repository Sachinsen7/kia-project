"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

type DashboardProps = {
  onClose?: () => void;
};

export default function Dashboard({ onClose }: DashboardProps) {
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [contentViews, setContentViews] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  useEffect(() => {
    try {
      const v = Number(localStorage.getItem("dashboard_visitors") || "0") + 1;
      localStorage.setItem("dashboard_visitors", String(v));
      setVisitorCount(v);

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

        const res = await fetch("http://localhost:5000/api/uploads/", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Upload failed");
        }

        setImages((prev) =>
          category === "best-practice" ? [...prev, file] : prev
        );
        setVideos((prev) =>
          category === "greeting-video" ? [...prev, file] : prev
        );
        toast.success(`${file.name} uploaded successfully`);
      }
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
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

  const handleDeleteImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));
  const handleDeleteVideo = (index: number) =>
    setVideos((prev) => prev.filter((_, i) => i !== index));

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

        <div className="h-0.5 bg-gray-300 my-4"></div>
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {images.map((file, index) => (
              <div
                key={index}
                className="relative group border rounded-lg overflow-hidden shadow-sm"
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt="uploaded"
                  className="w-full h-32 object-cover"
                  width={150}
                  height={150}
                  onClick={incrementContentViews}
                />
                <button
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
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

        <div className="h-0.5 bg-gray-300 my-4"></div>

        <ul className="space-y-3">
          {videos.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg"
            >
              <video
                src={URL.createObjectURL(file)}
                controls
                className="w-40 h-24 object-cover rounded"
                onClick={incrementContentViews}
              />
              <button
                onClick={() => handleDeleteVideo(index)}
                className="text-red-600 hover:text-red-800 font-semibold ml-4"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
