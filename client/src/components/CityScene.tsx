"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { links } from "@/app/data/Links";

type CityLink = {
  id: string;
  name: string;
  icon: React.ElementType;
  x: number;
  y: number;
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
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLoadingLive, setIsLoadingLive] = useState(false);

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
          <div className="relative flex items-center justify-center w-[4rem] h-[4rem] md:w-16 md:h-16">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#05141f]/50 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity"></span>

            <div
              className="absolute w-[4rem] h-[4rem] md:w-16 md:h-16 bg-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
              style={{
                clipPath:
                  "path('M32 0C49.673 0 64 14.327 64 32C64 51.2 32 64 32 64C32 64 0 51.2 0 32C0 14.327 14.327 0 32 0Z')",
              }}
            >
              <div className="w-[2.5rem] h-[2.5rem] md:w-10 md:h-10 bg-[#05141f] rounded-full flex items-center justify-center transition-transform group-hover:animate-bounce duration-200">
                <Icon className="text-white w-[1.25rem] h-[1.25rem] md:w-5 md:h-5" />
              </div>
            </div>

            {link.id === "live-link" && (
              <span className="absolute -top-5 text-xs font-bold px-2 py-1 rounded bg-red-600 text-white animate-pulse">
                {isLoadingLive ? "LOADING" : "LIVE"}
              </span>
            )}
          </div>

          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {link.name}
          </div>
        </button>
      );
    });
  }, [onSelect]);

  // overlapping landing page image
  return (
    <div className="relative w-full h-full bg-white overflow-hidden flex flex-col">
      {/* Background Image */}
      <Image
        src="/landing-page.png"
        alt="City Scene"
        fill
        priority
        className="object-fill transition-opacity duration-500"
        onLoadingComplete={() => {
          console.timeEnd("imageLoadToIcons");
          setIsImageLoaded(true);
        }}
      />

      {/* Hidden preload for icons */}
      <div className="absolute top-[-9999px] opacity-0">
        {links.map((link: CityLink) => {
          const Icon = link.icon;
          return <Icon key={link.id} className="hidden" />;
        })}
      </div>

      {/* Icons overlay after image is loaded */}
      {isImageLoaded && (
        <div className="absolute inset-0 w-full h-full">{memoizedIcons}</div>
      )}

      {/* Footer */}
      <footer className="absolute bottom-0 flex justify-between px-20 w-full bg-white border-t border-gray-200 py-7 text-center text-sm text-gray-700">
        <div>
          <a href="/privacy-policy" className="hover:underline mx-2">
            Privacy Policy
          </a>
          <a href="/cookies-policy" className="hover:underline mx-2">
            Cookies Policy
          </a>
        </div>
        <div>

          © Kia Corporation
        </div>
      </footer>
    </div>
  );


  // shrinking landing page image

  // return (
  //   <div className="relative w-full h-full bg-white overflow-hidden flex flex-col min-h-screen">
  //     {/* Image container */}
  //     <div className="relative flex-1">
  //       <Image
  //         src="/landing-page.png"
  //         alt="City Scene"
  //         fill
  //         priority
  //         className="object-fill transition-opacity duration-500"
  //         onLoadingComplete={() => {
  //           console.timeEnd("imageLoadToIcons");
  //           setIsImageLoaded(true);
  //         }}
  //       />

  //       {/* Hidden preload for icons */}
  //       <div className="absolute top-[-9999px] opacity-0">
  //         {links.map((link: CityLink) => {
  //           const Icon = link.icon;
  //           return <Icon key={link.id} className="hidden" />;
  //         })}
  //       </div>

  //       {/* Icons overlay after image is loaded */}
  //       {isImageLoaded && (
  //         <div className="absolute inset-0 w-full h-full">{memoizedIcons}</div>
  //       )}
  //     </div>

  //     {/* Footer outside image container */}
  //     <footer className="flex justify-between px-20 w-full bg-white border-t border-gray-200 py-7 text-center text-sm text-gray-700">
  //       <div>
  //         <a href="/privacy-policy" className="hover:underline mx-2">
  //           Privacy Policy
  //         </a>
  //         <a href="/cookies-policy" className="hover:underline mx-2">
  //           Cookies Policy
  //         </a>
  //       </div>
  //       <div>

  //         © Kia Corporation
  //       </div>
  //     </footer>
  //   </div>
  // );

}
