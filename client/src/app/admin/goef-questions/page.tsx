"use client";

import React, { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiFetch } from "@/config/api";
import { Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type User = { firstName?: string; lastName?: string; _id?: string } | null;

type QuestionResponse = {
  _id: string;
  description: string;
  country: string | null;
  createdAt: string;
  createdBy: User;
  likes: string[];
};

type CommentResponse = {
  _id: string;
  text: string;
  createdAt: string;
  createdBy: User;
};

type TableRow = {
  id: string;
  date: string;
  user: string;
  country: string;
  likes: number;
  descriptionHtml: string;
  descriptionText: string;
  comments: {
    id: string;
    user: string;
    time: string;
    textHtml: string;
    textPlain: string;
  }[];
};

function htmlToText(html: string): string {
  if (typeof window === "undefined") return html;
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return (temp.textContent || temp.innerText || "").trim();
}

export default function AdminGoefThoughtsPage() {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<QuestionResponse[]>(
          `/api/qna?type=ask_kia`,
          "GET",
          undefined,
          token
        );
        const withComments: TableRow[] = await Promise.all(
          data.map(async (q) => {
            const fullName = q.createdBy
              ? `${q.createdBy.firstName || "Unknown"} ${q.createdBy.lastName || ""
                }`.trim() || "Unknown"
              : "Unknown";
            const date = new Date(q.createdAt).toISOString().slice(0, 10);
            const country = q.country || "Unknown";
            const descriptionHtml = q.description || "";
            const descriptionText = htmlToText(descriptionHtml);

            let comments: TableRow["comments"] = [];
            try {
              const commentData = await apiFetch<CommentResponse[]>(
                `/api/comment/${q._id}`,
                "GET",
                undefined,
                token
              );
              comments = commentData.map((c) => {
                const cUser = c.createdBy
                  ? `${c.createdBy.firstName || "Unknown"} ${c.createdBy.lastName || ""
                    }`.trim() || "Unknown"
                  : "Unknown";
                const time = new Date(c.createdAt).toLocaleString();
                const textHtml = c.text || "";
                const textPlain = htmlToText(textHtml);
                return {
                  id: c._id,
                  user: cUser,
                  time,
                  textHtml,
                  textPlain,
                };
              });
            } catch { }

            return {
              id: q._id,
              date,
              user: fullName,
              country,
              likes: Array.isArray(q.likes) ? q.likes.length : 0,
              descriptionHtml,
              descriptionText,
              comments,
            };
          })
        );
        setRows(withComments);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to load thoughts";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const csvContent = useMemo(() => {
    if (!rows.length) return "";
    const header = [
      "ID",
      "Date",
      "User",
      "Country",
      "Likes",
      "Description",
      "CommentsCount",
      "Comments",
    ];
    const lines = rows.map((r) => [
      r.id,
      r.date,
      r.user,
      r.country,
      String(r.likes),
      r.descriptionText.replace(/\r?\n+/g, " "),
      String(r.comments.length),
      r.comments
        .map(
          (c) => `${c.user} (${c.time}): ${c.textPlain.replace(/\r?\n+/g, " ")}`
        )
        .join(" | "),
    ]);
    const esc = (v: string) => {
      const needsQuotes = /[",\n]/.test(v);
      const s = v.replace(/"/g, '""');
      return needsQuotes ? `"${s}"` : s;
    };
    const csv = [header, ...lines]
      .map((row) => row.map(esc).join(","))
      .join("\n");
    return "\uFEFF" + csv;
  }, [rows]);

  const handleDownload = () => {
    if (!rows.length) return;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `goef_thoughts_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute role="admin">
      <div className="min-h-screen bg-gray-200 text-gray-900 p-4 sm:p-6 md:p-10 lg:p-14">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 sm:mb-0">
            Questions on GOEF &
            Our Future
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={!rows.length}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-sm sm:text-base font-bold transition-colors duration-200 disabled:opacity-50"
            >
              <Download size={18} /> Download Excel (CSV)
            </button>
          </div>
        </header>

        {loading && (
          <div className="py-8 text-center text-lg font-medium text-gray-600 animate-pulse">
            Loading thoughts...
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )}

        {!loading && (
          <div className="overflow-x-auto rounded-xl shadow-lg">
            <table className="min-w-full bg-white rounded-xl divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Likes
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rows.map((r, idx) => (
                  <tr
                    key={r.id}
                    className={`hover:bg-gray-50 transition-colors duration-200 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {r.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {r.user}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {r.country}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {r.likes}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div
                        className="max-w-3xl prose prose-sm"
                        dangerouslySetInnerHTML={{ __html: r.descriptionHtml }}
                      />
                      {r.comments.length > 0 && (
                        <CommentSection comments={r.comments} />
                      )}
                    </td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No thoughts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

// ----------------------
// Comment Section
// ----------------------
type CommentSectionProps = {
  comments: {
    id: string;
    user: string;
    time: string;
    textHtml: string;
  }[];
};

function CommentSection({ comments }: CommentSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 border-t pt-3">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-3 py-1 text-xs font-semibold text-white bg-gray-700 rounded hover:bg-gray-800 transition"
      >
        {open ? "Hide Comments" : `Show Comments (${comments.length})`}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2 mt-3 overflow-hidden"
          >
            {comments.map((c) => (
              <div key={c.id} className="bg-gray-50 rounded p-2">
                <div className="text-xs text-gray-600 mb-1">
                  {c.user} — {c.time}
                </div>
                <div
                  className="prose prose-xs max-w-none"
                  dangerouslySetInnerHTML={{ __html: c.textHtml }}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
