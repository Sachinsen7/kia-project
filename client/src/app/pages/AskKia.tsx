"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Heart, MessageSquare, Trash2 } from "lucide-react";
import { apiFetch } from "@/config/api";

// ----------- Types -----------
type User = { firstName: string; lastName: string; _id?: string };

type Question = {
  id: string;
  user: string;
  userId?: string;
  dept: string;
  date: string;
  title: string;
  country: string;
  text: string;
  likes: number;
  likedBy: string[];
  comments: number;
  commentList: Comment[];
  showCommentInput: boolean;
};

type Comment = {
  id: string;
  user: string;
  userId?: string;
  text: string;
  time: string;
};

type CommentResponse = {
  _id: string;
  text: string;
  createdAt: string;
  createdBy: User;
};

type QuestionResponse = {
  _id: string;
  title: string;
  description: string;
  country: string;
  createdAt: string;
  createdBy: User;
  likes: string[];
};

type AddQuestionResponse = { qna: QuestionResponse };
type AddCommentResponse = { comment: CommentResponse };
type LikeResponse = { success: boolean; likes: string[]; likesCount: number };

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
  const [newQuestionCountry, setNewQuestionCountry] =
    useState("Select country");
  const [commentEditorContent, setCommentEditorContent] = useState("");
  const [countries] = useState([
    "Select country",
    "USA",
    "UK",
    "Canada",
    "India",
  ]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const commentEditorRef = useRef<HTMLDivElement>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  const currentUserId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";

  // Fetch comments
  const fetchComments = useCallback(
    async (questionId: string): Promise<Comment[]> => {
      try {
        const data = await apiFetch<CommentResponse[]>(
          `/api/comment/${questionId}`,
          "GET",
          undefined,
          token
        );
        return data.map((c) => ({
          id: c._id,
          user: `${c.createdBy.firstName} ${c.createdBy.lastName}`,
          userId: c.createdBy._id,
          text: c.text,
          time: new Date(c.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
      } catch (err) {
        console.error("Error fetching comments:", err);
        return [];
      }
    },
    [token]
  );

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    try {
      const data = await apiFetch<QuestionResponse[]>(
        `/api/qna?type=ask_kia`,
        "GET",
        undefined,
        token
      );
      const formatted = await Promise.all(
        data.map(async (q) => {
          const comments = await fetchComments(q._id);
          return {
            id: q._id,
            user: `${q.createdBy.firstName} ${q.createdBy.lastName}`,
            userId: q.createdBy._id,
            dept: "GUEST",
            date: new Date(q.createdAt).toISOString().slice(0, 10),
            title: q.title,
            country: q.country,
            text: q.description,
            likes: q.likes.length,
            likedBy: q.likes,
            comments: comments.length,
            commentList: comments,
            showCommentInput: false,
          };
        })
      );
      setQuestions(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuestions(false);
    }
  }, [token, fetchComments]);

  useEffect(() => {
    setMounted(true);
    fetchQuestions();
  }, [token, fetchQuestions]);

  // Add question
  const handleAddQuestion = async () => {
    const title = newQuestionTitle.trim();
    const description = newQuestionText.trim();
    const country = newQuestionCountry;
    if (!title || !description || country === "Select country") return;

    try {
      const response = await apiFetch<AddQuestionResponse>(
        "/api/qna",
        "POST",
        { title, description, country, type: "ask_kia" },
        token
      );
      const newQ: Question = {
        id: response.qna._id,
        user: "You",
        userId: currentUserId,
        dept: "GUEST",
        date: new Date(response.qna.createdAt).toISOString().slice(0, 10),
        title: response.qna.title,
        country: response.qna.country,
        text: response.qna.description,
        likes: response.qna.likes.length,
        likedBy: response.qna.likes,
        comments: 0,
        commentList: [],
        showCommentInput: false,
      };
      setQuestions((prev) => [newQ, ...prev]);
      setShowInput(false);
      setNewQuestionTitle("");
      setNewQuestionText("");
      setNewQuestionCountry("Select country");
    } catch (err) {
      console.error("Error adding question:", err);
    }
  };

  // Add comment
  const handleAddComment = async (id: string) => {
    const commentText = commentEditorContent.trim();
    if (!commentText) return;

    try {
      const response = await apiFetch<AddCommentResponse>(
        `/api/comment/${id}`,
        "POST",
        { text: commentText },
        token
      );
      const newComment: Comment = {
        id: response.comment._id,
        user: "You",
        userId: currentUserId,
        text: response.comment.text,
        time: new Date(response.comment.createdAt).toLocaleTimeString("en-US", {
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
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Like
  const handleLike = async (id: string) => {
    try {
      const response = await apiFetch<LikeResponse>(
        `/api/qna/${id}/like`,
        "PUT",
        {},
        token
      );
      if (!response.success) return;
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id
            ? {
                ...q,
                likes: response.likesCount,
                likedBy: response.likes,
              }
            : q
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  // Delete question
  const handleDeleteQuestion = async (id: string) => {
    try {
      await apiFetch<{ success: boolean }>(
        `/api/qna/${id}`,
        "DELETE",
        undefined,
        token
      );
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  // Delete comment
  const handleDeleteComment = async (questionId: string, commentId: string) => {
    try {
      await apiFetch<{ success: boolean }>(
        `/api/comment/${commentId}`,
        "DELETE",
        undefined,
        token
      );
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? {
                ...q,
                comments: q.comments - 1,
                commentList: q.commentList.filter((c) => c.id !== commentId),
              }
            : q
        )
      );
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const toggleCommentInput = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, showCommentInput: !q.showCommentInput } : q
      )
    );
  };

  if (!mounted) return null;

  return (
    <div className="h-full border-l overflow-y-auto z-50 p-6 md:p-10">
      {/* Professional Intro Text */}
      <section className="mb-6 p-4 rounded-lg ">
        <h1 className="text-2xl font-bold mb-3">Ask Kia (Q&amp;A)</h1>
        <br />
        <p className="text-gray-700 text-sm mb-2">
          The GOEF event is where the future of Kia takes shape, and we want
          your voice to be a part of it. Feel free to ask any questions
          you&apos;ve been curious about regarding Kia HQ. We are always
          listening to your valuable input.
        </p>
        <br />
        <h2 className="font-semibold text-gray-800 mb-1">How to Participate</h2>
        <p className="text-gray-700 text-sm mb-2">
          <strong>Submit Your Question:</strong> Please leave your questions in
          the comments below.
        </p>
        <p className="text-gray-700 text-sm mb-2">
          <strong>Get Your Answer:</strong> We will select questions to be
          answered directly on-site during the GOEF event.
        </p>
        <br />
        <h2 className="font-semibold text-gray-800 mb-1">
          For Unanswered Questions
        </h2>
        We appreciate your understanding that we may not be able to answer all
        questions immediately due to the nature of the live event. If your
        question isn&apos;t answered on the spot, a dedicated team member will
        review it after the event and provide a thorough response.
      </section>

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
                title="Country"
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
                value={newQuestionTitle}
                onChange={(e) => setNewQuestionTitle(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm"
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
      {/* Loading State */}
      {loadingQuestions ? (
        <p className="text-gray-500 text-sm">Loading questions...</p>
      ) : (
        questions.map((q) => (
          <div
            key={q.id}
            className="border border-gray-300 rounded bg-white mb-4"
          >
            {/* User info */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="text-gray-500 font-bold">
                    {q.user.charAt(0)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 text-sm">
                    {q.user}
                  </span>
                  <span className="mx-2 text-xs text-gray-500">/ {q.dept}</span>
                  <span className="text-xs text-gray-400">{q.date}</span>
                </div>
              </div>
              {q.userId === currentUserId && (
                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* Question content */}
            <div className="px-4 pb-3 text-gray-800 text-sm">
              <strong>{q.title}</strong> - <em>{q.country}</em>
              <div dangerouslySetInnerHTML={{ __html: q.text }} />
            </div>

            {/* Actions */}
            <div className="px-4 pb-3 flex items-center gap-6 text-xs text-gray-500">
              <button
                onClick={() => handleLike(q.id)}
                className="flex items-center gap-1 transition"
              >
                {q.likedBy.includes(currentUserId) ? (
                  <Heart size={16} fill="red" stroke="red" />
                ) : (
                  <Heart size={16} stroke="gray" />
                )}
                {q.likes}
              </button>
              <button
                onClick={() => toggleCommentInput(q.id)}
                className="flex items-center gap-1 hover:text-blue-600 transition"
              >
                <MessageSquare size={14} /> {q.comments}
              </button>
            </div>

            {/* Comment input */}
            {q.showCommentInput && (
              <div className="px-4 pb-3" ref={commentEditorRef}>
                <EditorComponent
                  onUpdate={setCommentEditorContent}
                  initialContent={commentEditorContent}
                />
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
              </div>
            )}

            {/* Comments list */}
            {q.commentList.length > 0 && (
              <div className="px-6 pb-3">
                {q.commentList.map((c) => (
                  <div
                    key={c.id}
                    className="mb-2 border-b-2 p-2 border-gray-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm text-gray-800 pb-2">
                          {c.user}
                        </span>
                        <span className="text-xs text-gray-400">{c.time}</span>
                      </div>
                      {c.userId === currentUserId && (
                        <button
                          onClick={() => handleDeleteComment(q.id, c.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div
                      className="text-sm text-gray-700 ml-2"
                      dangerouslySetInnerHTML={{ __html: c.text }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AskKia;
