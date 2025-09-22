"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Heart, MessageSquare, Trash2 } from "lucide-react";
import { apiFetch } from "@/config/api";

// ----------- Types -----------
type User = { firstName: string; lastName: string };

type CommentResponse = { _id: string; text: string; createdAt: string; createdBy: User };
type QuestionResponse = {
  _id: string;
  title: string;
  description: string;
  country: string;
  createdAt: string;
  createdBy: User;
  likes: string[];
};
type Comment = { id: string; user: string; text: string; time: string };
type Question = {
  id: string;
  user: string;
  dept: string;
  date: string;
  title: string;
  country: string;
  text: string;
  likes: number;
  comments: number;
  commentList: Comment[];
  showCommentInput: boolean;
};

// API response types
type AddQuestionResponse = { qna: QuestionResponse };
type AddCommentResponse = { comment: CommentResponse };
type LikeResponse = { success: boolean };

const EditorComponent = dynamic(() => import("./EditorComponent").then((mod) => mod.default), {
  ssr: false,
});

const AskKia: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionCountry, setNewQuestionCountry] = useState("Select country");
  const [commentEditorContent, setCommentEditorContent] = useState("");
  const [countries] = useState(["Select country", "USA", "UK", "Canada", "India"]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const commentEditorRef = useRef<HTMLDivElement>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

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
      const data = await apiFetch<QuestionResponse[]>("/api/qna", "GET", undefined, token);

      const formatted = await Promise.all(
        data.map(async (q) => {
          const comments = await fetchComments(q._id);
          return {
            id: q._id,
            user: `${q.createdBy.firstName} ${q.createdBy.lastName}`,
            dept: "GUEST",
            date: new Date(q.createdAt).toISOString().slice(0, 10),
            title: q.title,
            country: q.country,
            text: q.description,
            likes: q.likes.length,
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
  }, [fetchQuestions]);

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
        { title, description, country },
        token
      );

      const newQ: Question = {
        id: response.qna._id,
        user: "You",
        dept: "GUEST",
        date: new Date(response.qna.createdAt).toISOString().slice(0, 10),
        title: response.qna.title,
        country: response.qna.country,
        text: response.qna.description,
        likes: response.qna.likes.length,
        comments: 0,
        commentList: [],
        showCommentInput: false,
      };

      setQuestions((prev) => [newQ, ...prev]);
      setShowInput(false);
      setNewQuestionTitle("");
      setNewQuestionText("");
      setNewQuestionCountry("Select country");
    } catch (err: unknown) {
      if (err instanceof Error) console.error("Error adding question:", err.message);
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
    } catch (err: unknown) {
      if (err instanceof Error) console.error("Error adding comment:", err.message);
    }
  };

  // Like
  const handleLike = async (id: string) => {
    try {
      await apiFetch<LikeResponse>(`/api/qna/${id}/like`, "PUT", {}, token);
      setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, likes: q.likes + 1 } : q)));
    } catch (err: unknown) {
      if (err instanceof Error) console.error("Error liking question:", err.message);
    }
  };

  // Delete question
  const handleDeleteQuestion = async (id: string) => {
    try {
      await apiFetch<{ success: boolean }>(`/api/qna/${id}`, "DELETE", undefined, token);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) console.error("Error deleting question:", err.message);
    }
  };

  // Delete comment
  const handleDeleteComment = async (questionId: string, commentId: string) => {
    try {
      await apiFetch<{ success: boolean }>(`/api/comment/${commentId}`, "DELETE", undefined, token);
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, comments: q.comments - 1, commentList: q.commentList.filter((c) => c.id !== commentId) }
            : q
        )
      );
    } catch (err: unknown) {
      if (err instanceof Error) console.error("Error deleting comment:", err.message);
    }
  };

  const toggleCommentInput = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, showCommentInput: !q.showCommentInput } : q))
    );
  };

  if (!mounted) return null;

  return (
    <div className="h-full border-l overflow-y-auto z-50 p-6 md:p-10">
      <section className="mb-6 p-4 rounded-lg ">
        <h1 className="text-2xl font-bold mb-3">Ask Kia (Q&amp;A)</h1>
        <p className="text-gray-700 text-sm mb-2">
          The GOEF event is where the future of Kia takes shape, and we want your voice to be part of it.
        </p>
      </section>

      {/* Loading State */}
      {loadingQuestions ? (
        <p className="text-gray-500 text-sm">Loading questions...</p>
      ) : (
        questions.map((q) => (
          <div key={q.id} className="border border-gray-300 rounded bg-white mb-4">
            {/* User info */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="text-gray-500 font-bold">{q.user.charAt(0)}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 text-sm">{q.user}</span>
                  <span className="mx-2 text-xs text-gray-500">/ {q.dept}</span>
                  <span className="text-xs text-gray-400">{q.date}</span>
                </div>
              </div>

              {/* Delete Question (only if user is owner - backend should validate) */}
              <button
                onClick={() => handleDeleteQuestion(q.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
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
                  <div key={c.id} className="mb-2 border-b-2 p-2 border-gray-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm text-gray-800 pb-2">{c.user}</span>
                        <span className="text-xs text-gray-400">{c.time}</span>
                      </div>
                      {/* Delete Comment (only if owner - backend validates) */}
                      <button
                        onClick={() => handleDeleteComment(q.id, c.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
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
