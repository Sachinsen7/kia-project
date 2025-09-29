"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/config/api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to send reset token");
        setLoading(false);
        return;
      }

      setSuccess("Password reset token sent to your email.");
      setStep(2);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/verify-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid or expired code");
        setLoading(false);
        return;
      }

      setSuccess("Code verified. Please enter your new password.");
      setStep(3);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
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
      setTimeout(() => router.push("/login"), 2000);
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
          Reset Password
        </h2>
      </header>

      <main className="w-full items-center mx-auto py-2">
        <div className="w-full">
          <div className="bg-white justify-center border shadow-sm">
            <div className="bg-gray-200 text-gray-700 text-center py-4 mb-4">
              Step {step} of 3:{" "}
              {step === 1
                ? "Enter Email"
                : step === 2
                ? "Verify Code"
                : "Reset Password"}
            </div>

            <form
              onSubmit={
                step === 1
                  ? handleForgotPassword
                  : step === 2
                  ? handleVerifyCode
                  : handleResetPassword
              }
              className="w-[80%] justify-center items-center mx-auto"
            >
              <div className="flex justify-center w-full mx-auto">
                <div className="w-[60%] mx-0 my-7">
                  {step === 1 && (
                    <div className="flex items-center my-2">
                      <label className="block text-md font-medium mr-5 w-[20%] text-gray-700">
                        E-mail
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 text-black block w-[75%] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0a1b23]"
                      />
                    </div>
                  )}

                  {step === 2 && (
                    <div className="flex items-center my-2">
                      <label className="block text-md font-medium mr-5 w-[20%] text-gray-700">
                        Code
                      </label>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        className="mt-1 text-black block w-[75%] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0a1b23]"
                      />
                    </div>
                  )}

                  {step === 3 && (
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
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white h-[94px] my-10 w-[10%] font-semibold hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading
                    ? "Processing..."
                    : step === 1
                    ? "Send Code"
                    : step === 2
                    ? "Verify Code"
                    : "Reset Password"}
                </button>
              </div>

              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              {success && (
                <p className="text-green-600 text-sm mt-2">{success}</p>
              )}
            </form>

            {/* Back to Login */}
            <div className="mt-4 py-4 text-center text-sm text-gray-600">
              <a href="/login" className="text-blue-600 underline">
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
