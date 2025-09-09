"use client";

import { useState, useRef, useEffect } from "react";
import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";
import CityScene from "@/components/CityScene";

export default function HomePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

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
      <main className="w-full h-full">
        <CityScene onSelect={setSelectedId} />
      </main>

      <div ref={sidebarRef}>
        <SidebarLeft
          selectedId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      </div>

      <SidebarRight onSelect={setSelectedId} />
    </div>
  );
}
