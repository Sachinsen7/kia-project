"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import Image from "next/image";

type HelpSupportProps = {
  onClose?: () => void;
};

function HelpSupport({ onClose }: HelpSupportProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Where can I watch the live session?",
      answer: (
        <>
          You can watch it by clicking the Live Show stage on the main page, and
          you can also access it via the link below. <br />
          <span className="font-medium">MS Teams Link: xxxxxxxxxx</span>
        </>
      ),
    },

    {
      question:
        "GOEF materials are very helpful. When and where can I receive them?",
      answer:
        "The GOEF materials will be uploaded to KDA as training resources at a later time.",
    },
    {
      question:
        "I have a question regarding the GOEF topics. Where should I direct my inquiry?",
      answer:
        "You can submit your questions on the Ask Kia page, or post them in the real-time Teams chat room. The relevant department representatives will respond accordingly.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative w-full min-h-screen bg-white px-6 md:px-16 py-12">
      <div className="bg-white relative shadow-2xl rounded-2xl w-full max-w-6xl m-6 p-8 md:p-14">
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
        {/* Title */}
        <div className="w-full pt-6 pb-10 px-4 mt-10">
          <h1 className="text-3xl mt-10 md:text-5xl text-gray-900 mb-2 inline-block">
            HELP
            <div className="w-[4px] h-[200px] text-[#000] bg-[#000] absolute top-0 left-19"></div>
          </h1>
          <h2 className="text-3xl md:text-5xl ml-23">& SUPPORT</h2>
        </div>

        {/* Intro */}
        <div className="px-4 w-[1098px] h-[126px] md:px-8 text-gray-700 leading-relaxed">
          <div className="mt-15">
            <p className="text-gray-700 leading-relaxed mb-8 ml-35">
              We are committed to making sure you enjoy this event. If you cant
              find the answer <br /> you&apos;re looking for, or if you need
              personalized help, please contact us via email. <br />
              Contact email: <a className="underline text-blue-500" href="mailto:pieta21@kia.com">pieta21@kia.com</a>
            </p>
            <Image
              className="absolute top-84 right-0 object-cover"
              width={600}
              height={500}
              src="/new border.png"
              alt=""
            />
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-300 bg-[#eeeff2] p-5 pb-4 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              {/* Question */}
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">
                  Q. {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="text-gray-600 transition-transform duration-300" />
                ) : (
                  <ChevronDown className="text-gray-600 transition-transform duration-300" />
                )}
              </div>

              {/* Animated Answer */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100 mt-3"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HelpSupport;
