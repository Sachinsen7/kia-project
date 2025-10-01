// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { User2Icon, Eye, EyeOff } from "lucide-react";

// const AdminLogin: React.FC = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       if (!username || !password) {
//         throw new Error("Please fill in all fields");
//       }

//       const response = await fetch(
//         "https://kia-project-hlrv.onrender.com/api/admin/login",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ username, password }),
//         }
//       );

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.message || "Invalid username or password");
//       }

//       const data = await response.json();
//       localStorage.setItem("admintoken", data.token);
//       localStorage.setItem("role", "admin");
//       router.push("/admin");
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError("Something went wrong");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-tr from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-lg">
//         {/* Header */}
//         <div className="flex flex-col items-center mb-8">
//           <User2Icon className="text-teal-600 w-14 h-14 mb-4" />
//           <h1 className="text-3xl font-extrabold text-gray-900">Admin Login</h1>
//           <p className="text-gray-500 mt-2 text-center text-sm sm:text-base">
//             Enter your admin credentials to access the Kia HQ Dashboard
//           </p>
//         </div>

//         {/* Form */}
//         <div className="space-y-6">
//           {error && (
//             <p className="text-red-600 text-sm text-center font-medium">
//               {error}
//             </p>
//           )}

//           {/* Username */}
//           <div>
//             <label
//               htmlFor="username"
//               className="block text-sm font-semibold text-gray-700 mb-2"
//             >
//               Username
//             </label>
//             <input
//               id="username"
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Enter your username"
//               disabled={loading}
//               autoComplete="username"
//               className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400 text-gray-900 transition-all duration-200"
//             />
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <label
//               htmlFor="password"
//               className="block text-sm font-semibold text-gray-700 mb-2"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               disabled={loading}
//               autoComplete="current-password"
//               className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400 text-gray-900 transition-all duration-200"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 mt-6 mr-3  -translate-y-1/2 text-gray-500 hover:text-teal-600 transition-colors"
//             >
//               {showPassword ? (
//                 <EyeOff className="w-5 h-5" />
//               ) : (
//                 <Eye className="w-5 h-5" />
//               )}
//             </button>
//           </div>

//           {/* Login Button */}
//           <button
//             onClick={handleLogin}
//             disabled={loading}
//             className="w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 active:bg-teal-800 transition-colors duration-200 disabled:bg-teal-400 disabled:cursor-not-allowed shadow-md"
//           >
//             {loading ? "Signing In..." : "Sign In"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User2Icon, Eye, EyeOff } from "lucide-react";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!username || !password) {
        throw new Error("Please fill in all fields");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://kia-project-hlrv.onrender.com"}/api/auth/universal-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: username, password }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Invalid username or password");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || "admin");
      router.push(data.role === "admin" ? "/admin" : "/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0a1b23] via-[#0f2c40] to-[#0a1b23] flex items-center justify-center p-4">
      <div className="bg-[#112b3c] shadow-2xl rounded-2xl p-10 w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-lg">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <User2Icon className="text-blue-400 w-14 h-14 mb-4" />
          <h1 className="text-3xl font-extrabold text-white">Admin Login</h1>
          <p className="text-gray-300 mt-2 text-center text-sm sm:text-base">
            Enter your admin credentials to access the Kia HQ Dashboard
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {error && (
            <p className="text-red-400 text-sm text-center font-medium">
              {error}
            </p>
          )}

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-200 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
              autoComplete="username"
              className="w-full px-5 py-3 border border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-white bg-[#0d2535] transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-200 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
              className="w-full px-5 py-3 border border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-white bg-[#0d2535] transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 mt-6 mr-3 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

