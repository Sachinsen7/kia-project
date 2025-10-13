"use client";
import Image from "next/image";
import React, { useState, useEffect, memo } from "react";

interface CarouselProps {
  images: string[];
  interval?: number;
}

const Carousel = memo(({ images, interval = 3000 }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  useEffect(() => {
    const autoSlide = setInterval(handleNext, interval);
    return () => clearInterval(autoSlide);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="flex items-center h-[400px]">
        <div
          className="relative w-[15%] h-full cursor-pointer"
          onClick={handlePrev}
        >
          <Image
            src="/history/gallery-left.png"
            alt="Left Panel"
            fill
            className="object-contain"
          />
        </div>
        <div className="relative w-[70%] h-full mx-4">
          <Image
            src={images[currentIndex]}
            alt={`GOEF Gallery ${currentIndex + 1}`}
            fill
            className="object-cover rounded-lg shadow-md"
          />
        </div>
        <div
          className="relative w-[15%] h-full cursor-pointer"
          onClick={handleNext}
        >
          <Image
            src="/history/gallery-right.png"
            alt="Right Panel"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
});

Carousel.displayName = "Carousel";
export default Carousel;
