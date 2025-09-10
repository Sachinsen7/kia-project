import React from "react";

function About() {
  return (
    <div className="relative w-full min-h-screen bg-white p-6 md:p-30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            About 2025 GOEF
          </h1>
          <p className="text-gray-700 leading-relaxed mb-6">
            (텍스트 추후 구체화) Lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit.
          </p>

          <div className="mt-10 text-center">
            <h2 className="text-lg font-semibold mb-3">
              Vision to Reality for Sustainable Synergy <br />
              <span className="italic">“Synergy in Action”</span>
            </h2>
            <div className="w-full flex justify-center">
              <div className="w-72 h-72 border border-gray-400 flex items-center justify-center text-gray-500">
                Diagram / Image
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="w-[400px] h-[300px] border border-gray-400 flex items-center justify-center text-gray-500">
            {/* <img src="home/mike-hindle-AaWLB3r_hrg-unsplash.jpg" alt="" /> */}
          </div>
        </div>
      </div>

      <p className="mt-10 text-sm text-gray-600 text-right">* 구체화 예정</p>
    </div>
  );
}

export default About;
