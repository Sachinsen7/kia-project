import React from "react";

function SignupPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md p-6 w-[500px]">
        <p className="text-sm mb-4">
          Fields marked with <span className="text-black font-bold">✔</span> are
          mandatory.
        </p>

        <form className="space-y-4">
          {/* Email */}
          <div>
            <label className="block font-medium">✔ E-mail</label>
            <div className="flex gap-2 mt-1">
              <input
                type="email"
                className="border p-2 flex-1"
                placeholder="Enter your email"
              />
              <button type="button" className="bg-black text-white px-3">
                Check
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              If you haven't received the confirmation email, please try an
              alternative email address. <br />
              We apologize for the inconvenience
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium">✔ Password</label>
            <input
              type="password"
              className="border p-2 w-full"
              placeholder="Enter password"
            />
            <p className="text-xs text-gray-600 mt-1">
              Passwords must be at least 8 characters, including letters,
              numbers, and special characters.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-medium">✔ Confirm Password</label>
            <input
              type="password"
              className="border p-2 w-full"
              placeholder="Confirm password"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block font-medium">✔ Title</label>
            <select className="border p-2 w-full">
              <option>Select</option>
              <option>Mr</option>
              <option>Ms</option>
              <option>Dr</option>
            </select>
          </div>

          {/* First Name */}
          <div>
            <label className="block font-medium">
              ✔ First Name / Given Name
            </label>
            <input type="text" className="border p-2 w-full" />
          </div>

          {/* Last Name */}
          <div>
            <label className="block font-medium">✔ Last Name / Surname</label>
            <input type="text" className="border p-2 w-full" />
          </div>

          {/* Region */}
          <div>
            <label className="block font-medium">✔ Region</label>
            <select className="border p-2 w-full">
              <option>Select</option>
              <option>Asia</option>
              <option>Europe</option>
              <option>America</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block font-medium">✔ Country</label>
            <select className="border p-2 w-full">
              <option>Select</option>
              <option>India</option>
              <option>USA</option>
              <option>UK</option>
            </select>
          </div>

          {/* Nationality */}
          <div>
            <label className="block font-medium">✔ Nationality</label>
            <select className="border p-2 w-full">
              <option>Select</option>
              <option>Indian</option>
              <option>American</option>
              <option>British</option>
            </select>
          </div>

          {/* Privacy Policy */}
          <div className="flex items-center gap-2">
            <label className="block font-medium">✔ Privacy Policy</label>
            <button type="button" className="bg-gray-200 px-3">
              Read
            </button>
            <input type="checkbox" className="ml-2" /> Agree
          </div>

          {/* Cookies Policy */}
          <div className="flex items-center gap-2">
            <label className="block font-medium">✔ Cookies Policy</label>
            <button type="button" className="bg-gray-200 px-3">
              Read
            </button>
            <input type="checkbox" className="ml-2" /> Agree
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded-full"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
