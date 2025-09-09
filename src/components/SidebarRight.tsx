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
      {/* Hamburger Menu Button */}
      {!isOpen && (
        <Menu
          className="absolute top-5 right-4 cursor-pointer font-bold text-gray-900 bg-gray-300 z-50 p-2 rounded-lg hover:bg-gray-400 transition-colors sm:top-4 sm:right-3 sm:p-1"
          size={36}
          onClick={() => setIsOpen(true)}
        />
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
          {/* Login Button */}
          <div className="p-4 border-b border-gray-200">
            <button className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg w-[70%] hover:bg-gray-900 transition-colors sm:py-1 sm:px-3">
              Login
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-lg sm:text-base font-semibold mb-4 text-gray-800">
              Event Sections
            </h3>
            <div className="space-y-2">
              {links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onSelect(link.id);
                    setIsOpen(false); // close sidebar after click
                  }}
                  className="w-full text-left p-3 sm:p-2 rounded-lg transition-colors group hover:bg-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    {/* You can add Lucide icons here dynamically later */}
                    <div className="font-bold sm:text-xl  text-base text-gray-800 group-hover:text-[#b5513f] transition-colors">
                      {link.name}
                    </div>
                  </div>
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
