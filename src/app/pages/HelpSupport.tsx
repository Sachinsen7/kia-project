import React, { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

function HelpSupport() {
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
        "I’m having trouble connecting to Teams. Is there an alternative way to watch the live session?",
      answer: (
        <>
          In case the Teams connection is unstable, the session will also be
          available via YouTube Live. Please note, however, that for
          confidentiality reasons, certain content may not be streamed in real
          time. <br />
          <span className="font-medium">YouTube Link: xxxxxxxxxx</span>
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
    <div className="relative w-full min-h-screen bg-white p-6 md:p-16">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Help & Support</h1>

        {/* Intro */}
        <p className="text-gray-700 leading-relaxed mb-8">
          We are committed to making sure you enjoy this event. If you can’t
          find the answer you’re looking for, or if you need personalized help,
          please contact us via email.
        </p>

        {/* Divider */}
        <div className="w-16 h-1 bg-black mb-8"></div>

        {/* FAQs */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-300 pb-4 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              {/* Question */}
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">
                  Q. {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="text-gray-600" />
                ) : (
                  <ChevronDown className="text-gray-600" />
                )}
              </div>

              {/* Answer */}
              {openIndex === index && (
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HelpSupport;
