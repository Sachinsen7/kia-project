"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { apiFetch } from "../../config/api";
import VideoJSPlayer from "../../components/VideoJSPlayer";

// Dynamically import React Player to avoid SSR issues
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

// Dynamically import PlyrPlayer to avoid SSR issues
const PlyrPlayer = dynamic(() => import("../../components/PlyrPlayer"), { ssr: false });

type HomeProps = {
  onClose?: () => void;
};

function Home({ onClose }: HomeProps) {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTeaserVideo = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch teaser by name - you can change this name as needed
        const response = await apiFetch<{ message: string; teaser: { name: string; videoUrl: string } }>(
          "/api/teaser/video1"
        );

        if (response.teaser && response.teaser.videoUrl) {
          setVideoUrl(response.teaser.videoUrl);
        } else {
          setError("No video URL found");
        }
      } catch (err) {
        console.error("Error fetching teaser video:", err);
        setError("Failed to load video");
        // Fallback to a default video URL if the API fails
        setVideoUrl("https://www.youtube.com/watch?v=q96KKjfwHEE");
      } finally {
        setLoading(false);
      }
    };

    fetchTeaserVideo();
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 md:p-12">
      {/* Floating Card */}
      <div className="relative bg-white shadow-2xl rounded-2xl w-full max-w-6xl m-6 p-8 md:p-14">
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
        {/* Heading */}
        <h1 className="text-3xl ml-10 md:text-5xl text-gray-900 mb-2">
          Welcome to
        </h1>

        {/* Underline + 2025 */}
        <div className="ml-40 flex items-center">
          <div className="left-0 w-[240px] h-[4px] text-[#000] bg-[#000] absolute top-37"></div>
          <h2 className="text-4xl md:text-5xl text-gray-900">
            2025 <span className="font-bold">GOEF</span>
          </h2>
        </div>

        {/* Intro paragraphs - aligned end */}
        <div className="mt-20 flex justify-end">
          <div className="space-y-4 text-gray-700 tracking-widest leading-relaxed border-r-2 border-b-2 border-gray-300 pr-6 pb-6 max-w-3xl text-left">
            <p>
              It is with great honor that we extend this official invitation to
              the <br /> 2025 Global Ownership Experience Forum, in sincere
              appreciation of <br /> your exceptional performance and unwavering
              dedication to Kia.
            </p>
            <p>
              This year, we have specially designed a virtual conference format
              to <br /> enable richer exchanges without being restricted by time
              and <br /> location. This forum will be a valuable opportunity to
              do more than <br /> just share information; it will also be a time
              to collectively envision <br /> Kia&apos;s future.
            </p>
            <p>
              We will share in-depth insights, from the core strategies of our
              2026 <br /> business plans to new ownership programs designed to
              deliver <br />
              unforgettable customer experiences, as well as customer experience{" "}
              <br />
              strategies and retention initiatives for sustainable growth. Each{" "}
              <br />
              session will provide practical solutions and new inspiration for
              your <br /> business growth.
            </p>
            <p>
              We look forward to reconnecting in the virtual space to exchange{" "}
              <br />
              valuable opinions, share wisdom for our mutual success, and
              further <br /> strengthen our long-standing partnership.
            </p>
            <p>
              Thank you for your continued passion and partnership. We look{" "}
              <br />
              forward to your participation in the 2025 Global Ownership <br />
              Experience Forum.
            </p>
          </div>
        </div>

        {/* Video section */}
        <div className="mt-20">
          <h2 className="text-lg  uppercase font-bold text-black-500 tracking-wide mb-4 text-center">
            2025 GOEF Official Teaser
          </h2>
          <div className="w-full overflow-hidden rounded-xl shadow-md relative aspect-video">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-lg text-gray-600">Loading video...</div>
              </div>
            ) : error ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-lg text-red-600">{error}</div>
              </div>
            ) : (
              <PlyrPlayer src={videoUrl} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
