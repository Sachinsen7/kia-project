"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

function HistoryGOEF() {
  const images = [
    "/history/gallery-left.png",
    "/history/gallery-image.png",
    "/history/gallery-right.png",
  ];

  // Duplicate for seamless infinite loop
  const loopImages = [...images, ...images];
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
        {/* Heading */}
        <div className="w-full pt-6 pb-10 px-4 mt-10">
          <h1 className="text-3xl mt-10 md:text-5xl text-gray-900 mb-2 inline-block">
            HISTORY OF
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

            <h2 className="text-center mt-20 text-[24px] font-bold text-gray-400">
              2024 GOEF HIGHLIGHT
            </h2>
          </div>

          {/* Big Highlight Image */}
          <Image
            src="/about/main-image.png"
            alt="2024 GOEF Highlight"
            width={1200}
            height={600}
            className="absolute top-100 left-11 w-[90%] items-center mt-10 mb-20 h-auto object-cover"
          />
        </div>

        {/* Highlight Section */}
        <div className="text-center px-6 py-12 mt-96">
          <h2 className="text-3xl mt-10 md:text-5xl text-gray-900 mb-10">
            Gallery
          </h2>

          {/* Carousel */}
          <div className="relative w-full max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${
                    currentIndex * (100 / images.length)
                  }%)`,
                  width: `${(loopImages.length / images.length) * 100}%`,
                }}
              >
                {loopImages.map((src, index) => (
                  <div
                    key={index}
                    className="w-1/3 flex-shrink-0 flex justify-center"
                  >
                    <Image
                      src={src}
                      alt={`GOEF Gallery ${index + 1}`}
                      width={300}
                      height={200}
                      className="rounded-lg shadow-md object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2"
            >
              <Image
                src="/history/left_opacity.png"
                alt="Previous"
                width={50}
                height={50}
                className="object-contain"
              />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
            >
              <Image
                src="/history/right_opacity.png"
                alt="Next"
                width={50}
                height={50}
                className="object-contain"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryGOEF;
