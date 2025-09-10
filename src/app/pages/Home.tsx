import React from "react";

function Home() {
  return (
    <div className="relative w-full min-h-screen bg-white p-6 md:p-16">
      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Welcome to 2025 GOEF
        </h1>

        {/* Intro paragraphs */}
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            We are pleased to invite you to the 2025 Global Ownership Experience
            Forum in recognition of your outstanding performance. This year’s
            event is a virtual conference designed to bring us together online.
          </p>
          <p>
            The forum provides in-depth insights into Kia’s 2026 business plans,
            ownership programs, customer experience strategies, and retention
            initiatives.
          </p>
          <p>
            We are excited to reconnect with you in the virtual space, share
            perspectives, and strengthen our lasting partnerships.
          </p>
          <p>
            Thank you for your continued dedication, and we look forward to your
            participation in the 2025 Global Ownership Experience Forum.
          </p>
        </div>

        {/* Divider */}
        <div className="w-16 h-1 bg-black mt-10 mb-8"></div>

        {/* Video section */}
        <div className="text-center">
          <h2 className="text-lg font-medium mb-4">
            Greetings from the Vice President (or teaser video)
          </h2>
          <div className="w-full max-w-xl mx-auto h-64 md:h-80 bg-black flex items-center justify-center">
            <span className="text-white text-5xl">▶</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
