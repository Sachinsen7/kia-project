import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CityProvider } from "./context/CityContext";
import ClientWrapper from "./providers/ClientWrapper";
import dynamic from "next/dynamic";

// ✅ Dynamically import MobileNotice so it only renders on client
const MobileNotice = dynamic(() => import("../components/MobileNotice"));

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kia",
  description: "3D city project with sidebars",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 👇 Only renders on client */}
        <MobileNotice />

        <CityProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </CityProvider>
      </body>
    </html>
  );
}
