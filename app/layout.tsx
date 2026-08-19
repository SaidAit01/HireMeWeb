import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "../components/Footer"; // You correctly imported this!

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HireMeWeb | Standout Portfolios for Grads",
  description: "Launch your career with a professional portfolio website.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col bg-gray-50"
        suppressHydrationWarning
      >
        <Navbar />

        {/* flex-grow pushes the footer to the bottom of the screen on short pages */}
        <main className="flex-grow">{children}</main>

        <Analytics />

        {/* ADDED THE FOOTER HERE! */}
        <Footer />
      </body>
    </html>
  );
}
