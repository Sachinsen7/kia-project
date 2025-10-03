// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { BASE_URL } from "@/config/api";
// import Image from "next/image";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch(`${BASE_URL}/api/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Login failed");
//         setLoading(false);
//         return;
//       }

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       router.push("/");
//     } catch (err) {
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white overflow-hidden">
//       {/* Header Banner */}
//       <header className="w-full text-white my-15  text-center">
//         <h2 className="text-3xl text-black font-extrabold my-2 mx-5">Login</h2>
//       </header>

//       {/* Main Content */}
//       <main className="w-full items-center mx-auto py-2">
//         <div className="w-full">
//           <div className="bg-white justify-center  border shadow-sm">
//             {/* Sign-up Prompt */}
//             <div className="bg-gray-200 text-gray-700 text-center py-4 mb-4">
//               If you have not yet signed up, click{" "}
//               <a href="/signup" className="text-black font-semibold underline">
//                 Sign up
//               </a>
//               .
//             </div>

//             {/* Form */}
//             <form
//               onSubmit={handleSubmit}
//               className="w-[80%] justify-center items-center mx-auto "
//             >
//               <div className="flex justify-center w-full mx-auto">
//                 <div className="w-[60%] mx-0 my-7">
//                   <div className="flex items-center my-2  ">
//                     <label className="block text-md font-medium mr-5 w-[20%] text-gray-700">
//                       E-mail
//                     </label>
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                       className="mt-1 text-black block w-[75%] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0a1b23]"
//                     />
//                   </div>
//                   <div className="flex items-center">
//                     <label className="block mr-5 w-[20%] text-md font-medium text-gray-700">
//                       Password
//                     </label>
//                     <input
//                       type="password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                       className="mt-1 text-black block w-[75%]  border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0a1b23]"
//                     />
//                   </div>
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className=" bg-black text-white h-[94px] my-10 w-[10%]  font-semibold hover:bg-gray-800 disabled:opacity-50"
//                 >
//                   {loading ? "Logging in..." : "Login"}
//                 </button>
//               </div>

//               {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
//             </form>
//             <hr />

//             {/* Forgot Password */}
//             <div className="mt-4 py-4 text-center text-sm text-gray-600">
//               <div>Forgot your Password? </div>
//               <a href="/forgot-password" className="text-blue-600 underline">
//                 Click here
//               </a>
//               &nbsp; to reset Password via E-mail
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/config/api";
import toast from "react-hot-toast";
import { Shield } from "lucide-react";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/universal-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      // console.log(data.user.id, "user id hai ye dhyan karo");

      if (!res.ok) {
        // show toast error (inactive user / wrong creds / etc.)
        toast.error(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // success
      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        localStorage.removeItem("user");
      }
      if (data.role) {
        localStorage.setItem("role", data.role);
      }

      toast.success("Login successful!");
      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <div className="min-h-screen bg-white overflow-hidden">
  //     {/* Header Banner */}
  //     <header className="w-full text-white my-15 text-center">
  //       <h2 className="text-3xl text-black font-extrabold my-2 mx-5">Login</h2>
  //     </header>

  //     {/* Main Content */}
  //     <main className="w-full items-center mx-auto py-2">
  //       <div className="w-full">
  //         <div className="bg-white justify-center border shadow-sm">
  //           {/* Sign-up Prompt */}
  //           <div className="bg-gray-200 text-gray-700 text-center py-4 mb-4">
  //             If you have not yet signed up, click{" "}
  //             <a href="/signup" className="text-black font-semibold underline">
  //               Sign up
  //             </a>
  //             .
  //           </div>

  //           {/* Form */}
  //           <form
  //             onSubmit={handleSubmit}
  //             className="w-[80%] justify-center items-center mx-auto "
  //           >
  //             <div className="flex justify-center w-full mx-auto">
  //               <div className="w-[60%] mx-0 my-7">
  //                 <div className="flex items-center my-2">
  //                   <label className="block text-md font-medium mr-5 w-[20%] text-gray-700">
  //                     E-mail or Username
  //                   </label>
  //                   <input
  //                     type="text"
  //                     value={identifier}
  //                     onChange={(e) => setIdentifier(e.target.value)}
  //                     required
  //                     aria-label="Identifier"
  //                     title="Identifier"
  //                     placeholder="Enter your email or admin username"
  //                     className="mt-1 text-black block w-[75%] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0a1b23]"
  //                   />
  //                 </div>
  //                 <div className="flex items-center">
  //                   <label className="block mr-5 w-[20%] text-md font-medium text-gray-700">
  //                     Password
  //                   </label>
  //                   <input
  //                     type="password"
  //                     value={password}
  //                     onChange={(e) => setPassword(e.target.value)}
  //                     required
  //                     aria-label="Password"
  //                     title="Password"
  //                     placeholder="Enter your password"
  //                     className="mt-1 text-black block w-[75%] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0a1b23]"
  //                   />
  //                 </div>
  //               </div>
  //               <button
  //                 type="submit"
  //                 disabled={loading}
  //                 className="bg-black text-white h-[94px] my-10 w-[10%] font-semibold hover:bg-gray-800 disabled:opacity-50"
  //               >
  //                 {loading ? "Logging in..." : "Login"}
  //               </button>
  //             </div>
  //           </form>
  //           <hr />

  //           {/* Forgot Password */}
  //           <div className="mt-4 py-4 text-center text-sm text-gray-600">
  //             <div>Forgot your Password? </div>
  //             <a href="/forgot-password" className="text-blue-600 underline">
  //               Click here
  //             </a>
  //             &nbsp; to reset Password via E-mail
  //           </div>
  //         </div>
  //       </div>
  //     </main>
  //   </div>
  // );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Login Box */}
      <div className="w-full max-w-md bg-white my-auto shadow-2xl rounded-lg p-8 border border-gray-200">
        {/* Title */}
        <div className="text-center mb-8 ">
          <Shield className="mx-auto mb-6 text-gray-700" size={48} />
          <h2 className="text-3xl mx-auto font-bold text-center text-gray-900 mb-4">
            Administrator Sign In
          </h2>
          <div className="text-gray-900 text-sm mx-auto px-auto">GOEF File Management System</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Identifier */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              E-mail or Username
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="Enter your username"
              className="w-full text-black placeholder-gray-500 border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full text-black border placeholder-gray-500 border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors duration-200"
          >
            {loading ? "Sign In..." : "Sign In"}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="text-center text-sm text-gray-600 mt-6">
          <p>Forgot your password?</p>
          <a
            href="/forgot-password"
            className="text-black underline hover:text-gray-700"
          >
            Reset via E-mail
          </a>
        </div>
      </div>
    </div>
  );


}

