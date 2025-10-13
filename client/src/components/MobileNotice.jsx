"use client";
import { useEffect, useState } from "react";

export default function MobileNotice() {
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileCheck = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent.toLowerCase()
    );
    
    // Debug logging
    console.log("User Agent:", userAgent);
    console.log("Is Mobile:", mobileCheck);
    
    setIsMobile(mobileCheck);

    const dismissedBefore = localStorage.getItem("mobileNoticeDismissed");
    if (dismissedBefore === "true") {
      setDismissed(true);
    }
    
    setIsLoaded(true);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("mobileNoticeDismissed", "true");
  };

  if (!isLoaded || !isMobile || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white text-center p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Best viewed on desktop
      </h2>
      <p className="text-gray-600 max-w-sm mb-6">
        This website is best viewed on a desktop.
        Please switch to a dekstop device for the best viewing experience.
      </p>
      <button
        onClick={handleDismiss}
        className="mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
      >
        Continue on mobile
      </button>
    </div>
  );
}
