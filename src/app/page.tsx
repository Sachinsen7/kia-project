"use client";

import Image from "next/image";
import CityScene from "@/components/CityScene";
import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";
import { CityContext } from "./context/CityContext";
import { useContext } from "react";

export default function Home() {
  const cityCtx = useContext(CityContext);

  if (!cityCtx) return null;

  const { selectedId, setSelectedId } = cityCtx;

  return (
    <main className="flex h-screen">
      {/* Left sidebar shows details of selectedId */}
      <SidebarLeft selectedId={selectedId} />

      {/* 3D City Scene (click to select items) */}
      <div className="flex-1 relative">
        <CityScene onSelect={setSelectedId} />
      </div>

      {/* Right sidebar with links to select */}
      <SidebarRight onSelect={setSelectedId} />
    </main>
  );
}
