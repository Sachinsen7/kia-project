import React from "react";
import Image from "next/image";

function About() {
  return (
    <div className="relative w-full min-h-screen bg-white p-6 md:p-16">
      {/* Title & Intro */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">About 2025 GOEF</h1>
        <p className="text-gray-700 leading-relaxed mb-4">
          The 2025 GOEF aims to establish a “sustainable ownership ecosystem” to
          turn our “Vision to reality.” This forum is a venue for sharing
          ownership business strategies and exchanging valuable insights from
          each region.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          This GOEF, in particular, has been planned based on a
          “customer-centric differentiation strategy.” It will cover various
          business plans and programs designed to enhance the customer ownership
          experience and loyalty, ultimately maximizing profitability for NSC,
          Dealers, and Kia.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Under the slogan <span className="italic">“Synergy in Action”</span>,
          and with a customer-centric mindset, we aim to connect Kia and its
          customers. By fostering close collaboration between HQ, NSC, and
          Dealers, we will achieve “synergy in action” on the ground, creating
          special value and unique experiences for our Kia customers.
        </p>
      </div>

      {/* Vision Diagram */}
      <div className="text-center my-12">
        <h2 className="text-lg font-semibold mb-3">
          Vision to Reality for Sustainable Synergy <br />
          <span className="italic">“Synergy in Action”</span>
        </h2>
        <div className="flex justify-center">
          <Image
            src="/images/diagram.png"
            alt="Vision Diagram"
            width={400}
            height={300}
            className="w-80 md:w-[400px] object-contain"
          />
        </div>
      </div>

      {/* Schedule Table */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">2025 GOEF Schedule</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Session</th>
                <th className="border px-4 py-2 text-left">Contents</th>
                <th className="border px-4 py-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">Welcome to Kia GOEF</td>
                <td className="border px-4 py-2">
                  2025 GOEF Opening / Virtual Opening Video / Opening Speech
                </td>
                <td className="border px-4 py-2">09:00</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Kia Brand Strategy</td>
                <td className="border px-4 py-2">
                  Future Vision / Global Positioning / Strategy Directions
                </td>
                <td className="border px-4 py-2">10:00</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">
                  Ownership Strategy & Care Initiatives
                </td>
                <td className="border px-4 py-2">
                  EV Plans / Supply Enhancement Program / Value-based Service
                  Enhancement
                </td>
                <td className="border px-4 py-2">11:00</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">
                  Optimized & Tailored Customer Care
                </td>
                <td className="border px-4 py-2">
                  Enhanced Service Customer Care / Kia Connect Upgrades / Dealer
                  Service Capacity Reinforcement
                </td>
                <td className="border px-4 py-2">12:00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-10 text-sm text-gray-600 text-right">* Sample (TBD)</p>
    </div>
  );
}

export default About;
