import React from "react";

function Ownership() {
  return (
    <div className="relative w-full min-h-screen bg-white p-6 md:p-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
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

        <div className="flex justify-center md:justify-end">
          <div className="w-[400px] h-[300px] border border-gray-400 flex items-center justify-center text-gray-500">
            {/* <img src="home/chris-weiher-mbaV1bo-_l0-unsplash.jpg" alt="" /> */}
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col md:flex-row items-start gap-6">
        <div className="w-32 h-32 border border-gray-400 flex items-center justify-center text-gray-500">
          Thumbnail
        </div>

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

      <p className="mt-10 text-sm text-gray-600 text-right">
        * 세부 내용 공유가 필요합니다.
      </p>
    </div>
  );
}

export default Ownership;
