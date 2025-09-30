"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Heart, MessageSquare, Trash2 } from "lucide-react";
import { apiFetch } from "@/config/api";
import Image from "next/image";

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
    useState("Select Country");
  const [commentEditorContent, setCommentEditorContent] = useState("");
  const [countries] = useState([
    "Select Country",
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
    if (!title || !description || country === "Select Country") return;

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
      setNewQuestionCountry("Select Country");
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

  const handleCancelQuestion = () => {
    setShowInput(false);
    setNewQuestionTitle("");
    setNewQuestionText("");
    setNewQuestionCountry("Select Country");
  };

  if (!mounted) return null;

  return (
    <div className="relative w-full min-h-screen bg-white px-6 md:px-16 py-12">
      <div className="bg-white relative shadow-2xl rounded-2xl w-full max-w-6xl m-6 p-8 md:p-14">
        <div className="w-full pb-10 px-4">
          <h1 className="text-3xl mt-10 md:text-5xl text-gray-900 mb-2 inline-block">
            Questions on GOEF and our future
            {/* Vertical black bar flush with top */}
          </h1>
        </div>
        <br />
        <div className="px-4 w-[1108px] h-[312px] md:px-8 text-gray-700 leading-relaxed">
          <div>
            <p className="text-gray-700 text-[15px]">
              The GOEF event is where the future of Kia takes shape, and we want
              your voice to be a part of it. <br /> Feel free to ask any
              questions you&apos;ve been curious about regarding Kia HQ. We are
              always listening <br /> to your valuable input.
            </p>

            <h2 className="font-bold text-gray-800 text-[15px] mt-1">
              How to Participate
            </h2>
            <p className="text-gray-700 text-[15px]">
              Submit Your Question: Please leave your questions in the comments
              below.
            </p>
            <p className="text-gray-700 text-[15px]">
              Get Your Answer: We will select questions to be answered directly
              on-site during the GOEF event.
            </p>

            <h2 className="font-bold text-[15px] mt-2 text-gray-800">
              For Unanswered Questions
            </h2>
            <p className="text-gray-700 text-[15px]">
              We appreciate your understanding that we may not be able to answer
              all questions immediately due <br /> to the nature of the live
              event. If your question isn&apos;t answered on the spot, a
              dedicated team <br /> member will review it after the event and
              provide a thorough response.
            </p>

            <div className="">
              <Image
                className="absolute top-49 right-0 object-cover"
                width={600}
                height={1000}
                src="/askkia/border.png"
                alt=""
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loadingQuestions ? (
          <p className="text-gray-500 text-sm">Loading questions...</p>
        ) : (
          questions.map((q) => (
            <div
              key={q.id}
              className="border border-gray-300 bg-[#edeef1] mb-4 mt-10 p-5"
            >
              {/* User info */}
              <div className="flex items-center justify-between px-4 py-3">
                {/* Left: Avatar + User info */}
                <div className="flex items-center">
                  {/* Avatar */}
                  <img
                    src={"/default-avatar.png"}
                    alt={q.user}
                    className="w-10 h-10 rounded-full mr-3"
                  />

                  {/* User Info */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 text-sm">
                      {q.user}{" "}
                      <span className="font-normal text-gray-500">
                        / {q.dept}
                      </span>
                    </span>
                    <span className="text-xs text-gray-400">{q.date}</span>
                  </div>
                </div>

                {/* Delete button (if owner) */}
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
                          <span className="text-xs text-gray-400">
                            {c.time}
                          </span>
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

        {/* Write Post Section - Refined to match the design */}
        <div className="mb-8 mt-10 bg-white border border-gray-200 rounded-lg p-6">
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

              {/* Country Selector */}
              <select
                title="Country"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-500 bg-white focus:outline-none focus:border-gray-400 transition-colors"
                value={newQuestionCountry}
                onChange={(e) => setNewQuestionCountry(e.target.value)}
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              {/* Title Input */}
              <input
                type="text"
                placeholder="제목을 입력해 주세요."
                value={newQuestionTitle}
                onChange={(e) => setNewQuestionTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              />

              {/* Rich Text Editor */}
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                {/* Editor Toolbar */}
                <div className="bg-gray-50 border-b border-gray-300 px-4 py-2 flex items-center gap-1">
                  <select className="bg-white border border-gray-300 rounded px-3 py-1 text-sm text-gray-700">
                    <option>Heading</option>
                    <option>Paragraph</option>
                    <option>H1</option>
                    <option>H2</option>
                    <option>H3</option>
                  </select>
                  <div className="flex items-center gap-1 ml-2">
                    <button className="p-2 hover:bg-gray-200 rounded text-gray-700 font-bold">
                      B
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded text-gray-700 italic">
                      I
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded text-gray-700">
                      🔗
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded text-gray-700">
                      ≡
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded text-gray-700">
                      ⋮
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded text-gray-700">
                      H
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded text-gray-700">
                      ❝
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded text-gray-700">
                      ‹›
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded text-gray-700">
                      🖼
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded text-gray-700">
                      ⚡
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded text-gray-700">
                      🖼
                    </button>
                  </div>
                </div>

                {/* Editor Content Area */}
                <div className="min-h-[300px] p-4 bg-white">
                  <EditorComponent
                    onUpdate={setNewQuestionText}
                    initialContent={newQuestionText}
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
                    disabled={
                      !newQuestionTitle.trim() ||
                      !newQuestionText.trim() ||
                      newQuestionCountry === "Select Country"
                    }
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AskKia;
