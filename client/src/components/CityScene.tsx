"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { links } from "@/app/data/Links";

type CitySceneProps = {
  onSelect: (id: string) => void;
};

export default function CityScene({ onSelect }: CitySceneProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const memoizedIcons = useMemo(() => {
    return links.map((link) => {
      const Icon = link.icon;
      return (
        <button
          key={link.id}
          onClick={() => onSelect(link.id)}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
          style={{
            left: `${link.x}%`,
            top: `${link.y}%`,
          }}
        >
          <div className="relative flex items-center justify-center w-[4rem] h-[4rem] md:w-16 md:h-16">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#ff6c4c]/50 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity"></span>

            <div
              className="absolute w-[4rem] h-[4rem] md:w-16 md:h-16 bg-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
              style={{
                clipPath:
                  "path('M32 0C49.673 0 64 14.327 64 32C64 51.2 32 64 32 64C32 64 0 51.2 0 32C0 14.327 14.327 0 32 0Z')",
              }}
            >
              <div className="w-[2.5rem] h-[2.5rem] md:w-10 md:h-10 bg-[#ff6c4c] rounded-full flex items-center justify-center transition-transform group-hover:animate-bounce duration-200">
                <Icon className="text-white w-[1.25rem] h-[1.25rem] md:w-5 md:h-5" />
              </div>
            </div>

            {link.id === "welcome" && (
              <span className="absolute -top-5 text-xs font-bold px-2 py-1 rounded bg-red-600 text-white animate-pulse">
                LIVE
              </span>
            )}
          </div>

          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {link.name}
          </div>
        </button>
      );
    });
  }, []);

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      <Image
        src="/new-home-image.jpg"
        alt="City Scene"
        fill
        priority
        className="object-cover transition-opacity duration-500"
        onLoadingComplete={() => {
          console.timeEnd("imageLoadToIcons");
          setIsImageLoaded(true);
        }}
      />

      <div className="absolute top-[-9999px] opacity-0">
        {links.map((link) => {
          const Icon = link.icon;
          return <Icon key={link.id} className="hidden" />;
        })}
      </div>

      {isImageLoaded && (
        <div className="absolute inset-0 w-full h-full">{memoizedIcons}</div>
      )}
    </div>
  );
}
