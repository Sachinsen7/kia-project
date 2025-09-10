"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type DashboardProps = {
  onClose?: () => void;
};

import Image from "next/image";

export default function Dashboard({ onClose }: DashboardProps) {
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [teamLinks, setTeamLinks] = useState<string[]>([]);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [contentViews, setContentViews] = useState<number>(0);

  const [newVideo, setNewVideo] = useState("");
  const [newTeamLink, setNewTeamLink] = useState("");

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploaded = Array.from(e.target.files);
      setImages([...images, ...uploaded]);
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Handle Video
  const handleAddVideo = () => {
    if (newVideo.trim() === "") return;
    setVideos([...videos, newVideo]);
    setNewVideo("");
  };
  const handleDeleteVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  // Handle Team Links
  const handleAddTeam = () => {
    if (newTeamLink.trim() === "") return;
    setTeamLinks([...teamLinks, newTeamLink]);
    setNewTeamLink("");
  };
  const handleDeleteTeam = (index: number) => {
    setTeamLinks(teamLinks.filter((_, i) => i !== index));
  };

  // Metrics: visitors and content views
  useEffect(() => {
    try {
      const v = Number(localStorage.getItem("dashboard_visitors") || "0") + 1;
      localStorage.setItem("dashboard_visitors", String(v));
      setVisitorCount(v);

      const c = Number(localStorage.getItem("dashboard_content_views") || "0");
      setContentViews(c);
    } catch {}
  }, []);

  const incrementContentViews = () => {
    try {
      const next = contentViews + 1;
      setContentViews(next);
      localStorage.setItem("dashboard_content_views", String(next));
    } catch {}
  };

  return (
    <div className="fixed top-0 left-0 h-full w-[90%]  bg-white text-gray-900 shadow-2xl transition-transform duration-300 z-50 overflow-y-auto sidebar-slide-in border-r border-gray-200 p-6 md:p-30">
      {/* Close Button */}
      {onClose && (
        <X
          className="absolute top-4 right-4 cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors sm:top-3 sm:right-3 text-black"
          size={36}
          onClick={onClose}
        />
      )}

      <h1 className="text-2xl text-black font-bold mb-2">Content Management</h1>
      <div className="mb-6 flex items-center gap-4 text-sm text-gray-700">
        <span className="px-3 py-1 rounded bg-gray-100">
          Visitors: {visitorCount}
        </span>
        <span className="px-3 py-1 rounded bg-gray-100">
          Content views: {contentViews}
        </span>
      </div>

      {/* Images Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-black">Images</h2>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="mb-4"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((file, index) => (
            <div
              key={index}
              className="relative border rounded-lg overflow-hidden"
            >
              <Image
                src={URL.createObjectURL(file)}
                alt="uploaded"
                className="w-full h-32 object-cover"
                onClick={incrementContentViews}
              />
              <button
                onClick={() => handleDeleteImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs hover:bg-red-600"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Videos Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-black">Videos</h2>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={newVideo}
            onChange={(e) => setNewVideo(e.target.value)}
            placeholder="Enter video link..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-black"
          />
          <button
            onClick={handleAddVideo}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
        <ul className="space-y-3">
          {videos.map((video, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg"
            >
              <a
                href={video}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                onClick={incrementContentViews}
              >
                {video}
              </a>
              <button
                onClick={() => handleDeleteVideo(index)}
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Team Links Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-black">Team Links</h2>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={newTeamLink}
            onChange={(e) => setNewTeamLink(e.target.value)}
            placeholder="Enter team link..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-black"
          />
          <button
            onClick={handleAddTeam}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Add
          </button>
        </div>
        <ul className="space-y-3">
          {teamLinks.map((link, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg"
            >
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
                onClick={incrementContentViews}
              >
                {link}
              </a>
              <button
                onClick={() => handleDeleteTeam(index)}
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
