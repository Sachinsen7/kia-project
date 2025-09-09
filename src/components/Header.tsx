import Image from "next/image";

export default function Header() {
    return (
        <header className="w-full bg-white shadow-md ">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 border-b-4">
                {/* Left Side - Company Text */}
                <h1 className="text-xl font-bold text-gray-800">
                    웹기획_사이드바

                    
                </h1>

                {/* Right Side - Logo */}
                <Image
                    src="/logo1.png"
                    alt="Company Logo"
                    width={300}
                    height={150}
                    className="w-24 h-12 sm:w-32 sm:h-16 md:w-40 md:h-20  lg:h-10 lg:w-24"
                />
            </div>

            <div>
                <p className="text-xs text-gray-500 pl-40 py-4">
                    가설적 구성이며, 실제 개발단계에서 일부 변경될 수 있습니다.
                </p>
            </div>
        </header>
    );
}
