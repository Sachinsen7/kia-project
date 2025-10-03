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
      setVisibleQuestions(formatted.slice(0, 3)); // show first 3 initially
    } catch (err) {
      console.error("Error fetching live thoughts:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Rotate one question at a time
  useEffect(() => {
    if (questions.length <= 3) return;

    const interval = setInterval(() => {
      setVisibleQuestions((prev) => {
        const nextIndex = questions.indexOf(prev[0]) + 3;
        const nextQuestion = questions[nextIndex % questions.length];
        return [...prev.slice(1), nextQuestion]; // remove first, add next
      });
    }, 3000); // change every 3s

    return () => clearInterval(interval);
  }, [questions]);

  return (
    <div className="flex flex-col w-full space-y-2 text-[#05141F] overflow-hidden">
      {visibleQuestions.map((q, index) => (
        <div
          key={q.id}
          onClick={() => onSelect?.(q.id)}
          className="cursor-pointer w-full border rounded p-3 hover:bg-gray-50 transition-all duration-700 ease-in-out break-words"
          style={{
            transitionDelay: `${index * 200}ms`, // small stagger
          }}
        >
          <div
            className="text-sm mb-1 opacity-100 animate-fadeInOut"
            dangerouslySetInnerHTML={{ __html: q.description }}
          />
          <p className="text-sm font-semibold text-right">
            {q.user} | {q.country}
          </p>
        </div>
      ))}

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
