"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { apiFetch } from "@/config/api";

function SignupPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    title: "Select",
    firstName: "",
    lastName: "",
    region: "Select",
    country: "Select",
    nationality: "Select",
    agreePrivacy: false,
    agreeCookies: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const openModal = (type: string) => {
    if (type === "privacy") {
      setModalContent(
        "Privacy Policy: We respect your privacy. Your personal information will only be used for account purposes and never shared without your consent."
      );
    } else {
      setModalContent(
        "Terms & Conditions: By creating an account, you agree to comply with our rules regarding fair usage, security, and responsibility of account data."
      );
    }
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!formData.agreePrivacy || !formData.agreeCookies) {
      setMessage("Please agree to Privacy Policy and Cookies Policy.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Password and Confirm Password do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await apiFetch("/api/auth/signup", "POST", {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        title: formData.title,
        firstName: formData.firstName,
        lastName: formData.lastName,
        region: formData.region,
        country: formData.country,
        nationality: formData.nationality,
      });

      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
        console.error(err.message);
      } else {
        setMessage("Signup failed.");
        console.error(err);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="shadow-lg my-3 rounded-lg w-[70%] bg-white">
        <div className="text-sm mb-6 bg-gray-200 text-black py-4 px-6 rounded-t-lg border-b">
          Fields marked with <span className="text-black font-bold">✔</span> are mandatory.
        </div>

        <form className="mx-10 py-6 space-y-6" onSubmit={handleSubmit}>
          {/* Input Fields */}
          {[
            { label: "✔ E-mail", name: "email", type: "email", placeholder: "Enter your email", info: "If you haven't received the confirmation email, try another email." },
            { label: "✔ Password", name: "password", type: "password", placeholder: "Enter password", info: "Password must be at least 8 characters, including letters, numbers, and special characters." },
            { label: "✔ Confirm Password", name: "confirmPassword", type: "password", placeholder: "Confirm password" },
            { label: "✔ First Name", name: "firstName", type: "text", placeholder: "Enter first name" },
            { label: "✔ Last Name", name: "lastName", type: "text", placeholder: "Enter last name" },
          ].map((field, idx) => (
            <div key={idx} className="border rounded bg-gray-50 flex">
              <div className="w-1/3 border-r border-gray-300 p-4 flex items-center">
                <label className="font-bold text-black">{field.label}</label>
              </div>
              <div className="w-2/3 p-4">
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name as keyof typeof formData] as string}
                  onChange={handleChange}
                  className="border p-2 w-full placeholder-gray text-black rounded"
                />
                {field.info && <p className="text-xs text-gray-700 mt-2">{field.info}</p>}
              </div>
            </div>
          ))}

          {/* Dropdown Fields */}
          {[
            { label: "✔ Title", name: "title", options: ["Select", "Mr", "Ms", "Dr"] },
            { label: "✔ Region", name: "region", options: ["Select", "Asia", "Europe", "America"] },
            { label: "✔ Country", name: "country", options: ["Select", "India", "USA", "UK"] },
            { label: "✔ Nationality", name: "nationality", options: ["Select", "Indian", "American", "British"] },
          ].map((dropdown, idx) => (
            <div key={idx} className="border rounded bg-gray-50 flex">
              <div className="w-1/3 border-r border-gray-300 p-4 flex items-center">
                <label className="font-bold text-black">{dropdown.label}</label>
              </div>
              <div className="w-2/3 p-4">
                <select
                  name={dropdown.name}
                  value={formData[dropdown.name as keyof typeof formData] as string}
                  onChange={handleChange}
                  className="border p-2 w-full text-black rounded"
                >
                  {dropdown.options.map((opt, i) => (
                    <option key={i} value={opt} className="text-black">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          {/* Privacy & Cookies */}
          {[
            { label: "Privacy Policy", type: "privacy", name: "agreePrivacy" },
            { label: "Cookies Policy", type: "terms", name: "agreeCookies" },
          ].map((item, idx) => (
            <div key={idx} className="border rounded bg-gray-50 flex">
              <div className="w-1/3 border-r border-gray-300 p-4 flex items-center">
                <label className="font-bold text-black">✔ {item.label}</label>
              </div>
              <div className="w-2/3 p-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => openModal(item.type)}
                  className="bg-black text-white px-4 rounded-2xl"
                >
                  Read
                </button>
                <input
                  type="checkbox"
                  name={item.name}
                  checked={formData[item.name as keyof typeof formData] as boolean}
                  onChange={handleChange}
                  className="ml-2"
                />
                <span className="text-black">Agree</span>
              </div>
            </div>
          ))}

          {/* Submit */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-8 py-2 rounded-full hover:bg-gray-800 transition"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            {message && <p className="text-red-500 mt-2">{message}</p>}
          </div>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          <div className="relative bg-white p-6 rounded-lg w-[400px] shadow-xl z-10">
            <h2 className="text-lg text-black font-bold mb-2">Document</h2>
            <p className="text-gray-700 mb-4">{modalContent}</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-black text-white px-4 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignupPage;
