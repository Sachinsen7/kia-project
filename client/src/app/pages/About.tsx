"use client";

import React from "react";
import Image from "next/image";

function About() {
  return (
    <div className="relative w-full min-h-screen bg-white px-6 md:px-16 py-12">
      {/* Border Wrapper */}
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-6xl m-6 p-8 md:p-14">
        {/* Heading */}
        <div className="relative w-full pt-6 pb-10 px-4">
          <h1 className="text-3xl md:text-5xl text-gray-900 mb-2">
            ABOUT 2025
          </h1>
          <div className="max-w-xl w-full h-[4px] text-[#000] bg-[#000] absolute top-[31px] right-6"></div>
          <h2 className="text-3xl md:text-5xl ml-40 font-bold">GOEF</h2>
        </div>

        {/* Content */}
        <div className="relative px-6 md:px-12 text-gray-700 leading-relaxed border-l border-r border-b border-gray-600">
          <div className="mb-52">
            <p className="mb-4">
              The 2025 GOEF aims to establish a “sustainable ownership
              ecosystem” to turn our “Vision to reality.” This forum is a venue
              for sharing ownership business strategies and exchanging valuable
              insights from each region.
            </p>
            <p className="mb-4">
              This GOEF, in particular, has been planned based on a
              “customer-centric differentiation strategy.” It will cover various
              business plans and programs designed to enhance the customer
              ownership experience and loyalty, ultimately maximizing
              profitability for NSC, Dealers, and Kia.
            </p>
            <p className="mb-6">
              Under the slogan{" "}
              <span className="italic">“Synergy in Action”</span>, and with a
              customer-centric mindset, we aim to connect Kia and its customers.
              By fostering close collaboration between HQ, NSC, and Dealers, we
              will achieve “synergy in action” on the ground, creating special
              value and unique experiences for our Kia customers.
            </p>
          </div>

          <Image
            src="/about/main-image.png"
            alt="Car Showcase"
            width={1200}
            height={600}
            className="absolute top-60 left-11 w-[90%] items-center mt-10 mb-20 h-auto object-cover rounded-xl"
          />
        </div>

        <div className="text-center px-6 py-12 mt-96">
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Main Image */}

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

            {/* Quote Message Centered */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <h3 className="text-lg md:text-2xl font-semibold text-gray-800">
                Vision to Reality for Sustainable Synergy <br />
                <span className="italic">“Synergy in Action”</span>
              </h3>
            </div>
          </div>

          {/* Diagram below */}
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
      </div>
    </div>
  );
}

export default About;
