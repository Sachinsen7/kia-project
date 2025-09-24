"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/config/api";
import Image from "next/image";

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

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-white overflow-hidden"> 
      {/* Header Banner */}
      <header className="w-full bg-[#0a1b23] text-white  text-center">
        <Image
          src={"/login.png"}
          alt="Login"
          width={500}
          height={300}
          className="w-full"
        />
      </header>

      <h2 className="text-2xl text-black font-bold my-2 mx-5">Login</h2>
      {/* Main Content */}
      <main className="w-full items-center  mx-5 py-2">
        <div className="w-full">
          <div className="bg-white justify-center  shadow-sm">

            {/* Sign-up Prompt */}
            <div className="bg-gray-200 text-gray-700 text-center py-4 mb-4">
              If you have not yet signed up, click <a href="/signup" className="text-black font-semibold underline">Sign up</a>.
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-[80%] justify-center mx-auto ">
              <div className="flex justify-center w-full mx-auto">
                <div className="w-[60%] mx-0 my-7">
                  <div className="flex items-center my-2  " >
                    <label className="block text-md font-medium mr-5 w-[20%] text-gray-700">E-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 block w-[75%] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0a1b23]"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="block mr-5 w-[20%] text-md font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="mt-1 block w-[75%]  border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0a1b23]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className=" bg-black text-white h-22 my-10 w-[10%]  font-semibold hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>

              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </form>
            <hr />

            {/* Forgot Password */}
            <div className="mt-4 py-4 text-center text-sm text-gray-600">
              <div>

              Forgot your Password?{" "}
              </div>
              <a href="/forgot-password" className="text-blue-600 underline">
                Click here 
              </a>
               &nbsp; to reset Password via E-mail
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}