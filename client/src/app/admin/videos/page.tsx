"use client";

import React, { useEffect, useState } from "react";
import { Trash, Play, Download } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiFetch } from "@/config/api";

type VideoItem = {
  id: string;
  title?: string;
  url: string;
  thumbnailUrl?: string;
  uploadedByEmail: string;
  createdAt?: string;
  category?: "greeting" | "bestpractices";
};

type Category = "greeting" | "bestpractices";

export default function ContentManagementVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState<VideoItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [category, setCategory] = useState<Category>("greeting");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setLoading(true);
    setError(null);
    try {
      const admintoken = localStorage.getItem("admintoken");
      if (!admintoken) throw new Error("No admin token found. Please log in.");

      const data = await apiFetch<{ videos: VideoItem[] }>(
        "/api/uploads/",
        "GET",
        undefined,
        admintoken
      );

      const videosArray = Array.isArray(data.videos)
        ? data.videos
        : Array.isArray(data)
        ? data
        : [];

      const validVideos = videosArray.filter(
        (v: VideoItem) => v.id && v.url && v.uploadedByEmail
      );

      const categorized = validVideos.map((v) => ({
        ...v,
        category: v.category || "greeting",
      }));

      setVideos(categorized);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } else {
        console.error("Unknown error:", err);
        setError("Failed to load videos");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this video?")) return;
    setDeletingId(id);
    try {
      const admintoken = localStorage.getItem("admintoken");
      if (!admintoken) throw new Error("No admin token found. Please log in.");

      await apiFetch(`/api/uploads/${id}`, "DELETE", undefined, admintoken);
      setVideos((prev) => prev.filter((v) => v.id !== id));
      alert("Video deleted");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Delete error:", err.message);
        setError(err.message);
      } else {
        console.error("Unknown error:", err);
        setError("Failed to delete video");
      }
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDownload(id: string, filename: string) {
    try {
      const admintoken = localStorage.getItem("admintoken");
      if (!admintoken) throw new Error("No admin token found. Please log in.");

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://kia-project.onrender.com"
        }/api/uploads/${id}/download`,
        {
          headers: { Authorization: `Bearer ${admintoken}` },
        }
      );
      if (!response.ok) throw new Error("Failed to download video");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "video.mp4";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Download error:", err.message);
        setError(err.message);
      } else {
        console.error("Unknown error:", err);
        setError("Failed to download video");
      }
    }
  }

  const filteredVideos = videos.filter((v) => v.category === category);
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVideos = filteredVideos.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  function openPlayer(video: VideoItem) {
    setPlaying(video);
  }
  function closePlayer() {
    setPlaying(null);
  }

  return (
    <ProtectedRoute role="admin">
      <div className="min-h-screen bg-gray-200 text-gray-900 p-4 sm:p-6 md:p-10 lg:p-14">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 sm:mb-0">
            Content Management — Videos
          </h1>
          <div className="text-sm sm:text-base text-gray-600 font-medium">
            Manage uploaded videos by category
          </div>
        </header>

        {/* Category Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setCategory("greeting");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium ${
              category === "greeting"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            Greeting Videos
          </button>
          <button
            onClick={() => {
              setCategory("bestpractices");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium ${
              category === "bestpractices"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            Best Practices
          </button>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="py-8 text-center text-lg font-medium text-gray-600 animate-pulse">
            Loading videos...
          </div>
        )}
        {error && <div className="text-red-600 text-center py-4">{error}</div>}

        {!loading && !filteredVideos.length && (
          <div className="text-center py-8 text-gray-500 text-lg font-medium">
            No videos found in this category.
          </div>
        )}

        {/* Video Table */}
        {!loading && filteredVideos.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-900">
                  <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Uploaded By</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Created At</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVideos.map((video) => (
                  <tr
                    key={video.id}
                    className="border-b hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 text-sm">
                      {video.title || "Untitled video"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {video.uploadedByEmail}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {video.createdAt
                        ? new Date(video.createdAt).toLocaleString()
                        : ""}
                    </td>
                    <td className="px-4 py-3 text-sm capitalize">
                      {video.category}
                    </td>
                    <td className="px-4 py-3 text-sm flex gap-2">
                      <button
                        onClick={() => openPlayer(video)}
                        className="flex items-center gap-1 rounded-md bg-blue-600 text-white px-3 py-1 text-xs font-medium hover:bg-blue-700 transition-colors duration-200"
                      >
                        <Play size={12} /> Watch
                      </button>
                      <button
                        onClick={() =>
                          handleDownload(video.id, video.title || "video.mp4")
                        }
                        className="flex items-center gap-1 rounded-md bg-gray-600 text-white px-3 py-1 text-xs font-medium hover:bg-gray-700 transition-colors duration-200"
                      >
                        <Download size={12} /> Download
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        disabled={deletingId === video.id}
                        className="flex items-center gap-1 rounded-md bg-red-600 text-white px-3 py-1 text-xs font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                      >
                        <Trash size={12} />{" "}
                        {deletingId === video.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

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
    </ProtectedRoute>
  );
}