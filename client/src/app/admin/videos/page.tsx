"use client";

import React, { useEffect, useState } from "react";
import { Trash, Play, Download, Plus, X, Link as LinkIcon } from "lucide-react";
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

type LinkItem = {
  id?: string;
  type: "youtube";
  url: string;
  addedBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

type Category = "greeting" | "bestpractices";

export default function ContentManagementVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [linksLoading, setLinksLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState<VideoItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [category, setCategory] = useState<Category>("greeting");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Link upload modal state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkUploading, setLinkUploading] = useState(false);

  useEffect(() => {
    fetchVideos();
    // fetchLinks(); // you can enable if needed
  }, []);

  async function fetchVideos() {
    setLoading(true);
    setError(null);
    try {
      const admintoken = localStorage.getItem("admintoken");
      if (!admintoken) throw new Error("No admin token found. Please log in.");

      const response = await fetch(
        "https://kia-project.onrender.com/api/uploads/videos",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${admintoken}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch videos");
      }

      const data = await response.json();

      const videosArray = Array.isArray(data.videos) ? data.videos : [];

      // Map API response to frontend structure
      const mappedVideos = videosArray.map((v: any) => ({
        id: v._id,
        url: v.url,
        title: v.title || "Untitled video",
        uploadedByEmail: v.uploadedBy?.email || "Unknown",
        createdAt: v.createdAt,
        category:
          v.categories?.[0]?.toLowerCase() === "best practices"
            ? "bestpractices"
            : "greeting",
      }));

      setVideos(mappedVideos);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to load videos");
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
      if (err instanceof Error) setError(err.message);
      else setError("Failed to delete video");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeleteLink(linkId: string) {
    if (!confirm("Are you sure you want to delete this link?")) return;
    try {
      const admintoken = localStorage.getItem("admintoken");
      if (!admintoken) throw new Error("No admin token found. Please log in.");

      const response = await fetch(
        `https://kia-project.onrender.com/api/Link/${linkId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${admintoken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete link");
      }

      setLinks((prev) => prev.filter((l) => l.id !== linkId));
      alert("Link deleted successfully");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to delete link");
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

  async function handleUploadLink() {
    if (!linkUrl.trim()) {
      alert("Please enter a valid URL");
      return;
    }

    // Basic YouTube URL validation
    if (!linkUrl.includes("youtube.com") && !linkUrl.includes("youtu.be")) {
      alert("Please enter a valid YouTube URL");
      return;
    }

    setLinkUploading(true);
    try {
      const admintoken = localStorage.getItem("admintoken");
      if (!admintoken) throw new Error("No admin token found. Please log in.");

      const response = await fetch(
        "https://kia-project.onrender.com/api/Link/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${admintoken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "youtube",
            url: linkUrl.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload link");
      }

      const data = await response.json();

      if (data.link) {
        setLinks((prev) => [data.link, ...prev]);
        setLinkUrl("");
        setShowLinkModal(false);
        alert("Link added successfully!");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Upload link error:", err.message);
        alert(`Failed to upload link: ${err.message}`);
      } else {
        console.error("Unknown error:", err);
        alert("Failed to upload link");
      }
    } finally {
      setLinkUploading(false);
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

  function getYouTubeVideoId(url: string) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  function getYouTubeThumbnail(url: string) {
    const videoId = getYouTubeVideoId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : null;
  }

  return (
    <ProtectedRoute role="admin">
      <div className="min-h-screen bg-gray-200 text-gray-900 p-4 sm:p-6 md:p-10 lg:p-14">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 sm:mb-0">
            Content Management — Videos & Links
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm sm:text-base text-gray-600 font-medium">
              Manage uploaded videos and team links
            </div>
            <button
              onClick={() => setShowLinkModal(true)}
              className="flex items-center gap-2 bg-[#05141f] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#171e22] transition-colors duration-200"
            >
              <Plus size={16} /> Upload Link
            </button>
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
                ? "bg-[#05141f] text-white"
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
                ? "bg-[#05141f] text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            Best Practices
          </button>
        </div>

        {/* Team Links Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <LinkIcon size={20} /> Team Links
          </h2>
          {linksLoading ? (
            <div className="py-4 text-center text-gray-600 animate-pulse">
              Loading links...
            </div>
          ) : links.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {links.map((link, index) => (
                <div
                  key={link.id || index}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <Play size={12} className="text-white ml-0.5" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        YouTube
                      </span>
                    </div>
                    {link.id && (
                      <button
                        onClick={() => handleDeleteLink(link.id!)}
                        className="text-red-600 hover:text-red-700 transition-colors duration-200"
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </div>

                  {getYouTubeThumbnail(link.url) && (
                    <img
                      src={getYouTubeThumbnail(link.url)!}
                      alt="YouTube thumbnail"
                      className="w-full h-32 object-cover rounded-md mb-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#05141f] hover:text-[#171e22] text-sm font-medium block mb-2 truncate"
                  >
                    {link.url}
                  </a>

                  {link.addedBy && (
                    <p className="text-xs text-gray-500 mb-1">
                      Added by: {link.addedBy}
                    </p>
                  )}

                  {link.createdAt && (
                    <p className="text-xs text-gray-500">
                      {new Date(link.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No team links found. Upload your first link!
            </div>
          )}
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
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Uploaded By
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Created At
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
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
                        className="flex items-center gap-1 rounded-md bg-[#05141f] text-white px-3 py-1 text-xs font-medium hover:bg-[#171e22] transition-colors duration-200"
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

        {/* Link Upload Modal */}
        {showLinkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upload YouTube Link
                </h3>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05141f] focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadLink}
                  disabled={linkUploading || !linkUrl.trim()}
                  className="flex-1 px-4 py-2 bg-[#05141f] text-white rounded-lg hover:bg-[#171e22] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {linkUploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
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
