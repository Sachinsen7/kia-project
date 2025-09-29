"use client";

import { useState, useEffect } from "react";
import { links } from "@/app/data/Links";
import { X, Menu, User } from "lucide-react";
import Link from "next/link";
import Dashboard from "@/app/pages/Dashboard";

type SidebarRightProps = {
  onSelect: (id: string) => void;
};

export default function SidebarRight({ onSelect }: SidebarRightProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.error("Invalid user JSON in localStorage");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsOpen(false);
  };

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
     text-black shadow-2xl z-40
      bg-gray-200
    transform transition-transform duration-300 ease-in-out
    flex flex-col
    overflow-hidden  
    ${isOpen ? "translate-x-0" : "translate-x-full"}
  `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <X
            className="cursor-pointer text-gray-900 stroke-3 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            size={50}
            onClick={() => setIsOpen(false)}
          />

          {token ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white font-bold px-6 py-2 rounded-full hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <Link href="/login">
              <button className="bg-gray-900 text-white font-bold px-10 cursor-pointer py-2 rounded-full hover:bg-black transition">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-3 flex-grow">
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

        {token && (
          <div className="mt-auto flex items-center gap-3 border-t pt-4">
            <User
              className="text-gray-700 bg-gray-200 p-2 rounded-full"
              size={40}
            />
            <span className="font-semibold text-gray-800 text-lg">
              {user ? `${user.firstName} ${user.lastName}` : "User"}
            </span>
          </div>
        )}
      </aside>

      {/* Dashboard Page */}
      {showDashboard && <Dashboard onClose={() => setShowDashboard(false)} />}
    </>
  );
}
