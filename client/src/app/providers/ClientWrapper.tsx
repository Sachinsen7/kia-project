"use client";

import { Toaster } from "react-hot-toast";

export default function ClientWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: "#000",
                        color: "#fff",
                        borderRadius: "8px",
                        padding: "12px 16px",
                    },
                    success: {
                        iconTheme: {
                            primary: "#4ade80", // green
                            secondary: "#000",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#f87171", // red
                            secondary: "#000",
                        },
                    },
                }}
            />
        </>
    );
}
