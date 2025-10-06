"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

type HistoryGOEFProps = {
  onClose?: () => void;
};

function HistoryGOEF({ onClose }: HistoryGOEFProps) {
  const images = [
    "/history/gallery-left.png",
    "/history/gallery-image.png",
    "/history/gallery-right.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full min-h-screen bg-white px-6 md:px-16 py-12">
      {/* Border Wrapper */}
      <div className="bg-white relative shadow-2xl rounded-2xl w-full max-w-6xl m-6 p-8 md:p-14">
        {/* Cross Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <Image
              width={22}
              height={22}
              src="/askkia/cross.png"
              alt="Close sidebar"
              className="cursor-pointer"
            />{" "}
          </button>
        )}
        {/* Heading */}
        <div className="w-full pt-6 pb-10 px-4 mt-10">
          <h1 className="text-3xl mt-10 md:text-5xl text-gray-900 mb-2 inline-block">
            History of
            {/* Vertical black bar flush with top */}
            <div className="w-[4px] h-[200px] text-[#000] bg-[#000] absolute top-0 left-19"></div>
          </h1>
          <h2 className="text-3xl md:text-5xl ml-40 font-bold">GOEF</h2>
        </div>

        {/* Content */}
        <div className="relative px-6 md:px-12 text-gray-700 leading-relaxed border-l border-r border-b border-gray-600">
          <div className="mb-52">
            <p className="mb-4">
              GOEF is a global forum where ownership leaders from around the
              world gather annually to share and discuss the business
              strategies, plans, and valuable insights for the coming year.
            </p>
            <p className="mb-4">
              After being held online due to the COVID-19 pandemic, the forum
              returned to an in-person, three-day event in Seoul last year,
              2024. Under the slogan{" "}
              <span className="italic">“Vision to Reality”</span>, it was a
              meaningful occasion where HQ and NSC ownership leaders came
              together to strengthen their network.
            </p>
            <p className="mb-4">
              Most importantly, it was a significant event that provided a
              chance to reflect deeply on ownership experience and customer
              value. This was achieved through special lectures on Kia’s brand
              strategy, core values, and customer experience, as well as an
              insightful field trip to key Kia sites and famous spots in Seoul.
            </p>
            <p>
              We look forward to meeting again in Seoul in the near future to
              further strengthen our ownership capabilities and become united in
              our vision.
            </p>

            <h2 className="text-center mt-5 text-[24px] mb-2 font-bold text-black">
              2024 GOEF HIGHLIGHT
            </h2>
          </div>

          {/* Big Highlight Image */}
          <Image
            src="/history/new-car.png"
            alt="2024 GOEF Highlight"
            width={1200}
            height={600}
            className="absolute  top-100 left-11 w-[90%] items-center mt-12 mb-20 h-auto object-cover"
          />
        </div>

        {/* Highlight Section */}
        <div className="text-center px-6 py-12 mt-30">
          <h2 className="text-3xl mt-10 md:text-5xl text-gray-900 mb-10">
            Gallery
          </h2>

          {/* Carousel */}
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
        </div>
      </div>
    </div>
  );
}

export default HistoryGOEF;
