"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BASE_URL } from "@/config/api";

export default function SetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const token = params.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/set-password`, {
      // const res = await fetch(`http://localhost:5000/api/auth/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to set password.");
        setLoading(false);
        return;
      }
      setSuccess("Password set successfully! You can now log in.");
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Set Your Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
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