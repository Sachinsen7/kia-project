"use client";
import { useState, useRef, useEffect } from "react";
import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";
import CityScene from "@/components/CityScene";

export default function HomePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSelectedId(null);
      }
    }

    if (selectedId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedId]);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Main Content - Full Screen Video */}
      <main className="w-full h-full">
        <CityScene onSelect={setSelectedId} />
      </main>

      {/* Left Sidebar - Slides in when link is clicked */}
      <div ref={sidebarRef}>
        <SidebarLeft
          selectedId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      </div>

      {/* Right Sidebar - Always visible with navigation */}
      <SidebarRight onSelect={setSelectedId} />
    </div>
  );
}
