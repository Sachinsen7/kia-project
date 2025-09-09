"use client";
import { createContext, useState, ReactNode } from "react";

type CityContextType = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
};

export const CityContext = createContext<CityContextType | undefined>(
  undefined
);

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <CityContext.Provider value={{ selectedId, setSelectedId }}>
      {children}
    </CityContext.Provider>
  );
}
