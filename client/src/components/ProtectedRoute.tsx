"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ role, children }: { role: "admin" | "user"; children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    if (!token || !savedRole || savedRole !== role) {
      router.replace("/login");
      return;
    }
    setAllowed(true);
  }, [role, router]);

  if (!allowed) return    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '16px'
      }}>
        <div style={{
          border: '6px solid #f3f3f3',
          borderTop: '6px solid #3498db',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontSize: '18px', color: '#555' }}>Loading, please wait...</p>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  return <>{children}</>;
}
