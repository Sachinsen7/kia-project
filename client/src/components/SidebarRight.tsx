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
      {!isOpen && !showDashboard && (
        <div className="absolute top-5 right-4 z-50">
          <Menu
            className="cursor-pointer text-gray-900 bg-gray-300 p-2 rounded-lg hover:bg-gray-400 transition-colors"
            size={36}
            onClick={() => setIsOpen(true)}
          />
        </div>
      )}

      <aside
        className={`
          fixed top-0 right-0 h-full
          w-[80%] sm:w-[60%] md:w-[60%] lg:w-[25%]
          p-6 sm:p-8 md:p-10
          bg-[#e7e5e6] backdrop-blur-sm text-black shadow-2xl z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <X
            className="cursor-pointer text-gray-900 stroke-3 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            size={50}
            onClick={() => setIsOpen(false)}
          />
          <Link href="/login">
            <button className="bg-gray-900 text-white font-bold px-10 cursor-pointer py-2 rounded-full hover:bg-black transition">
              Login
            </button>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-3">
          {[
            "welcome",
            "about",
            "strategy",
            "best-practices",
            "ask-kia",
            "help-support",
            "history-goef",
            "event",
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
                className="w-full text-left text-lg px-6 py-3 rounded-lg font-extrabold text-gray-800 hover:bg-gray-300 transition"
              >
                {link!.name}
              </button>
            ))}
        </div>
      </aside>

      {/* Dashboard Page */}
      {showDashboard && <Dashboard onClose={() => setShowDashboard(false)} />}
    </>
  );
}
