import React from "react";

function Home() {
  return (
    <div className="relative w-full min-h-screen bg-white p-6 md:p-30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Content */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Welcome to 2025GOEF
          </h1>
          <p className="text-gray-700 leading-relaxed mb-6">
            (텍스트 추후 구체화) Lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit.
          </p>

          {/* Video Section */}
          <div className="mt-30">
            <h2 className=" font-bold mb-3 text-3xl">
              Greetings from Vice President
            </h2>
            <div className="w-full h-56 md:h-64 bg-black flex items-center justify-center">
              <span className="text-white text-4xl">▶</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center md:justify-end">
          <div className="w-[400px] h-[300px] border border-gray-400 flex items-center justify-center text-gray-500">
            <img src="/home/tanya-barrow-R44XmoKobV4-unsplash.jpg" alt="" />
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-10 text-sm text-gray-600 text-right">
        * 웰컴 메세지로 구성예정
      </p>
    </div>
  );
}

export default Home;
