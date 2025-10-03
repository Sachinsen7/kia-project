"use client";

import React from "react";
import Image from "next/image";

function About() {
  return (
    <div className="w-full min-h-screen bg-white px-6 md:px-16 py-12">

      <div className="bg-white relative shadow-2xl rounded-2xl w-full max-w-6xl m-6 p-8 md:p-14">
        <div className="w-full pt-6 pb-10 px-4">
          <h1 className="text-3xl md:text-5xl text-gray-900 mb-2">
            ABOUT 2025
          </h1>
          <div className="w-[590px] h-[4px] text-[#000] bg-[#000] absolute top-[86px] right-0"></div>
          <h2 className="text-3xl md:text-5xl ml-40 font-bold">GOEF</h2>
        </div>

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
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Session</th>
                  <th className="border border-gray-300 px-4 py-2">Contents</th>
                  <th className="border border-gray-300 px-4 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Welcome to Kia GOEF</td>
                  <td className="border px-4 py-2">
                    -2024 GOEF Greeting <br />
                    -Official Opening Video <br />
                    -Opening Speech
                  </td>
                  <td className="border px-4 py-2">09:00 - 09:30</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Kia Brand</td>
                  <td className="border px-4 py-2">-Brand Strategy Overview <br />
                    -Explanation of brand direction, brand
                    strategy, and the role of ownership/dealers
                  </td>
                  <td className="border px-4 py-2">09:30 - 10:00</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    Ownership Strategy & Core Initiatives
                  </td>
                  <td className="border px-4 py-2">
                    - Ownership Strategy & Core Initiatives
                    - Overseas Production Vehicle Ownership
                    & Management Enhancement
                    - A/S Parts Supply Enhancement Program
                    - Data-Based Service Reinforcement
                    - Digital Owners Manual
                  </td>
                  <td className="border px-4 py-2">10:00 - 11:20</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    Digitalized & Faithful Customer Care
                  </td>
                  <td className="border px-4 py-2">
                    - Digitalized & Faithful Customer Care <br />
                    - Kia Connect Diagnosis <br />
                    - Dealer Service Capacity Reinforcement
                  </td>
                  <td className="border px-4 py-2">11:20 - 12:00</td>
                </tr>
                <tr>
                  <td
                    className="border px-4 py-6 text-center font-medium text-gray-500"
                    colSpan={3}
                  >
                    Sample (TBD) – Schedule titles will be updated after final
                    confirmation.
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
