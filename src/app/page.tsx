"use client";
import { useState } from "react";
import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";
import CityScene from "@/components/CityScene";

export default function HomePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Main Content - Full Screen Video */}
      <main className="w-full h-full">
        <CityScene onSelect={setSelectedId} />
      </main>

      {/* Left Sidebar - Slides in when link is clicked */}
      <SidebarLeft
        selectedId={selectedId}
        onClose={() => setSelectedId(null)}
      />

      {/* Right Sidebar - Always visible with navigation */}
      <SidebarRight onSelect={setSelectedId} />
    </div>
  );
}
