"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Heart, MessageSquare } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { apiFetch } from "@/config/api";

type Comment = {
  id: string;
  user: string;
  text: string;
  time: string;
};

type Question = {
  id: string;
  user: string;
  dept: string;
  date: string;
  text: string;
  likes: number;
  comments: number;
  commentList: Comment[];
  showCommentInput: boolean;
};

const EditorComponent = dynamic(
  () => import("./EditorComponent").then((mod) => mod.default),
  { ssr: false }
);

const AskKia: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionCountry, setNewQuestionCountry] = useState("Select country");
  const [commentEditorContent, setCommentEditorContent] = useState("");
  const [countries] = useState(["Select country", "USA", "UK", "Canada", "India"]);

  const editorRef = useRef<HTMLDivElement>(null);
  const commentEditorRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("token"); // JWT token

  useEffect(() => {
    setMounted(true);
    // Initial sample question
    setQuestions([
      {
        id: uuidv4(),
        user: "John Doe",
        dept: "KUS",
        date: new Date().toISOString().slice(0, 10),
        text: "Where can I get a KIDCC guidebook pdf version?",
        likes: 24,
        comments: 0,
        commentList: [],
        showCommentInput: false,
      },
    ]);
  }, []);

  const handleAddQuestion = async () => {
    const title = newQuestionTitle.trim();
    const description = newQuestionText.trim();
    const country = newQuestionCountry;

    if (!title || !description || country === "Select country") return;

    try {
      const response = await apiFetch(
        "/api/qna",
        "POST",
        { title, description, country },
        token || ""
      );

      const newQ: Question = {
        id: response.qna._id,
        user: "You",
        dept: "GUEST",
        date: new Date(response.qna.createdAt).toISOString().slice(0, 10),
        text: response.qna.description,
        likes: response.qna.likes.length,
        comments: 0,
        commentList: [],
        showCommentInput: false,
      };

      setQuestions([newQ, ...questions]);
      setShowInput(false);
      setNewQuestionTitle("");
      setNewQuestionText("");
      setNewQuestionCountry("Select country");
    } catch (err: any) {
      console.error("Error adding question:", err.message);
    }
  };

  const handleLike = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, likes: q.likes + 1 } : q))
    );
  };

  const toggleCommentInput = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, showCommentInput: !q.showCommentInput } : q
      )
    );
  };

  const handleAddComment = (id: string) => {
    const commentText = commentEditorContent.trim();
    if (!commentText) return;

    const newComment: Comment = {
      id: uuidv4(),
      user: "You",
      text: commentText,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
            ...q,
            comments: q.comments + 1,
            commentList: [...q.commentList, newComment],
            showCommentInput: false,
          }
          : q
      )
    );
    setCommentEditorContent("");
  };

  if (!mounted) return null;

  return (
    <div className="h-full border-l overflow-y-auto z-50 p-6 md:p-10">
      {/* Intro Section */}
      <section className="mb-6 p-4 rounded-lg ">
        <h1 className="text-2xl font-bold mb-3">Ask Kia (Q&amp;A)</h1>
        <p className="text-gray-700 text-sm mb-2">
          The GOEF event is where the future of Kia takes shape, and we want your voice to be part of it.
        </p>
        <h2 className="font-semibold text-gray-800 mb-1">How to Participate</h2>
        <p className="text-gray-700 text-sm mb-2">
          <strong>Submit Your Question:</strong> Leave your questions in the comments below.
        </p>
        <p className="text-gray-700 text-sm mb-2">
          <strong>Get Your Answer:</strong> Selected questions will be answered on-site during the GOEF event.
        </p>
      </section>

      {/* Question Input */}
      <div className="mb-4 flex justify-end">
        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm font-semibold"
          >
            Create a question
          </button>
        ) : (
          <div className="w-full" ref={editorRef}>
            <div className="mb-2">
              <select
                className="w-full border border-gray-300 rounded p-2 text-sm"
                value={newQuestionCountry}
                onChange={(e) => setNewQuestionCountry(e.target.value)}
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Title"
                className="w-full border border-gray-300 rounded p-2 text-sm"
                value={newQuestionTitle}
                onChange={(e) => setNewQuestionTitle(e.target.value)}
              />
            </div>
            <div className="mb-2 editor-container">
              <EditorComponent
                onUpdate={setNewQuestionText}
                initialContent={newQuestionText}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowInput(false)}
                className="px-4 py-1 border rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddQuestion}
                className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 text-sm"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Questions List */}
      {questions.map((q) => (
        <div key={q.id} className="border border-gray-300 rounded bg-white mb-4">
          <div className="flex items-center px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              <span className="text-gray-500 font-bold">{q.user.charAt(0)}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900 text-sm">{q.user}</span>
              <span className="mx-2 text-xs text-gray-500">/ {q.dept}</span>
              <span className="text-xs text-gray-400">{q.date}</span>
            </div>
          </div>

          <div
            className="px-4 pb-3 text-gray-800 text-sm"
            dangerouslySetInnerHTML={{ __html: q.text }}
          />

          <div className="px-4 pb-3 flex items-center gap-6 text-xs text-gray-500">
            <button
              onClick={() => handleLike(q.id)}
              className="flex items-center gap-1 hover:text-red-600 transition"
            >
              <Heart size={14} /> {q.likes}
            </button>
            <button
              onClick={() => toggleCommentInput(q.id)}
              className="flex items-center gap-1 hover:text-blue-600 transition"
            >
              <MessageSquare size={14} /> {q.comments}
            </button>
          </div>

          {q.showCommentInput && (
            <div className="px-4 pb-3" ref={commentEditorRef}>
              <div className="mb-2">
                <select
                  className="w-full border border-gray-300 rounded p-2 text-sm"
                  value={newQuestionCountry}
                  onChange={(e) => setNewQuestionCountry(e.target.value)}
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Heading"
                  className="w-full border border-gray-300 rounded p-2 text-sm"
                />
              </div>
              <div className="mb-2 editor-container">
                <EditorComponent
                  onUpdate={setCommentEditorContent}
                  initialContent={commentEditorContent}
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => toggleCommentInput(q.id)}
                  className="px-4 py-1 border rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddComment(q.id)}
                  className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 text-sm"
                >
                  Post
                </button>
              </div>
              {q.commentList.length > 0 && (
                <div className="mt-2 space-y-1">
                  {q.commentList.map((c) => (
                    <p
                      key={c.id}
                      className="text-xs text-gray-700 bg-gray-100 rounded px-2 py-1 flex justify-between"
                      dangerouslySetInnerHTML={{ __html: c.text }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AskKia;
