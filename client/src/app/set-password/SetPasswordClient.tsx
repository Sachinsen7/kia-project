"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BASE_URL } from "@/config/api";

export default function SetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
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
    <div className="min-h-screen bg-white overflow-hidden">
      <header className="w-full text-white my-15 text-center">
        <h2 className="text-3xl text-black font-extrabold my-2 mx-5">
          Set Password
        </h2>
      </header>
      <main className="w-full items-center mx-auto py-2">
        <div className="w-full">
          <div className="bg-white justify-center border shadow-sm">
            <form
              onSubmit={handleSubmit}
              className="w-[80%] justify-center items-center mx-auto "
            >
              <div className="flex justify-center w-full mx-auto">
                <div className="w-[60%] mx-0 my-7">
                  <div className="flex items-center my-2">
                    <label className="block text-md font-medium mr-5 w-[20%] text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="mt-1 text-black block w-[75%] border border-gray-300 rounded-md p-2 bg-gray-100"
                    />
                  </div>
                  <div className="flex items-center my-2">
                    <label className="block text-md font-medium mr-5 w-[20%] text-gray-700">
                      Code
                    </label>
                    <input
                      type="text"
                      value={code}
                      readOnly
                      className="mt-1 text-black block w-[75%] border border-gray-300 rounded-md p-2 bg-gray-100"
                    />
                  </div>
                  <div className="flex items-center my-2">
                    <label className="block text-md font-medium mr-5 w-[20%] text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="mt-1 text-black block w-[75%] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0a1b23]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white h-[94px] my-10 w-[10%] font-semibold hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? "Setting..." : "Set Password"}
                </button>
              </div>
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              {success && (
                <p className="text-green-600 text-sm mt-2">{success}</p>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
