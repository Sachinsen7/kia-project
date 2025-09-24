"use client";

import React from "react";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 md:p-12">
      {/* Floating Card */}
      <div className="relative bg-white shadow-2xl rounded-2xl w-full max-w-6xl m-6 p-8 md:p-14">
        {/* Heading */}
        <h1 className="text-3xl ml-10 md:text-5xl text-gray-900 mb-2">
          WELCOME TO
        </h1>

        {/* Underline + 2025 */}
        <div className="ml-40 flex items-center">
          <div className="left-0 w-[240px] h-[4px] text-[#000] bg-[#000] absolute top-37"></div>
          <h2 className="text-4xl md:text-5xl text-gray-900">
            2025 <span className="font-bold">GOEF</span>
          </h2>
        </div>

        {/* Intro paragraphs - aligned end */}
        <div className="mt-20 flex justify-end">
          <div className="space-y-4 text-gray-700 leading-relaxed border-r-2 border-b-2 border-gray-300 pr-6 pb-6 max-w-3xl text-left">
            <p>
              We are pleased to invite you to the 2025 Global Ownership
              Experience Forum in recognition of your outstanding performance.
              This year’s event is a virtual conference designed to bring us
              together online.
            </p>
            <p>
              The forum provides in-depth insights into Kia’s 2026 business
              plans, ownership programs, customer experience strategies, and
              retention initiatives.
            </p>
            <p>
              We are excited to reconnect with you in the virtual space, share
              perspectives, and strengthen our lasting partnerships.
            </p>
            <p>
              Thank you for your continued dedication, and we look forward to
              your participation in the 2025 Global Ownership Experience Forum.
            </p>
          </div>
        </div>

        {/* Video section */}
        <div className="mt-20">
          <h2 className="text-base uppercase text-gray-500 tracking-wide mb-4 text-center">
            Greetings from the Vice President (or teaser video)
          </h2>
          <div className="w-full overflow-hidden rounded-xl shadow-md relative aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/q96KKjfwHEE?controls=0&modestbranding=1&rel=0&showinfo=0&autohide=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
