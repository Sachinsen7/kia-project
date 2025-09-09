import React from "react";

function BestPractices() {
  return (
    <div className="relative w-full min-h-screen bg-white p-6 md:p-12">
      {/* Close Button */}
      <button className="absolute top-4 right-4 text-3xl font-bold text-gray-700 hover:text-black">
        ✕
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Content */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Best Practices
          </h1>
          <p className="text-gray-700 leading-relaxed mb-6">
            (텍스트 추후 구체화) Lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat.
          </p>

          {/* Divider */}
          <div className="h-1 w-12 bg-black mb-6"></div>

          {/* KMX Case */}
          <div className="flex items-start gap-4">
            {/* Thumbnail */}
            <div className="w-24 h-24 border border-gray-400 flex items-center justify-center text-gray-500">
              Thumbnail
            </div>

            {/* Text */}
            <div>
              <h2 className="text-lg font-semibold">KMX Case</h2>
              <p className="text-gray-600 text-sm mt-1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam.
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-gray-500 text-sm mt-6">* 추후 작성 예정</p>
        </div>

        {/* Right Image */}
        <div className="flex justify-center md:justify-end">
          <div className="w-48 h-48 border border-gray-400 flex items-center justify-center text-gray-500">
            Image
          </div>
        </div>
      </div>
    </div>
  );
}

export default BestPractices;
