"use client";

import React, { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/config/api";

type User = {
  firstName?: string;
  lastName?: string;
  _id?: string;
};

type QuestionResponse = {
  _id: string;
  description: string;
  createdBy: User | null;
  createdByName?: string;
  country?: string | null;
};

type Question = {
  id: string;
  user: string;
  country: string;
  description: string;
};

type LiveThoughtsFeedProps = {
  onSelect?: (id: string) => void;
};

const LiveThoughtsFeed: React.FC<LiveThoughtsFeedProps> = ({ onSelect }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [visibleQuestions, setVisibleQuestions] = useState<Question[]>([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  const fetchQuestions = useCallback(async () => {
    if (!token) return;

    try {
      const data = await apiFetch<QuestionResponse[]>(
        "/api/qna?type=goef_event",
        "GET",
        undefined,
        token
      );

      const formatted = data.map((q) => {
        const userName =
          q.createdBy?.firstName || q.createdBy?.lastName
            ? `${q.createdBy?.firstName || ""} ${
                q.createdBy?.lastName || ""
              }`.trim()
            : q.createdByName || "Unknown";

        return {
          id: q._id,
          user: userName,
          country: q.country || "Unknown",
          description: q.description,
        };
      });

      setQuestions(formatted);
      setVisibleQuestions(formatted.slice(0, 3));
    } catch (err) {
      console.error("Error fetching live thoughts:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // rotation kept as is
  useEffect(() => {
    if (questions.length <= 3) return;

    const interval = setInterval(() => {
      setVisibleQuestions((prev) => {
        const nextIndex = questions.indexOf(prev[0]) + 3;
        const nextQuestion = questions[nextIndex % questions.length];
        return [...prev.slice(1), nextQuestion];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [questions]);

  return (
    <div className="w-full max-w-2xl p-3 text-black font-sans">
      {/* Heading */}
      <h2 className="text-xl font-bold underline underline-offset-4">
        Share & Win ! (Event)
      </h2>
      <p className="text-sm font-semibold mb-2 mt-2">Join us and win a prize</p>

      {/* Messages */}
      <div className="w-[500px]">
        {visibleQuestions.map((q, index) => (
          <div
            key={q.id}
            onClick={() => onSelect?.(q.id)}
            className="cursor-pointer bg-[#d6deeb] flex items-center justify-between p-2 text-sm transition-all duration-700 ease-in-out"
            style={{ transitionDelay: `${index * 200}ms` }}
          >
            {/* Description (ellipses if too long) */}
            <p
              className="text-sm opacity-100 animate-fadeInOut flex-1 mr-2 overflow-hidden text-ellipsis whitespace-nowrap"
              dangerouslySetInnerHTML={{ __html: q.description }}
            />

            {/* User + country */}
            <p className="text-xs font-medium text-gray-700 whitespace-nowrap">
              / {q.user}, {q.country}
            </p>
          </div>
        ))}
      </div>

      {/* Keep animation */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
        .animate-fadeInOut {
          animation: fadeInOut 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LiveThoughtsFeed;
