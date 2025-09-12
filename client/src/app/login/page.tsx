"use client";

import { useState } from "react";

export default function Login() {
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <main className="flex flex-col items-center flex-1 ">
        <div className="w-full max-w-4xl mt-6 px-4">
          <img
            src="/login-banner.png"
            alt="Kia Car"
            className="w-full max-h-[500px] object-contain sm:object-cover"
          />

          <form className="w-full flex flex-col items-center py-6 bg-white border border-gray-200 rounded-md shadow-sm mt-4">
            <div className="flex flex-col sm:flex-row  gap-4 px-4 mx-4">
              <input
                type="text"
                placeholder="Username"
                className="border border-gray-300 px-4 py-2 w-full text-gray-900 rounded focus:outline-none focus:border-[#0a1b23]"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 px-4 py-2 w-full text-gray-900 rounded focus:outline-none focus:border-[#0a1b23]"
              />
              <button
                type="submit"
                className="bg-[#0a1b23] whitespace-nowrap text-white px-8 py-2 rounded font-semibold hover:bg-black transition-colors w-full sm:w-auto"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
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
