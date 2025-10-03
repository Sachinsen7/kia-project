"use client";

import React from "react";
import { X } from "lucide-react";

type BestPracticesProps = {
  onClose?: () => void;
};

function BestPractices({ onClose }: BestPracticesProps) {
  return (
    <div className="relative w-full min-h-screen bg-white p-6 md:p-30">
      {/* Cross Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={22} className="text-gray-600" />
        </button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

          <div className="h-1 w-12 bg-black mb-6 mt-20"></div>

          <div className="flex items-start gap-4 mt-32">
            <div className="w-24 h-24 border border-gray-400 flex items-center justify-center text-gray-500">
              Thumbnail
            </div>

            <div>
              <h2 className="text-lg font-semibold">KMX Case</h2>
              <p className="text-gray-600 text-sm mt-1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam.
              </p>
            </div>
          </div>

          <p className="text-gray-500 text-sm mt-6">* 추후 작성 예정</p>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="w-[400px] h-[300px] border border-gray-400 flex items-center justify-center text-gray-500"></div>
        </div>
      </div>
    </div>
  );
}

export default BestPractices;
