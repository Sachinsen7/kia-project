import React from "react";

function Ownership() {
  return (
    <div className="relative w-full min-h-screen bg-white p-6 md:p-12">
      {/* Close Button */}
      <button className="absolute top-4 right-4 text-3xl font-bold text-gray-700 hover:text-black">
        ✕
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Content */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            2026 Ownership Strategy
          </h1>
          <p className="text-gray-700 leading-relaxed mb-6">
            (텍스트 추후 구체화) Lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit.
          </p>
        </div>

        {/* Right Image */}
        <div className="flex justify-center md:justify-end">
          <div className="w-48 h-48 border border-gray-400 flex items-center justify-center text-gray-500">
            Image
          </div>
        </div>
      </div>

      {/* Sub Section */}
      <div className="mt-12 flex flex-col md:flex-row items-start gap-6">
        {/* Thumbnail */}
        <div className="w-32 h-32 border border-gray-400 flex items-center justify-center text-gray-500">
          Thumbnail
        </div>

        {/* Text Content */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Basic Competency for Ownership
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam.
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-10 text-sm text-gray-600 text-right">
        * 세부 내용 공유가 필요합니다.
      </p>
    </div>
  );
}

export default Ownership;
