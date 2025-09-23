"use client";

import React, { useEffect, useState } from "react";
import { Trash, Play, EyeOff, 
  
  
 } from "lucide-react";

type VideoItem = {
  id: string;
  title?: string;
  url: string;
  thumbnailUrl?: string;
  uploadedByEmail: string;
  createdAt?: string;
};

async function fetchVideosApi(token: string | null) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/api/uploads/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    let errorMessage = "Failed to load videos";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }
  return res.json();
}

async function deleteVideoApi(id: string, token: string | null) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/admin/videos/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    let errorMessage = "Delete failed";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }
  return res.json();
}

export default function ContentManagementVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState<VideoItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setLoading(true);
    setError(null);
    try {
      const admintoken = localStorage.getItem("admintoken");
      const data = await fetchVideosApi(admintoken);
      setVideos(data.videos || data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load videos");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const ok = confirm("Are you sure you want to delete this video?");
    if (!ok) return;

    setDeletingId(id);
    try {
      const admintoken = localStorage.getItem("admintoken");
      await deleteVideoApi(id, admintoken);
      setVideos((prev) => prev.filter((v) => v.id !== id));
      alert("Video deleted");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Could not delete video");
    } finally {
      setDeletingId(null);
    }
  }

  function openPlayer(video: VideoItem) {
    setPlaying(video);
  }

  function closePlayer() {
    setPlaying(null);
  }

  return (
    <div className="min-h-screen bg-gray-200 text-gray-900 p-4 sm:p-6 md:p-10 lg:p-14">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 sm:mb-0">
          Content Management — Videos
        </h1>
        <div className="text-sm sm:text-base text-gray-600 font-medium">
          Manage uploaded videos: watch, delete, or download
        </div>
      </header>

      {/* Loading and Error States */}
      {loading && (
        <div className="py-8 text-center text-lg font-medium text-gray-600 animate-pulse">
          Loading videos...
        </div>
      )}
      {error && <div className="text-red-600 text-center py-4">{error}</div>}

      {!loading && !videos.length && (
        <div className="text-center py-8 text-gray-500 text-lg font-medium">
          No videos found.
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="relative bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-200"
          >
            <div className="relative h-40 sm:h-48 bg-gray-100 flex items-center justify-center">
              {video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title || "thumbnail"}
                  className="object-cover w-full h-full"
                />
              ) : (
                <video
                  src={video.url}
                  className="object-cover w-full h-full"
                  muted
                  playsInline
                  preload="metadata"
                />
              )}

              {/* Watermark Overlay */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-medium opacity-20 select-none transform -rotate-12"
                style={{
                  background:
                    "linear-gradient(transparent 0%, transparent 30%, rgba(255,255,255,0.8) 31%, transparent 32%), repeating-linear-gradient(90deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 100px)",
                  mixBlendMode: "normal",
                }}
              >
                <div className="whitespace-nowrap px-4 py-1 rounded-md bg-white/10 backdrop-blur-sm">
                  {video.uploadedByEmail}
                </div>
              </div>

              {/* Watch Button */}
              <button
                onClick={() => openPlayer(video)}
                className="absolute left-2 sm:left-3 bottom-2 sm:bottom-3 flex items-center gap-1 sm:gap-2 rounded-md bg-white/90 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium shadow hover:bg-white transition-colors duration-200"
              >
                <Play size={14} /> Watch
              </button>

              {/* Action Buttons */}
              <div className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 flex gap-1 sm:gap-2">
                <a
                  href={video.url}
                  download
                  className="flex items-center gap-1 sm:gap-2 rounded-md bg-white/90 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium shadow hover:bg-white transition-colors duration-200"
                >
                  <Download size={12} /> Download
                </a>
                <button
                  onClick={() => handleDelete(video.id)}
                  disabled={deletingId === video.id}
                  className="flex items-center gap-1 sm:gap-2 rounded-md bg-red-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium shadow hover:bg-red-700 transition-colors duration-200"
                >
                  <Trash size={12} /> {deletingId === video.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>

            {/* Video Info */}
            <div className="px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm sm:text-base">
                    {video.title || "Untitled video"}
                  </div>
                  <div className="text-xs text-gray-600">{video.uploadedByEmail}</div>
                </div>
                <div className="text-xs text-gray-600">
                  {video.createdAt ? new Date(video.createdAt).toLocaleString() : ""}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Player Modal */}
      {playing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-full sm:max-w-4xl rounded-xl overflow-hidden bg-black">
            <div className="flex items-center justify-between p-3 bg-gray-800">
              <div className="text-white font-semibold text-sm sm:text-base">
                {playing.title || "Video Preview"}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1 sm:gap-2 rounded px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => {
                    navigator.clipboard?.writeText(playing.url);
                    alert("Video URL copied");
                  }}
                >
                  Copy URL
                </button>
                <button
                  className="flex items-center gap-1 sm:gap-2 rounded px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
                  onClick={closePlayer}
                >
                  Close
                </button>
              </div>
            </div>

            <video
              src={playing.url}
              controls
              autoPlay
              className="w-full h-[40vh] sm:h-[60vh] object-contain bg-black"
            />

            <div className="p-3 bg-gray-800 text-xs sm:text-sm text-white/80">
              Uploaded by: {playing.uploadedByEmail}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}