"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

type AboutProps = {
  onClose?: () => void;
};

function About({ onClose }: AboutProps) {
  return (
    <div className="w-full min-h-screen bg-white px-6 md:px-12 py-12">
      <div className="bg-white relative shadow-2xl rounded-2xl w-full max-w-6xl m-6 p-8 md:p-12">
        {/* Cross Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            {" "}
            <Image
              width={22}
              height={22}
              src="/askkia/cross.png"
              alt="Close sidebar"
              className="cursor-pointer"
            />
          </button>
        )}
        <Image
          width={800}
          height={22}
          src="/Group 106.png"
          alt="Close sidebar"
          className="cursor-pointer mb-6  "
        />{" "}
        {/* Content */}
        <div className="relative px-6 md:px-12 text-gray-700 leading-relaxed border-l  border-r  border-gray-500">
          <div className="mb-32">
            <p className="mb-4">
              The 2025 GOEF focuses on establishing a sustainable ownership
              ecosystem, aligning with the goal of Vision to Reality. This forum
              will be a venue for sharing ownership business strategies and
              exchanging valuable insights from each region.
            </p>
            <p className="mb-4">
              This year&apos;s GOEF has been planned based on a customer-centric
              differentiation strategy. It will cover various business plans and
              programs designed to enhance the customer ownership experience and
              loyalty, ultimately maximizing profitability for NSC, dealers, and
              Kia.
            </p>
            <p className="mb-1">
              Under the slogan{" "}
              <span className="italic">“Synergy in Action”</span>, and with a
              customer-centric mindset, we aim to connect Kia and its customers.
              By fostering close collaboration between HQ, NSC, and Dealers, we
              will achieve “synergy in action” on the ground, creating special
              value and unique experiences for our Kia customers.
            </p>
          </div>

          {/* Quote & Diagram */}
        </div>
        <div className="text-center mx-auto max-w-2xl z-500 px-6 py-2 ">
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Top-left opening braces */}
            <Image
              src="/about/Kia GOEF 2025/Vector-1.png"
              alt="Top Left"
              width={50}
              height={50}
              className="absolute -top-6 -left-6"
            />
            {/* Bottom-right closing braces */}
            <Image
              src="/about/Kia GOEF 2025/Vector.png"
              alt="Bottom Right"
              width={50}
              height={50}
              className="absolute -top-16 -right-6"
            />
            {/* Right & Bottom border */}
            <Image
              src="/about/Kia GOEF 2025/Vector 2.png"
              alt="Right Bottom Border"
              width={120}
              height={120}
              className="absolute -bottom-8 -right-6"
            />
            {/* Left & Top border */}
            <Image
              src="/about/Kia GOEF 2025/Vector 3.png"
              alt="Left Top Border"
              width={120}
              height={120}
              className="absolute -top-20 -left-6"
            />

            {/* Quote Message */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <h3 className="text-lg md:text-2xl font-semibold text-gray-800">
                Vision to Reality for Sustainable Synergy <br />
                <span className="italic">“Synergy in Action”</span>
              </h3>
            </div>
          </div>

          {/* Diagram */}
          <div className="flex justify-center mt-30">
            <Image
              src="/about/diagram.png"
              alt="Vision Diagram"
              width={400}
              height={300}
              className="w-72 md:w-[400px] object-contain"
            />
          </div>
        </div>
        {/* Table Section */}
        <div className="mt-20">
          <h2 className="text-2xl md:text-3xl underline font-bold mb-6 text-gray-900">
            2025 GOEF Schedule
          </h2>

          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 text-left text-sm md:text-base">
              <thead className="bg-gray-200">
                <tr>
                  <th
                    className="border-x border-t border-gray-500 px-4 py-2 text-center"
                    colSpan={2}
                  >
                    Time
                  </th>
                  <th
                    className="border-x border-t border-gray-500 px-4 py-2 text-center"
                    colSpan={2}
                  >
                    Title & Content
                  </th>
                </tr>
                <tr>
                  <th className="border border-gray-500 px-4 py-2 text-center">
                    AM
                  </th>
                  <th className="border border-gray-500 px-4 py-2 text-center">
                    PM
                  </th>
                  <th className="border-r border-b border-gray-500 px-4 py-2 text-center"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    07:00 - 07:20
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    16:00 - 16:20
                  </td>
                  <td className="border px-4 py-2" colSpan={2}>
                    <strong>Opening</strong>
                    <br />• Opening Speech
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    07:20 - 08:00
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    16:20 - 17:00
                  </td>
                  <td className="border px-4 py-2" colSpan={2}>
                    <strong>Kia HQ Key Projects</strong>
                    <br />
                    • Ownership Dealer Standard Renewal Project
                    <br />
                    • Advancing Global Service Retention Management
                    <br />• Dealer Service Capacity Reinforcement
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    08:00 - 08:40
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    17:00 - 17:40
                  </td>
                  <td className="border px-4 py-2" colSpan={2}>
                    <strong>Kia HQ Business Plans</strong>
                    <br />• 2026 Key Business Plans on the Ownership Mission
                    (BDDS)
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    08:40 - 08:50
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    17:40 - 17:50
                  </td>
                  <td className="border px-4 py-2" colSpan={2}>
                    • Break Time
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    08:50 - 09:10
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    17:50 - 18:10
                  </td>
                  <td className="border px-4 py-2" colSpan={2}>
                    <strong>Best Practice</strong>
                    <br />• RHQ/NSC Best Practices
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    09:10 - 09:40
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    18:10 - 18:40
                  </td>
                  <td className="border px-4 py-2" colSpan={2}>
                    <strong>Panel Talk</strong>
                    <br />• Panel Q&A Session
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    09:40 - 09:50
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    18:40 - 18:50
                  </td>
                  <td className="border px-4 py-2" colSpan={2}>
                    <strong>Awards</strong>
                    <br />• Awards Ceremony for Excellent RHQ / NSCs
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    09:50 - 10:10
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    18:50 - 19:10
                  </td>
                  <td className="border px-4 py-2" colSpan={2}>
                    <strong>Closing</strong>
                    <br />• Closing Speech
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
