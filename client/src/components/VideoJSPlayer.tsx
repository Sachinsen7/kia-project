"use client";
import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

type Props = {
  src: string;
  type?: string;
};

export default function VideoJSPlayer({ src, type = "video/mp4" }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const player = videojs(videoRef.current, {
      controls: true,
      fluid: true,
      preload: "auto",
      sources: [{ src, type }],
    });

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [src, type]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered rounded-xl overflow-hidden"
      />
    </div>
  );
}
