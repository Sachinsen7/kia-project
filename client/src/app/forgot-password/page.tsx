"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/config/api";
import toast from "react-hot-toast";

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
      toast.success("Password reset token sent to your email.");
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
      toast.success("Code verified successfully!");
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
      toast.success("Password reset successful!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 text-gray-900 p-4 sm:p-6 md:p-10 lg:p-14">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 sm:mb-0">
          Reset Password
        </h1>
        <div className="flex items-center gap-3">
          <div className="text-sm sm:text-base text-gray-600 font-medium">
            Step {step} of 3:{" "}
            {step === 1
              ? "Enter Email"
              : step === 2
              ? "Verify Code"
              : "Reset Password"}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10 max-w-md mx-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-200">
            {success}
          </div>
        )}

        <form
          onSubmit={
            step === 1
              ? handleForgotPassword
              : step === 2
              ? handleVerifyCode
              : handleResetPassword
          }
          className="space-y-6"
        >
          {step === 1 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                E-mail Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 placeholder-gray-400 text-gray-900 bg-white transition-all duration-200"
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="Enter the 6-digit code from your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 placeholder-gray-400 text-gray-900 bg-white transition-all duration-200"
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter your new password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 placeholder-gray-400 text-gray-900 bg-white transition-all duration-200"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-sm sm:text-base font-bold transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                {step === 1
                  ? "Send Verification Code"
                  : step === 2
                  ? "Verify Code"
                  : "Reset Password"}
              </>
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <a 
            href="/login" 
            className="text-gray-600 hover:text-gray-800 underline font-medium transition-colors duration-200"
          >
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
