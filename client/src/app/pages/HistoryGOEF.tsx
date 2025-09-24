"use client";

import Image from "next/image";
import React from "react";

function HistoryGOEF() {
  return (
    <div className="relative w-full min-h-screen bg-white px-6 md:px-16 py-12">
      {/* Border Wrapper */}
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-6xl m-6 p-8 md:p-14">
        {/* Heading */}
        <div className="relative w-full pt-6 pb-10 px-4 mt-10">
          <h1 className="text-3xl mt-10 md:text-5xl text-gray-900 mb-2">
            HISTORY OF
          </h1>
          <div className="w-[4px] h-[70px] text-[#000] bg-[#000] absolute top-0 left-5"></div>
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
          </div>

          {/* Big Highlight Image */}
          <Image
            src="/about/main-image.png" // replace with your highlight image
            alt="2024 GOEF Highlight"
            width={1200}
            height={600}
            className="absolute top-70 left-11 w-[90%] items-center mt-10 mb-20 h-auto object-cover rounded-xl"
          />
        </div>

        {/* Highlight Section */}
        <div className="text-center px-6 py-12 mt-96">
          {/* Gallery */}
          <div className="text-center mt-20">
            <h2 className="text-lg font-medium mb-6">Gallery</h2>
            <div className="flex justify-center gap-6 flex-wrap">
              <Image
                src="/history/gallery-left.png"
                alt="GOEF Gallery 1"
                width={300}
                height={200}
                className="rounded-lg shadow-md object-cover"
              />
              <Image
                src="/history/gallery-image.png"
                alt="GOEF Gallery 2"
                width={300}
                height={200}
                className="rounded-lg shadow-md object-cover"
              />
              <Image
                src="/history/gallery-right.png"
                alt="GOEF Gallery 3"
                width={300}
                height={200}
                className="rounded-lg shadow-md object-cover"
              />
            </div>

            <div>
              <Image
                src="/history/gallery-image.png"
                alt="GOEF Gallery 2"
                width={300}
                height={200}
                className="rounded-lg shadow-md object-cover"
              />
              <Image
                src="/history/gallery-image.png"
                alt="GOEF Gallery 2"
                width={300}
                height={200}
                className="rounded-lg shadow-md object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryGOEF;
