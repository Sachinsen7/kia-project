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
  text: string;
  country: string;
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
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[100px] border border-gray-300 rounded p-2 bg-gray-50">
        Loading editor...
      </div>
    ),
  }
);

const GoefEvent: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionCountry, setNewQuestionCountry] =
    useState("Select country");
  const [commentEditorContent, setCommentEditorContent] = useState("");
  const [activeCommentEditor, setActiveCommentEditor] = useState<string | null>(
    null
  );
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
        `/api/qna?type=goef_event`,
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
            text: q.description,
            country: q.country,
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
  }, [fetchQuestions]);

  // Add question
  const handleAddQuestion = async () => {
    const description = newQuestionText.trim();
    const country = newQuestionCountry;
    if (!description || country === "Select country") return;

    try {
      const response = await apiFetch<AddQuestionResponse>(
        `/api/qna`,
        "POST",
        { title: "GOEF Thought", description, country, type: "goef_event" },
        token
      );
      const newQ: Question = {
        id: response.qna._id,
        user: "You",
        userId: currentUserId,
        dept: "GUEST",
        date: new Date(response.qna.createdAt).toISOString().slice(0, 10),
        text: response.qna.description,
        country: response.qna.country,
        likes: response.qna.likes.length,
        likedBy: response.qna.likes,
        comments: 0,
        commentList: [],
        showCommentInput: false,
      };
      setQuestions((prev) => [newQ, ...prev]);
      setShowInput(false);
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
      setActiveCommentEditor(null);
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
    setActiveCommentEditor(id);
    setCommentEditorContent(""); // Reset comment editor content
  };

  const handleNewQuestionTextUpdate = useCallback((content: string) => {
    setNewQuestionText(content);
  }, []);

  const handleCommentEditorUpdate = useCallback((content: string) => {
    setCommentEditorContent(content);
  }, []);

  if (!mounted) return null;

  return (
    <div className="h-full border-l overflow-y-auto z-50 p-6 md:p-10">
      <section className="mb-6 p-4 rounded-lg ">
        <h1 className="text-2xl font-bold mb-3"> 2025 GOEF Event </h1>
        <br />
        <p className="text-gray-700 text-sm mb-2">
          We&apos;re hosting a forum with your active participation at this
          year&apos;s GOEF, and we have a special event planned. Please share
          your thoughts on &quot;What does ownership mean to you?&quot; in the
          comments below!
        </p>
        <br />
        <p className="text-gray-700 text-sm mb-2">
          We&apos;ll select the best submissions and award them with a prize
          during the live stream on the day of the GOEF. We look forward to your
          active participation.
        </p>
        <br />
        <br />
      </section>

      <div className="mb-4 flex justify-between">
        <h2 className="font-semibold text-gray-800 mb-1">
          What does ownership mean to you?
        </h2>
        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm font-semibold"
          >
            Share Your Thoughts
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
            <div className="mb-2 editor-container">
              <EditorComponent
                key="new-question-editor"
                onUpdate={handleNewQuestionTextUpdate}
                initialContent=""
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowInput(false);
                  setNewQuestionText("");
                  setNewQuestionCountry("Select country");
                }}
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

      {loadingQuestions ? (
        <p className="text-gray-500 text-sm">Loading thoughts...</p>
      ) : (
        questions.map((q) => (
          <div
            key={q.id}
            className="border border-gray-300 rounded bg-white mb-4"
          >
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

            <div className="px-4 pb-3 text-gray-800 text-sm">
              <em>{q.country}</em>
              <div dangerouslySetInnerHTML={{ __html: q.text }} />
            </div>

            <div className="px-4 pb-3 flex items-center gap-6 text-xs text-gray-500">
              <button
                onClick={() => handleLike(q.id)}
                className="flex items-center gap-1 transition"
              >
                {q.likedBy.includes(currentUserId) ? (
                  <Heart size={14} fill="red" stroke="red" />
                ) : (
                  <Heart size={14} stroke="gray" />
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

            {q.showCommentInput && (
              <div className="px-4 pb-3" ref={commentEditorRef}>
                <div className="mb-2 editor-container">
                  <EditorComponent
                    key={`comment-editor-${q.id}`}
                    onUpdate={handleCommentEditorUpdate}
                    initialContent=""
                  />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => {
                      toggleCommentInput(q.id);
                      setCommentEditorContent("");
                      setActiveCommentEditor(null);
                    }}
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
                      <div
                        key={c.id}
                        className="text-xs text-gray-700 bg-gray-100 rounded px-2 py-1 flex justify-between"
                      >
                        <div>
                          <span className="font-semibold">{c.user}</span> -{" "}
                          {c.time}
                          <div dangerouslySetInnerHTML={{ __html: c.text }} />
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
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default GoefEvent;
