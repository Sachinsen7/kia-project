"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";
import { X } from "lucide-react";

type DashboardProps = {
  onClose?: () => void;
};

type Category = "Best Practices" | "Greeting Videos";

export default function Dashboard({ onClose }: DashboardProps) {
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
    } catch { }
  }, []);

  const incrementContentViews = () => {
    try {
      const next = contentViews + 1;
      setContentViews(next);
      localStorage.setItem("dashboard_content_views", String(next));
    } catch { }
  };

  const handleFileUpload = async (videos: File[], category: Category) => {
    if (!videos.length) return;

    setIsUploading(true);
    try {
      const uploadedFiles: string[] = [];

      for (const video of videos) {
        const formData = new FormData();
        formData.append("video", video);
        formData.append("category", category);

        const res = await fetch(
          "https://kia-project-hlrv.onrender.com/api/uploads/video",
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
          : `${uploadedFiles.length} files uploaded successfully`
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
    <div className="relative w-full min-h-screen bg-white px-6 md:px-16 py-12">
      {/* Toaster */}
      <div className="bg-white relative shadow-2xl rounded-2xl w-full max-w-6xl mx-6 px-8 pb-6 md:px-14">
        {/* Cross Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <Image
              width={22}
              height={22}
              src="/askkia/cross.png"
              alt="Close sidebar"
              className="cursor-pointer"
            />{" "}
          </button>
        )}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: { background: "#333", color: "#fff" },
          }}
        />
        <Image
          width={600}
          height={22}
          src="/Group 110.png"
          alt="Close sidebar"
          className="cursor-pointer pb-8"
        />{" "}
        <div className="mt-10 text-gray-700 leading-relaxed w-[1108px] h-[200px]">
          <div className="mb-52">
            <p className="text-sm text-gray-700 mb-8 leading-relaxed">
              Thank you for your dedicated efforts to provide exceptional
              ownership experiences over the <br /> past year. <br /> To
              continue building a strong GOEF community, we invite you to share
              your best practices <br /> and innovative success stories
              regarding ownership programs and differentiated customer <br />{" "}
              experiences from your region. Your shared experiences will be a
              valuable source of <br /> inspiration for us all.
              <br />
            </p>
          </div>

          {/* Big Highlight Image */}
          <Image
            src="/uploadyourcontent/first-image.png"
            alt="2024 GOEF Highlight"
            width={600}
            height={600}
            className="absolute top-76 right-0 object-cover"
          />
        </div>
        {/* Best Practices */}
        <section className="mb-15">
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
        <div className="h-[2px] w-full bg-gray-300 mt-5"></div>
        <div className="mt-40 text-gray-700 leading-relaxed w-[1108px] h-[200px]">
          <div className="mb-10">
            <p className="text-sm text-gray-700 leading-relaxed">
              We are creating a forum at GOEF and plan to edit the videos from
              all regions into a <br /> single-story <br /> video. Please send
              us a horizontal, high-quality video message of encouragement to
              your <br />
              colleagues worldwide. It should feature all regional members for a
              more meaningful impact, <br /> and it <br /> will be used as the
              GOEF closing video.
            </p>
          </div>

          <Image
            src="/uploadyourcontent/second-image.png"
            alt="2024 GOEF Highlight"
            width={600}
            height={600}
            className="absolute bottom-64 left-0 object-cover"
          />
        </div>
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-2 text-black">
            Greeting Videos
          </h2>

          <label className="flex items-center justify-center cursor-pointer border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-50 transition h-16 shadow-sm mb-4 mt-10">
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
    </div>
  );
}
