import Image from "next/image";

import React from "react";

function HistoryGOEF() {
  return (
    <div className="relative w-full min-h-screen bg-white p-6 md:p-16">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6">History of GOEF</h1>

        {/* Intro Text */}
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            GOEF is a global forum where ownership leaders from around the world
            gather annually to share and discuss the business strategies, plans,
            and valuable insights for the coming year.
          </p>
          <p>
            After being held online due to the COVID-19 pandemic, the forum
            returned to an in-person, three-day event in Seoul last year, 2024.
            Under the slogan &quot;Vision to Reality,&quot; it was a meaningful
            occasion... where HQ and NSC ownership leaders came together to
            strengthen their network.
          </p>
          <p>
            Most importantly, it was a significant event that provided a chance
            to reflect deeply on ownership experience and customer value. This
            was achieved through special lectures on Kia’s brand strategy, core
            values, and customer experience, as well as an insightful field trip
            to key Kia sites and famous spots in Seoul.
          </p>
          <p>
            We look forward to meeting again in Seoul in the near future to
            further strengthen our ownership capabilities and become united in
            our vision.
          </p>
        </div>

        {/* Divider */}
        <div className="w-16 h-1 bg-black mt-10 mb-8"></div>

        {/* Highlight Video */}
        <div className="text-center mb-12">
          <h2 className="text-lg font-medium mb-4">2024 GOEF Highlight</h2>
          <div className="w-full max-w-xl mx-auto h-64 md:h-80 bg-black flex items-center justify-center">
            <span className="text-white text-5xl">▶</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="text-center">
          <h2 className="text-lg font-medium mb-4">Gallery</h2>
          <div className="w-full max-w-2xl mx-auto">
            <Image
              src="/images/gallery1.jpg" // replace with your image path
              alt="GOEF Gallery"
              className="w-full rounded-md shadow-md"
            />
            {/* Add slider controls if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryGOEF;
