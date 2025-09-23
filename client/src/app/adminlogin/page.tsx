"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Placeholder for login logic
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    // Add your API call or authentication logic here
    console.log("Login attempted with:", { email, password });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <LogIn className="text-teal-600 w-12 h-12 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-500 mt-2">Access the Kia HQ Admin Dashboard</p>
        </div>

        <div className="space-y-6">
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border text-black border-gray-300 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border text-black border-gray-300 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium"
          >
            Sign In
          </button>
        </div>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-teal-600 hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;