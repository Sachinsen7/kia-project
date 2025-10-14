"use client";
import React from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

type PlyrPlayerProps = {
  src: string;
  type?: string;
  loop?: boolean;
};

export default function PlyrPlayer({ src, type = "video/mp4", loop = false }: PlyrPlayerProps) {
  const videoSource = {
    type: "video" as const,
    sources: [
      {
        src: src,
        type: type,
      },
    ],
  };

  return (
    <div className="overflow-hidden rounded-xl shadow-lg">
      <Plyr
        source={videoSource}
        options={{
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "settings",
            "fullscreen",
          ],
          autoplay: false,
          clickToPlay: true,
          tooltips: { controls: true, seek: true },
          loop: { active: loop },
        }}
      />
    </div>
  );
}
