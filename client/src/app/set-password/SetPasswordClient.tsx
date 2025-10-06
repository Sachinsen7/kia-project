"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BASE_URL } from "@/config/api";

export default function SetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") || "";
  const code = searchParams.get("token") || "";

  // Debug logging
  console.log("Set Password Debug:", {
    email,
    code: code.substring(0, 10) + "...",
  });

  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/auth/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to reset password");
        setLoading(false);
        return;
      }
      setSuccess("Password reset successful. Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-4 text-black text-center">
          Set Your Password
        </h2>  
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border text-black border-gray-300 rounded px-4 py-2"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border text-black border-gray-300 rounded px-4 py-2"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0a1b23] text-white py-2 rounded font-semibold hover:bg-black transition-colors"
          >
            {loading ? "Setting..." : "Set Password"}
          </button>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
        </form>
      </div>
    </div>
  );
}
