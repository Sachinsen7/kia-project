"use client";

import { useState } from "react";
import { links } from "@/app/data/Links";
import { X, Menu } from "lucide-react";

type SidebarRightProps = {
  onSelect: (id: string) => void;
};

export default function SidebarRight({ onSelect }: SidebarRightProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top-right controls (outside the sidebar) */}
      {!isOpen && (
        <div className="absolute top-5 right-4 z-50 flex items-center gap-3 sm:top-4 sm:right-3">
          <button className="bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg hover:bg-black transition-colors sm:text-sm sm:px-3 sm:py-1.5">
            Login
          </button>
          <Menu
            className="cursor-pointer font-bold text-gray-900 bg-gray-300 p-2 rounded-lg hover:bg-gray-400 transition-colors sm:p-1"
            size={36}
            onClick={() => setIsOpen(true)}
          />
        </div>
      )}

      {/* Sidebar */}
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
        {/* Close Button */}
        <X
          className="absolute top-4 right-4 cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors sm:top-3 sm:right-3"
          size={36}
          onClick={() => setIsOpen(false)}
        />

        <div className="flex flex-col h-full">
          {/* Header spacer */}
          <div className="p-4 border-b border-gray-200"></div>

          {/* Links */}
          {/* Links */}
          <div className="flex-1 p-4">
            <div className="space-y-2">
              <h3 className="text-lg sm:text-base font-semibold pl-4 mb-4 text-gray-800 text-start">
                Event Sections
              </h3>
              {["welcome", "about", "strategy", "best-practices", "ask-kia"]
                .map((id) => links.find((l) => l.id === id))
                .filter(Boolean)
                .map((link) => (
                  <button
                    key={link!.id}
                    onClick={() => {
                      onSelect(link!.id);
                      setIsOpen(false);
                    }}
                    className="w-full px-6 py-3 sm:px-4 sm:py-2 rounded-lg transition-colors group hover:bg-gray-200 flex items-center justify-between"
                  >
                    <span className="text-base sm:text-sm font-medium text-gray-800 group-hover:text-[#b5513f] transition-colors">
                      {link!.name}
                    </span>
                  </button>
                ))}
            </div>
          </div>


          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs sm:text-[10px] text-gray-500 text-center">
              Click on any section to learn more
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
