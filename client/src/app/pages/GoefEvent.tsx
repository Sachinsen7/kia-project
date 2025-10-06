"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Heart, MessageSquare, Trash2, X } from "lucide-react";
import { apiFetch } from "@/config/api";
import Image from "next/image";

// ----------- Types -----------
type User = {
  firstName: string;
  lastName: string;
  _id?: string;
  email?: string;
  role?: string;
};

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
  createdBy: User | null;
  createdByName?: string;
};

type QuestionResponse = {
  _id: string;
  description: string;
  country: string | null;
  createdAt: string;
  createdBy: User | null;
  createdByName?: string;
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

type GoefEventProps = {
  onClose?: () => void;
};

const GoefEvent: React.FC<GoefEventProps> = ({ onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [commentEditorContent, setCommentEditorContent] = useState("");
  const [activeCommentEditor, setActiveCommentEditor] = useState<string | null>(
    null
  );
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const commentEditorRef = useRef<HTMLDivElement>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  let currentUserId = "";
  let currentUserFullName = "Unknown";
  let isAdmin = false;
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        currentUserId =
          typeof parsed === "string" ? parsed : parsed._id || parsed.id || "";
        const firstName = (parsed as { firstName?: string })?.firstName || "";
        const lastName = (parsed as { lastName?: string })?.lastName || "";
        currentUserFullName = `${firstName} ${lastName}`.trim() || "Unknown";
        const roleFromUser = (parsed as { role?: string })?.role || "";
        const roleFromStorage = localStorage.getItem("role") || "";
        const effectiveRole = (
          roleFromUser ||
          roleFromStorage ||
          ""
        ).toLowerCase();
        isAdmin = effectiveRole === "admin";
      } catch (err) {
        console.error("Error parsing user data from localStorage:", err);
      }
    } else {
      // fallback to older storage key if present
      currentUserId = localStorage.getItem("userId") || "";
      const role = (localStorage.getItem("role") || "").toLowerCase();
      isAdmin = role === "admin";
    }
  }

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
        return data.map((c) => {
          const hasName =
            c.createdBy && (c.createdBy.firstName || c.createdBy.lastName);
          const nameFromEmail = c.createdBy?.email
            ? c.createdBy.email.split("@")[0]
            : "";
          return {
            id: c._id,
            user: hasName
              ? `${c.createdBy!.firstName || ""} ${
                  c.createdBy!.lastName || ""
                }`.trim()
              : c.createdBy
              ? nameFromEmail || "Unknown"
              : "Unknown",
            userId: c.createdBy?._id || "",
            text: c.text,
            time: new Date(c.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        });
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
          const hasName =
            q.createdBy && (q.createdBy.firstName || q.createdBy.lastName);
          const nameFromEmail = q.createdBy?.email
            ? q.createdBy.email.split("@")[0]
            : "";
          return {
            id: q._id,
            user: hasName
              ? `${q.createdBy!.firstName || ""} ${
                  q.createdBy!.lastName || ""
                }`.trim()
              : q.createdBy
              ? nameFromEmail || "Unknown"
              : "Unknown",
            userId: q.createdBy?._id || "",
            dept: "KUS",
            date: new Date(q.createdAt).toISOString().slice(0, 10),
            text: q.description,
            country: q.country || "Unknown",
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
    if (!description) return;

    try {
      const response = await apiFetch<AddQuestionResponse>(
        `/api/qna`,
        "POST",
        { title: "GOEF Thought", description, type: "goef_event" },
        token
      );
      const newQ: Question = {
        id: response.qna._id,
        user: response.qna.createdBy
          ? `${response.qna.createdBy.firstName || "Unknown"} ${
              response.qna.createdBy.lastName || ""
            }`.trim() || "Unknown"
          : response.qna.createdByName ||
            (isAdmin ? "Admin" : currentUserFullName),
        userId: isAdmin ? "admin" : currentUserId,
        dept: "KUS",
        date: new Date(response.qna.createdAt).toISOString().slice(0, 10),
        text: response.qna.description,
        country: response.qna.country || "",
        likes: response.qna.likes.length,
        likedBy: response.qna.likes,
        comments: 0,
        commentList: [],
        showCommentInput: false,
      };
      setQuestions((prev) => [newQ, ...prev]);
      setShowInput(false);
      setNewQuestionText("");
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
      const displayNameFromUser = response.comment?.createdBy
        ? `${response.comment.createdBy.firstName || "Unknown"} ${
            response.comment.createdBy.lastName || ""
          }`.trim() || "Unknown"
        : undefined;
      const newComment: Comment = {
        id: response.comment._id,
        user:
          displayNameFromUser ||
          response.comment.createdByName ||
          currentUserFullName,
        userId: response.comment.createdBy?._id || currentUserId,
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

  const handleCancelQuestion = () => {
    setShowInput(false);
    setNewQuestionText("");
  };

  if (!mounted) return null;

  return (
    <div className="w-full min-h-screen bg-white px-6 md:px-16 py-12">
      <div className="bg-white relative shadow-2xl rounded-2xl w-full max-w-6xl m-6 p-8 md:p-14">
        {/* Cross Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <Image
              width={22}
              height={22}
              src="/askkia/cross.png"
              alt="Close sidebar"
              className="cursor-pointer"
            />{" "}
          </button>
        )}
        <div className="w-full pt-6 pb-10 px-4">
          <div className="w-[4px] h-[100px] text-[#000] bg-[#000] absolute -top-0 left-26.5"></div>

          <h1 className="text-3xl md:text-5xl text-gray-900 mb-2">
            Share & <span className="font-semibold">Win!</span>
          </h1>
          <h2 className="text-3xl md:text-5xl text-gray-900 ml-40">(Event)</h2>
        </div>
        <div className="px-4 w-[1098px] h-[126px] md:px-8 text-gray-700 leading-relaxed">
          <div className="mt-15">
            <p className="text-gray-700 leading-relaxed mb-8">
              We&apos;re hosting a forum with your active participation at this
              year&apos;s GOEF, and we have <br />a special event planned.
              Please share your thoughts on
              <strong>
                &nbsp;&quot;What does ownership mean to you?&quot;
              </strong>{" "}
            </p>

            <p className="text-gray-700 leading-relaxed mb-8">
              We&apos;ll select the best submissions and award them with a prize
              during the live stream <br /> on the day of the GOEF. We look
              forward to your active participation.
            </p>

            <Image
              className="absolute top-63 right-0 object-cover"
              width={670}
              height={200}
              src="/event/border.png"
              alt=""
            />
          </div>
        </div>

        {/* Share Your Thoughts Section - Refined to match the design */}
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6 mt-30">
          {!showInput ? (
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                What does ownership mean to you?
              </h2>
              <button
                onClick={() => setShowInput(true)}
                className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium"
              >
                Share Your Thoughts
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Share Your Thoughts
              </h2>

              {/* Rich Text Editor */}
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                {/* Editor Content Area */}
                <div className="min-h-[300px] p-4 bg-white">
                  <EditorComponent
                    key="new-question-editor"
                    onUpdate={handleNewQuestionTextUpdate}
                    initialContent=""
                  />
                </div>
              </div>

              {/* Character Count and Buttons */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-400">0/1500</span>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelQuestion}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddQuestion}
                    className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
                    disabled={!newQuestionText.trim()}
                  >
                    Submit
                  </button>
                </div>
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
                  <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center mr-3 font-semibold">
                    {q.user
                      ? `${q.user.split(" ")[0][0] || ""}${
                          q.user.split(" ")[1]?.[0] || ""
                        }`.toUpperCase()
                      : "U"}
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">
                        {q.user}
                      </span>
                      <span className="text-gray-500 text-sm">
                        | {q.country}
                      </span>
                      <span className="text-gray-500 text-sm">| {q.dept}</span>
                    </div>
                    <span className="text-xs text-gray-400">{q.date}</span>
                  </div>
                </div>
                {(q.userId === currentUserId || isAdmin) && (
                  <button
                    type="button"
                    aria-label="Delete question"
                    title="Delete question"
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
                          {(c.userId === currentUserId || isAdmin) && (
                            <button
                              type="button"
                              aria-label="Delete comment"
                              title="Delete comment"
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
    </div>
  );
};

export default GoefEvent;
