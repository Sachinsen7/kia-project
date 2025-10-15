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
  title: "Kia GOEF",
  description: "The 2025 GOEF focuses on establishing a sustainable ownership ecosystem, aligning with the goal of Vision to Reality.",
  icons: {
    icon: "/opt/this.svg",
    shortcut: "/opt/this.svg",
    apple: "/opt/this.svg",
  },
  openGraph: {
    title: "Kia GOEF",
    description: "The 2025 GOEF focuses on establishing a sustainable ownership ecosystem, aligning with the goal of Vision to Reality.",
    url: "https://www.kiagoef.com/?v=2",
    siteName: "Kia GOEF",
    images: [
      {
        url: "/opt/this.svg?v=2",
        width: 1200,
        height: 630,
        alt: "Kia GOEF Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kia GOEF",
    description: "The 2025 GOEF focuses on establishing a sustainable ownership ecosystem, aligning with the goal of Vision to Reality.",
    images: ["/opt/this.svg?v=2"],
  },
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
