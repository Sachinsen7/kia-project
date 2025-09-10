"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

type DashboardProps = {
  onClose?: () => void;
};

export default function Dashboard({ onClose }: DashboardProps) {
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [teamLinks, setTeamLinks] = useState<string[]>([]);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [contentViews, setContentViews] = useState<number>(0);

  const [newVideo, setNewVideo] = useState("");
  const [newTeamLink, setNewTeamLink] = useState("");

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploaded = Array.from(e.target.files);
      setImages((prev) => [...prev, ...uploaded]);
    }
  };

  const handleDeleteImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const handleAddVideo = () => {
    if (!newVideo.trim()) return;
    setVideos((prev) => [...prev, newVideo.trim()]);
    setNewVideo("");
  };

  const handleDeleteVideo = (index: number) =>
    setVideos((prev) => prev.filter((_, i) => i !== index));

  const handleAddTeam = () => {
    if (!newTeamLink.trim()) return;
    setTeamLinks((prev) => [...prev, newTeamLink.trim()]);
    setNewTeamLink("");
  };

  const handleDeleteTeam = (index: number) =>
    setTeamLinks((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="fixed top-0 left-0 h-full w-[90%] bg-white text-gray-900 shadow-2xl transition-transform duration-300 z-50 overflow-y-auto sidebar-slide-in border-r border-gray-200 p-6 md:p-10">
      {onClose && (
        <X
          className="absolute top-4 right-4 cursor-pointer p-1 hover:bg-gray-100 rounded-full text-black"
          size={36}
          onClick={onClose}
        />
      )}

      <h1 className="text-2xl font-bold mb-4 text-black">Content Management</h1>

      <div className="mb-6 flex gap-4 text-sm text-gray-700">
        <span className="px-3 py-1 bg-gray-100 rounded">
          Visitors: {visitorCount}
        </span>
        <span className="px-3 py-1 bg-gray-100 rounded">
          Content views: {contentViews}
        </span>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-black">Images</h2>

        <label className="flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg h-32 bg-gray-50 hover:bg-gray-100 transition">
          <span className="text-gray-500">Click to upload images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {images.map((file, index) => (
              <div
                key={index}
                className="relative group border rounded-lg overflow-hidden shadow-sm"
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt="uploaded"
                  className="w-full h-32 object-cover"
                  width={150}
                  height={150}
                  onClick={incrementContentViews}
                />

                <button
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-black">Videos</h2>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={newVideo}
            onChange={(e) => setNewVideo(e.target.value)}
            placeholder="https://example.com/video"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          />
          <button
            onClick={handleAddVideo}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Video
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

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-black">Team Links</h2>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={newTeamLink}
            onChange={(e) => setNewTeamLink(e.target.value)}
            placeholder="https://example.com/team"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          />
          <button
            onClick={handleAddTeam}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + Add Link
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
