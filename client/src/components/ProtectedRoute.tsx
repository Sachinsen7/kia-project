"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ role, children }: { role: "admin" | "user"; children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (!savedRole || savedRole !== role) {
      router.replace(role === "admin" ? "/adminlogin" : "/login");
    } else {
      setAllowed(true);
    }
  }, [role, router]);

  if (!allowed) return <p>Loading...</p>;
  return <>{children}</>;
}
