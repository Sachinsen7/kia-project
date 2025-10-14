"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Heart, MessageSquare, Trash2, X } from "lucide-react";
import { apiFetch } from "@/config/api";
import Image from "next/image";
import toast from "react-hot-toast";

// ----------- Types -----------
type User = {
  firstName: string;
  lastName: string;
  _id?: string;
  email: string;
};

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
  createdBy: User | null;
  createdByName?: string;
};

type QuestionResponse = {
  _id: string;
  title: string;
  description: string;
  country: string | null; // Allow null since backend middleware may fail
  createdAt: string;
  createdBy: User | null;
  likes: string[];
};

type AddQuestionResponse = { qna: QuestionResponse };
type AddCommentResponse = { comment: CommentResponse };
type LikeResponse = { success: boolean; likes: string[]; likesCount: number };

const EditorComponent = dynamic(
  () => import("./EditorComponent").then((mod) => mod.default),
  { ssr: false }
);

type AskKiaProps = {
  onClose?: () => void;
};

const AskKia: React.FC<AskKiaProps> = ({ onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [commentEditorContent, setCommentEditorContent] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const commentEditorRef = useRef<HTMLDivElement>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  let currentUserId = "";
  let currentUser: User | null = null;
  let currentUserFullName = "Unknown";
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        currentUserId =
          typeof parsed === "string" ? parsed : parsed._id || parsed.id || "";
        currentUser = typeof parsed === "object" ? (parsed as User) : null;
        const firstName = currentUser?.firstName || "";
        const lastName = currentUser?.lastName || "";
        currentUserFullName = `${firstName} ${lastName}`.trim() || "Unknown";
      } catch (err) {
        console.error("Error parsing user data from localStorage:", err);
      }
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
        return data.map((c) => ({
          id: c._id,
          user: c.createdBy
            ? `${c.createdBy.firstName || "Unknown"} ${c.createdBy.lastName || ""
              }`.trim() || "Unknown"
            : "Unknown",
          userId: c.createdBy?._id || "",
          text: c.text,
          time: new Date(c.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
      } catch (err) {
        console.error("Error fetching comments:", err);
        toast.error("Failed to load comments");
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
            user: q.createdBy
              ? `${q.createdBy.firstName || "Unknown"} ${q.createdBy.lastName || ""
                }`.trim() || "Unknown"
              : "Unknown",
            userId: q.createdBy?._id || "",
            dept: "KUS",
            date: new Date(q.createdAt).toISOString().slice(0, 10),
            title: q.title,
            country: q.country || "Unknown", // Handle null country
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
      console.error("Error fetching questions:", err);
      toast.error("Failed to load questions");
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
    if (!title || !description) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await apiFetch<AddQuestionResponse>(
        "/api/qna",
        "POST",
        { title, description, type: "ask_kia" },
        token
      );
      const newQ: Question = {
        id: response.qna._id,
        user: response.qna.createdBy
          ? `${response.qna.createdBy.firstName || "Unknown"} ${response.qna.createdBy.lastName || ""
            }`.trim() || "Unknown"
          : currentUserFullName,
        userId: response.qna.createdBy?._id || currentUserId,
        dept: "KUS",
        date: new Date(response.qna.createdAt).toISOString().slice(0, 10),
        title: response.qna.title,
        country: response.qna.country || "Unknown",
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
      toast.success("Question posted successfully");
    } catch (err) {
      console.error("Error adding question:", err);
      const message =
        err instanceof Error ? err.message : "Failed to post question";
      toast.error(message);
    }
  };

  // Add comment
  const handleAddComment = async (id: string) => {
    const commentText = commentEditorContent.trim();
    if (!commentText) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const response = await apiFetch<AddCommentResponse>(
        `/api/comment/${id}`,
        "POST",
        { text: commentText },
        token
      );
      const displayNameFromUser = response.comment.createdBy
        ? `${response.comment.createdBy.firstName || "Unknown"} ${response.comment.createdBy.lastName || ""
          }`.trim() || "Unknown"
        : undefined;

      const newComment: Comment = {
        id: response.comment._id,
        user:
          displayNameFromUser ||
          response.comment.createdByName ||
          currentUserFullName ||
          "Unknown",
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
      toast.success("Comment posted successfully");
    } catch (err) {
      console.error("Error adding comment:", err);
      const message =
        err instanceof Error ? err.message : "Failed to post comment";
      toast.error(message);
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
      if (!response.success) {
        toast.error("Failed to toggle like");
        return;
      }
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
      const message =
        err instanceof Error ? err.message : "Failed to toggle like";
      toast.error(message);
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
      toast.success("Question deleted successfully");
    } catch (err) {
      console.error("Error deleting question:", err);
      const message =
        err instanceof Error ? err.message : "Failed to delete question";
      toast.error(message);
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
      toast.success("Comment deleted successfully");
    } catch (err) {
      console.error("Error deleting comment:", err);
      const message =
        err instanceof Error ? err.message : "Failed to delete comment";
      toast.error(message);
    }
  };

  const toggleCommentInput = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, showCommentInput: !q.showCommentInput } : q
      )
    );
  };

  const handleCancelQuestion = () => {
    setShowInput(false);
    setNewQuestionTitle("");
    setNewQuestionText("");
  };

  if (!mounted) return null;

  return (
    <div className="relative w-full min-h-screen bg-white px-6 md:px-16 py-12">
      <div className="bg-white relative shadow-2xl rounded-2xl w-full max-w-6xl mx-6 px-8 pb-6 md:px-14">
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
            />
          </button>
        )}
        <Image
          width={900}
          height={22}
          src="/Group 108.png"
          alt="Close sidebar"
          className="cursor-pointer mb-6  "
        />{" "}
        <br />
        <div className="px-4 mt-20 w-[1108px] h-[312px] md:px-8 text-gray-700 leading-relaxed">
          <div>
            <p className="text-gray-700 text-[14px]">
              GOEF is not just an event. It is a special journey where we build Kia's future together. <br />Your
              insightful questions and keen perspectives are the most crucial driving force behind <br /> our innovation.
              Join us in shaping our future and feel free to share your curiosity about <br /> Kia's vision. Every single
              one of your voices becomes a valuable seed for the future.
            </p>

            <h2 className="font-bold text-gray-800 text-[14px] mt-1">
              How to Participate
            </h2>
            <p className="text-gray-700 text-[14px]">
              - <span className="font-bold">Submit your question</span>: Feel free to share your questions about a wide range of topics <br /> to be
              discussed at GOEF, including our strategy, business plans, and insights into our <br /> customers and
              the market.
            </p>
            <p className="text-gray-700 text-[14px]">
              - <span className="font-bold"> Get Your Answer</span>: We will select questions to be answered directly
              on-site <br /> during the GOEF event.
            </p>

            <h2 className="font-bold text-[14px] mt-2 text-gray-800">
              For Unanswered Questions
            </h2>
            <p className="text-gray-700 text-[14px]">
              We appreciate your understanding that we may not be able to answer
              all questions <br /> immediately due to the nature of the live
              event. If your question isn&apos;t answered on the <br /> spot, a
              dedicated team member will review it after the event and
              provide a thorough <br /> response.
            </p>

            <div className="">
              <Image
                className="absolute top-[284px] right-0 object-cover"
                width={600}
                height={1000}
                src="/askkia/border-2.png"
                alt=""
              />
            </div>
          </div>
        </div>

        {/* Write Post Section */}
        <div className="mb-8 mt-24 bg-white border border-gray-200 rounded-lg p-6">
          {!showInput ? (
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Write Post
              </h2>
              <button
                onClick={() => setShowInput(true)}
                className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium"
              >
                Create a question
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Write Post
              </h2>
              <input
                type="text"
                placeholder="제목을 입력해 주세요."
                value={newQuestionTitle}
                onChange={(e) => setNewQuestionTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              />
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="min-h-[300px] p-4 bg-white">
                  <EditorComponent
                    onUpdate={setNewQuestionText}
                    initialContent={newQuestionText}
                  />
                </div>
              </div>
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
                    disabled={
                      !newQuestionTitle.trim() || !newQuestionText.trim()
                    }
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loadingQuestions ? (
          <p className="text-gray-500 text-sm">Loading questions...</p>
        ) : questions.length === 0 ? (
          <p className="text-gray-500 text-sm">No questions available.</p>
        ) : (
          questions.map((q) => (
            <div
              key={q.id}
              className="border border-gray-300 bg-[#edeef1] mb-4 mt-10 p-5"
            >
              {/* User info */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 font-semibold mr-3">
                    {(() => {
                      const names = q.user.trim().split(" ");
                      const initials =
                        names.length >= 2
                          ? `${names[0][0]}${names[1][0]}`
                          : names[0][0];
                      return initials.toUpperCase();
                    })()}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">
                        {q.user}
                      </span>
                      <span className="text-gray-500 text-sm">
                        | {q.country}
                      </span>
                      <span className="text-gray-500 text-sm">| {q.dept}</span>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">{q.date}</span>
                  </div>
                </div>
                {q.userId === currentUserId && (
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="text-red-500 hover:text-red-700 border-2 border-blue-500 p-1"
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
                          <span className="text-xs text-gray-400">
                            {c.time}
                          </span>
                        </div>
                        {(c.userId === currentUserId ||
                          (localStorage.getItem("role") || "").toLowerCase() ===
                          "admin") && (
                            <button
                              onClick={() => handleDeleteComment(q.id, c.id)}
                              className="text-red-500 hover:text-red-700 border-2 border-blue-500 p-1"
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
    </div>
  );
};

export default AskKia;
