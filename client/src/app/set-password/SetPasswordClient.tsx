"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BASE_URL } from "@/config/api";
import { Shield } from "lucide-react";

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
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div
        className="w-full max-w-md bg-white shadow-2xl rounded-lg p-12 border border-gray-200
                  flex flex-col justify-center min-h-[400px] max-h-[90%] overflow-hidden"
      >
        {/* Title */}
        <div className="text-center mb-5">
          <Shield className="mx-auto mb-3 text-gray-700" size={48} />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Set Your Password</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1 mt-4">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter your new password"
              className="w-full text-black placeholder-gray-500 border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your new password"
              className="w-full text-black border placeholder-gray-500 border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Set Password Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors duration-200"
          >
            {loading ? "Setting Password..." : "Set Password"}
          </button>

          {/* Error and Success Messages */}
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
        </form>

        {/* Back to Login */}
        <div className="text-center text-sm text-gray-600 mt-4">
          <p>
            Remember your password?{" "}
            <a
              href="/login"
              className="text-black underline hover:text-gray-700"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
