"use client";

import { useState } from "react";
import { links } from "@/app/data/Links";
import {
  X,
  Menu,
  MapPin,
  Home,
  Info,
  Target,
  BookOpen,
  Users,
  TrendingUp,
  Archive,
  MessageCircle,
  Lightbulb,
  LifeBuoy,
} from "lucide-react";

type SidebarRightProps = {
  onSelect: (id: string) => void;
};

export default function SidebarRight({ onSelect }: SidebarRightProps) {
  const [isOpen, setIsOpen] = useState(true); // sidebar open by default

  return (
    <>
      {/* Menu button (shows only when sidebar is closed) */}
      {!isOpen && (
        <Menu
          className="absolute top-4 right-4 cursor-pointer text-white z-20 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
          size={24}
          onClick={() => setIsOpen(true)}
        />
      )}

      {/* Sidebar */}
      {isOpen && (
        <aside className="fixed top-0 right-0 h-full w-96 bg-white/95 backdrop-blur-sm text-black shadow-2xl z-10 transition-transform">
          {/* Close button */}
          <X
            className="absolute top-4 right-4 cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
            size={40}
            onClick={() => setIsOpen(false)}
          />

          {/* Content */}
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <button className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg w-[70%] hover:bg-gray-900 transition-colors">
                Login
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Event Sections
              </h3>
              <div className="space-y-2">
                {links.map((link) => {
                  return (
                    <button
                      key={link.id}
                      onClick={() => onSelect(link.id)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-medium text-gray-800">
                            {link.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {link.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                Click on any section to learn more
              </p>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
