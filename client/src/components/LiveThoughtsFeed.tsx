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
  description: string;
  user: string;
  country: string;
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
            ? `${q.createdBy?.firstName || ""} ${q.createdBy?.lastName || ""}`.trim()
            : q.createdByName || "Unknown";

        const country = q.country || "Unknown";

        return {
          id: q._id,
          description: q.description,
          user: userName,
          country,
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
    }, 2500);
    return () => clearInterval(interval);
  }, [questions]);

  const currentQuestion = questions[currentIndex];

  const handleClick = () => {
    router.push("/share-win");
  };

  if (!token) {
    return (
      <div className="w-full p-4 text-black font-sans rounded-lg">
        <p className="text-sm text-gray-600">
          Please log in to view live thoughts.
        </p>
      </div>
    );
  }

  return (

    <div
      className="w-full p-3 text-black font-sans cursor-pointer rounded-lg"
      onClick={handleClick}
    >
      <h2 className="text-xl font-bold underline underline-offset-4 mb-1">
        Share & Win! (Event)
      </h2>
      <p className="text-sm font-semibold mb-4">Join us and win a prize</p>

      <div className="relative bg-[#d6deeb] w-[80%] h-[55px] overflow-hidden rounded-lg">
        {questions.length > 0 ? (
          <div
            key={currentQuestion.id}
            className="absolute inset-0 animate-slideUp flex items-center gap-2 px-2"
          >
            {/* Thought text */}
            <span
              className="text-sm text-gray-800 truncate flex-grow"
              title={currentQuestion.description.replace(/<[^>]+>/g, "")} // optional tooltip
            >
              {currentQuestion.description.replace(/<[^>]+>/g, "")}
            </span>

            {/* User + Country */}
            <span className="text-xs font-medium text-gray-700 flex-shrink-0">
              {currentQuestion.user}, {currentQuestion.country}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-600">
            No thoughts available yet.
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
