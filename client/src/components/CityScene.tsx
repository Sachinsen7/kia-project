"use client";

import { useState, useMemo, useEffect } from "react";
import { links } from "@/app/data/Links";
import { useRouter } from "next/navigation";
import LiveThoughtsFeed from "./LiveThoughtsFeed";

export type CityLink = {
  id: string;
  name: string;
  x: number;
  y: number;
  icon: React.ElementType;
  svg: React.ReactElement;
  url?: string;
};

type CitySceneProps = {
  onSelect: (id: string, data?: unknown) => void;
};

async function fetchLiveData(token: string): Promise<{ url?: string } | null> {
  try {
    const response = await fetch(
      "https://kia-project-hlrv.onrender.com/api/Link/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("LIVE data:", data);

    if (Array.isArray(data) && data.length > 0 && data[0].url) {
      return { url: data[0].url };
    }
    return null;
  } catch (error) {
    console.error("Error fetching live data:", error);
    return null;
  }
}

export default function CityScene({ onSelect }: CitySceneProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(true); // Set to true by default so icons always show
  const [isLoadingLive, setIsLoadingLive] = useState(false);

  // Ensure icons are visible after component mounts
  useEffect(() => {
    setIsImageLoaded(true);
  }, []);

  const memoizedIcons = useMemo(() => {
    return links.map((link: CityLink) => {
      const Icon = link.icon;

      const handleClick = async () => {
        if (link.id === "live-link") {
          const token = localStorage.getItem("token");
          if (!token) {
            console.warn("No token found, please login first");
            alert("Please log in to access the live link.");
            onSelect(link.id, { error: "No token" });
            return;
          }

          setIsLoadingLive(true);
          const data = await fetchLiveData(token);
          setIsLoadingLive(false);

          if (data?.url) {
            try {
              const url = new URL(data.url);
              console.log("Opening live URL:", url.toString());
              window.open(url.toString(), "_blank");
              onSelect(link.id, data);
            } catch (error) {
              console.error("Invalid URL:", data.url);
              alert("Invalid URL received from the server.");
              onSelect(link.id, { error: "Invalid URL" });
            }
          } else {
            console.warn("No valid URL in live data");
            alert("No live link available at the moment.");
            onSelect(link.id, { error: "No URL" });
          }
        } else if (link.url) {
          try {
            const url = new URL(link.url);
            console.log("Opening static URL:", url.toString());
            window.open(url.toString(), "_blank");
            onSelect(link.id, link.url);
          } catch (error) {
            console.error("Invalid static URL:", link.url);
            alert("Invalid static URL.");
            onSelect(link.id, { error: "Invalid static URL" });
          }
        } else {
          onSelect(link.id);
        }
      };

      return (
        <button
          key={link.id}
          onClick={handleClick}
          disabled={link.id === "live-link" && isLoadingLive}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 group ${isLoadingLive && link.id === "live-link"
            ? "opacity-50 cursor-wait"
            : ""
            }`}
          style={{
            left: `${link.x}%`,
            top: `${link.y}%`,
          }}
        >
          <div className="relative flex items-center justify-center md:w-full md:h-full">
            {/* <span className="absolute inline-flex h-full w-full rounded-full bg-[#05141f]/50 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity"></span>{" "} */}
            <div
              className="w-24 h-24 md:w-40 md:h-40 flex items-center justify-center 
             cursor-pointer hover:scale-110 transition-transform duration-300 animate-shimmer-bounce"
            >
              {link.svg}
            </div>

            {link.id === "live-link" && (
              <span className="absolute -top-5 text-xs font-bold px-2 py-1 rounded bg-red-600 text-white animate-pulse">
                {isLoadingLive ? "LOADING" : "LIVE"}
              </span>
            )}
          </div>

          {/* <div className="absolute top-30 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {link.name}
          </div> */}
        </button>
      );
    });
  }, [onSelect]);

  return (
    <div className="relative w-full h-full bg-white overflow-hidden flex flex-col">
      {/* Background Video */}
      <video
        src="/new_video_landing_page.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        onLoadedData={() => {
          console.log("Video loaded successfully");
          setIsImageLoaded(true);
        }}
        onError={(e) => {
          console.error("Video failed to load:", e);
          setIsImageLoaded(true); // Still show icons even if video fails
        }}
      />

      {/* Hidden preload for icons */}
      <div className="absolute top-[-9999px] opacity-0">
        {links.map((link: CityLink) => {
          const Icon = link.icon;
          return <Icon key={link.id} className="hidden" />;
        })}
      </div>

      {/* Icons overlay - always visible */}
      <div className="absolute inset-0 w-full h-full z-10">{memoizedIcons}</div>

      {/* Event Page Interface (Bottom Left) */}
      {/* <div className="absolute bottom-24 left-4">
        <button
          onClick={() => setIsEventOpen(!isEventOpen)}
          className="px-4 py-2 bg-[#05141f] text-white rounded-lg shadow-md cursor-pointer transition"
        >
          Share & Win
        </button>
      </div> */}

      <div className="absolute bottom-25 left-4 w-100">
        <LiveThoughtsFeed />
      </div>

      {/* {isEventOpen && (
        <div
          className="fixed inset-0 z-40 mb-10 flex items-end justify-start"
          onClick={() => setIsEventOpen(false)}
        >
          <div className="absolute inset-0 bg-opacity-30" />

          <div
            className="relative z-50 mb-36 ml-4 w-96 shadow-lg rounded-lg p-4 bg-white
                 transform transition-all duration-300 ease-out
                 opacity-0 translate-y-4 animate-fadeInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-xl mb-4 text-[#05141f]">
              Share & Win ! (Event)
            </h3>
            <p className="text-lg font-bold text-[#05141f] mb-6">
              Join us and win a prize
            </p>
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {eventPosts.map((post, idx) => (
                <li
                  key={idx}
                  className="p-2 bg-gray-100 rounded cursor-pointer text-[#05141f] hover:bg-gray-200 transition"
                  onClick={() => {
                    router.push("/share-win");
                    setIsEventOpen(false);
                  }}
                >
                  {post}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )} */}
      {/* Footer */}
      <footer className="absolute bottom-0 w-full bg-white border-t border-gray-200 py-4 px-4 md:px-20 text-center text-sm text-gray-700">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
          <div className="flex flex-wrap justify-center md:justify-start">
            <a href="/privacy-policy" className="hover:underline mx-2">
              Privacy Policy
            </a>
            <a href="/cookies-policy" className="hover:underline mx-2">
              Cookies Policy
            </a>
          </div>
          <div className="mt-2 md:mt-0">© Kia Corporation</div>
        </div>
      </footer>
    </div>
  );
}
