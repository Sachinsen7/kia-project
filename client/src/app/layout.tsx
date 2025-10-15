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
  title: "Kia GOEF - 2025 Global Ownership Experience Forum",
  description: "Join the 2025 Global Ownership Experience Forum. A virtual conference designed to enable richer exchanges and collectively envision Kia's future with sustainable ownership ecosystem strategies.",
  keywords: "Kia, GOEF, Global Ownership Experience Forum, 2025, virtual conference, ownership ecosystem, Vision to Reality",
  authors: [{ name: "Kia Corporation" }],
  creator: "Kia Corporation",
  publisher: "Kia Corporation",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/opt/this.svg",
    shortcut: "/opt/this.svg",
    apple: "/opt/this.svg",
  },
  openGraph: {
    title: "Kia GOEF - 2025 Global Ownership Experience Forum",
    description: "Join the 2025 Global Ownership Experience Forum. A virtual conference designed to enable richer exchanges and collectively envision Kia's future with sustainable ownership ecosystem strategies.",
    url: "https://www.kiagoef.com",
    siteName: "Kia GOEF",
    images: [
      {
        url: "https://www.kiagoef.com/opt/this.svg",
        width: 1200,
        height: 630,
        alt: "Kia GOEF - 2025 Global Ownership Experience Forum",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kia GOEF - 2025 Global Ownership Experience Forum",
    description: "Join the 2025 Global Ownership Experience Forum. A virtual conference designed to enable richer exchanges and collectively envision Kia's future with sustainable ownership ecosystem strategies.",
    images: ["https://www.kiagoef.com/opt/this.svg"],
    creator: "@KiaWorldwide",
  },
  alternates: {
    canonical: "https://www.kiagoef.com",
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
