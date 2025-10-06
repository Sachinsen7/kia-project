"use client";

import React, { useEffect, useState } from "react";

const DesktopOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024); // 1024px is a common breakpoint for desktops
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (!isDesktop) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center p-6">
        <h1 className="text-xl font-semibold">
          This website is only available on desktop devices.
        </h1>
      </div>
    );
  }

  return <>{children}</>;
};

export default DesktopOnly;
