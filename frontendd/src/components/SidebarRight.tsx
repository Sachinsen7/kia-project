"use client";

import { useState } from "react";
import { links } from "@/app/data/Links";
import { X, Menu } from "lucide-react";
import Link from "next/link";
import Dashboard from "@/app/pages/Dashboard";

type SidebarRightProps = {
  onSelect: (id: string) => void;
};

export default function SidebarRight({ onSelect }: SidebarRightProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <>
      {/* Sidebar Menu Button */}
      {!isOpen && !showDashboard && (
        <div className="absolute top-5 right-4 z-50">
          <Menu
            className="cursor-pointer text-gray-900 bg-gray-300 p-2 rounded-lg hover:bg-gray-400 transition-colors"
            size={36}
            onClick={() => setIsOpen(true)}
          />
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed top-0 right-0 h-full
          w-[80%] sm:w-[60%] md:w-[40%] lg:w-[30%]
          p-6 sm:p-8 md:p-10
          bg-[#e7e5e6] backdrop-blur-sm text-black shadow-2xl z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <X
            className="cursor-pointer text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            size={36}
            onClick={() => setIsOpen(false)}
          />
          <div className="flex gap-4">
            <Link href={"/login"}>
              <button className="bg-gray-900 text-white font-bold px-4 py-2 rounded hover:bg-black transition">
                Login
              </button>
            </Link>
            <button className="bg-gray-900 text-white font-bold px-4 py-2 rounded hover:bg-black transition">
              Logout
            </button>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-6">Event Sections</h3>

        <div className="flex flex-col gap-3">
          {[
            "welcome",
            "about",
            "strategy",
            "best-practices",
            "ask-kia",
            "help-support",
            "history-goef",
            "dashboard",
          ]
            .map((id) => links.find((l) => l.id === id))
            .filter(Boolean)
            .map((link) => (
              <button
                key={link!.id}
                onClick={() => {
                  onSelect(link!.id);
                  setIsOpen(false);
                }}
                className="w-full text-left px-6 py-3 rounded-lg font-bold text-gray-800 hover:bg-gray-300 transition"
              >
                {link!.name}
              </button>
            ))}
        </div>

        <div className="mt-auto pt-6 border-t border-gray-300">
          <p className="text-sm text-gray-500">
            Click on any section to learn more
          </p>
        </div>
      </aside>

      {/* Dashboard Page */}
      {showDashboard && <Dashboard onClose={() => setShowDashboard(false)} />}
    </>
  );
}
