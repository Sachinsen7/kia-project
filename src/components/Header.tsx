import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left Side - Company Text */}
        <h1 className="text-xl font-bold text-gray-800">
          MyCompany
        </h1>

        {/* Right Side - Logo */}
        <Image
          src="/logo.png" 
          alt="Company Logo"
          width={40}
          height={40}
          className="h-10 w-auto"
        />
      </div>
    </header>
  );
}
