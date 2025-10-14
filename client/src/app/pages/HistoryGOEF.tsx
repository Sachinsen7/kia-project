"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { apiFetch } from "../../config/api";
import Carousel from "../../components/Carousel";

// Dynamically import Plyr to avoid SSR issues
const PlyrPlayer = dynamic(() => import("../../components/PlyrPlayer"), {
  ssr: false,
});

type HistoryGOEFProps = {
  onClose?: () => void;
};

export default function HistoryGOEF({ onClose }: HistoryGOEFProps) {
  const images = [
    "/history/DSC01188.JPG",
    "/history/DSC01511.JPG",
    "/history/DSC01697.JPG",
    "/history/DSC01790.JPG",
    "/history/DSC01879.JPG",
    "/history/DSC02154.JPG",
    "/history/DSC02817.JPG",
    "/history/DSC02889.JPG",
    "/history/DSC03211.JPG",
  ];

  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch video
  useEffect(() => {
    const fetchTeaserVideo = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch<{
          message: string;
          teaser: { name: string; videoUrl: string };
        }>("/api/teaser/video2");

        if (response.teaser && response.teaser.videoUrl) {
          setVideoUrl(response.teaser.videoUrl);
        } else {
          setError("No video URL found");
        }
      } catch (err) {
        console.error("Error fetching teaser video:", err);
        setError("Failed to load video");
        setVideoUrl("https://www.youtube.com/watch?v=q96KKjfwHEE");
      } finally {
        setLoading(false);
      }
    };

    fetchTeaserVideo();
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-white px-6 md:px-16 py-12">
      <div className="bg-white relative shadow-2xl rounded-2xl w-full max-w-6xl mx-6 px-8 md:px-14">
        {/* Close Button */}
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
            />
          </button>
        )}

        {/* Header */}
        <div className="w-full pb-10 px-4">
          <Image
            width={500}
            height={22}
            src="/Group 107.png"
            alt="GOEF Logo"
            className="cursor-pointer mb-6"
          />
        </div>

        {/* Text Section */}
        <div className="px-6 md:px-12 text-gray-700 leading-relaxed border-l border-r border-gray-600">
          <div className="mb-8">
            <p className="mb-4">
              GOEF is a global forum where ownership leaders from around the
              world gather annually to share and discuss business strategies,
              plans, and valuable insights for the coming year.
            </p>
            <p className="mb-4">
              After being held online due to the COVID-19 pandemic, the forum
              returned to an in-person, three-day event in Seoul in 2024. Under
              the slogan <span className="italic">“Vision to Reality”</span>, it
              was a meaningful occasion where HQ and NSC ownership leaders came
              together to strengthen their network.
            </p>
            <p className="mb-4">
              It was also a moment to reflect deeply on ownership experience and
              customer value through special lectures on Kia’s brand strategy,
              core values, and customer experience, as well as an insightful
              field trip to key Kia sites and famous spots in Seoul.
            </p>
            <p>
              We look forward to meeting again in Seoul in the near future to
              further strengthen our ownership capabilities and unite in our
              vision.
            </p>

            <h2 className="text-center text-[24px] mb-8 font-bold text-black">
              2024 GOEF Highlights
            </h2>
          </div>

          {/* Highlight Video */}
          <div className="w-full mb-12">
            {loading ? (
              <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-lg text-gray-600">Loading video...</div>
              </div>
            ) : error ? (
              <div className="w-full h-[400px]  flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-lg text-red-600">{error}</div>
              </div>
            ) : (
              <div className="w-full h-[400px] overflow-hidden rounded-lg shadow-md">
                <PlyrPlayer src={videoUrl} />
              </div>
            )}
          </div>
        </div>

        {/* Bottom border */}
        {/* <div className="border-b border-gray-600"></div> */}

        {/* Gallery Carousel */}
        <div className="text-center">
          <h2 className="mt-10 text-[24px] text-gray-900 mb-10">Gallery</h2>
          <Carousel images={images} interval={3000} />
        </div>
      </div>
    </div>
  );
}
