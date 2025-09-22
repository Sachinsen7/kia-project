"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/config/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log(res);
      

      const data = await res.json();
      console.log(data);
      

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Save token securely
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard or home
      router.push("/dashboard");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <main className="flex flex-col items-center flex-1">
        <div className="w-full max-w-4xl mt-6 px-4">
          <img
            src="/login-banner.png"
            alt="Kia Car"
            className="w-full max-h-[500px] object-contain sm:object-cover"
          />

          <form
            className="w-full flex flex-col items-center py-6 bg-white border border-gray-200 rounded-md shadow-sm mt-4"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col sm:flex-row gap-4 px-4 mx-4 w-full">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-gray-300 px-4 py-2 w-full text-gray-900 rounded focus:outline-none focus:border-[#0a1b23]"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-gray-300 px-4 py-2 w-full text-gray-900 rounded focus:outline-none focus:border-[#0a1b23]"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0a1b23] whitespace-nowrap text-white px-8 py-2 rounded font-semibold hover:bg-black transition-colors w-full sm:w-auto"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </div>
            {error && (
              <div className="text-red-600 mt-4 text-sm font-medium">{error}</div>
            )}
          </form>
        </div>
      </main>

      <footer className="w-full flex flex-col items-center mt-8 mb-4">
        <div className="w-full max-w-3xl text-center text-gray-500 text-xs border-t pt-4">
          © 2016 Kia Dealer Academy. All rights reserved. &nbsp;
          <a href="#" className="underline mx-1">
            Terms of Use
          </a>
          <a href="#" className="underline mx-1">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}
