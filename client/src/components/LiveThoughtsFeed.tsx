"use client";

import React, { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/config/api";
import { useRouter } from "next/navigation";

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

const LiveThoughtsFeed: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);
    }
  }, []);

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
    } catch (err) {
      console.error("Error fetching live thoughts:", err);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchQuestions();
  }, [fetchQuestions, token]);

  useEffect(() => {
    if (questions.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % questions.length);
    }, 2500); // every 2.5s
    return () => clearInterval(interval);
  }, [questions]);

  const currentQuestion = questions[currentIndex];

  const handleClick = () => {
    router.push("/share-win"); // update this path
  };

  // If not logged in — render nothing at all
  if (!token) return null;

  return (
    <div
      className="w-[500px] max-w-md p-3 text-black font-sans cursor-pointer overflow-hidden bg-[#d6deeb] rounded-lg shadow-sm"
      onClick={handleClick}
    >
      {/* Static heading (always visible after login) */}
      <h2 className="text-xl font-bold underline underline-offset-4 mb-1">
        Share & Win! (Event)
      </h2>
      <p className="text-sm font-semibold mb-2">Join us and win a prize</p>

      {/* Animated messages */}
      <div className="relative h-[70px] overflow-hidden">
        {currentQuestion && (
          <div
            key={currentQuestion.id}
            className="absolute inset-0 animate-slideUp"
          >
            <p
              className="text-sm overflow-hidden text-ellipsis whitespace-nowrap"
              dangerouslySetInnerHTML={{ __html: currentQuestion.description }}
            />
            <p className="text-xs font-medium text-gray-700 whitespace-nowrap mt-1">
              / {currentQuestion.user}, {currentQuestion.country}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          20% {
            transform: translateY(0);
            opacity: 1;
          }
          80% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
        .animate-slideUp {
          animation: slideUp 2.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LiveThoughtsFeed;
