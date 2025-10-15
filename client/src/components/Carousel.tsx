"use client";
import Image from "next/image";
import React, { useState, useEffect, memo } from "react";

interface CarouselProps {
  images: string[];
  interval?: number;
}

const Carousel = memo(({ images, interval = 3000 }: CarouselProps) => {
  // Filter out invalid or empty image paths
  const validImages = images.filter(img => img && img.trim() !== '');
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  useEffect(() => {
    if (interval > 0) {
      const autoSlide = setInterval(handleNext, interval);
      return () => clearInterval(autoSlide);
    }
  }, [interval, handleNext]);


  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative h-[400px]">
        {/* Main image */}
        <div className="relative w-full h-full">
          {validImages.length > 0 && validImages[currentIndex] ? (
            <Image
              src={validImages[currentIndex]}
              alt={`GOEF Gallery ${currentIndex + 1}`}
              fill
              className="object-cover rounded-lg shadow-md"
              onError={(e) => {
                console.error("Image failed to load:", validImages[currentIndex]);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
              <span className="text-gray-500">Image not available</span>
            </div>
          )}
        </div>

        {/* Left arrow button */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 z-10"
          aria-label="Previous image"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Right arrow button */}
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 z-10"
          aria-label="Next image"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Dots indicator */}
      {validImages.length > 0 && (
        <div className="flex justify-center mt-6 space-x-2">
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${currentIndex === index ? "bg-black" : "bg-gray-300 hover:bg-gray-400"
                }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

Carousel.displayName = "Carousel";
export default Carousel;
