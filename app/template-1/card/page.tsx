"use client";

import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { sampleStudent as data } from "../../../templates/sampleData";

export default function DigitalBusinessCard() {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // This automatically grabs whatever domain the site is currently hosted on
    // (e.g., alex-smith.co.uk or localhost:3000)
    // We remove the '/card' part so the QR code points to the main portfolio!
    const baseUrl = window.location.href.replace("/card", "");
    setCurrentUrl(baseUrl);
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 selection:bg-gray-700">
      <div className="w-full max-w-sm bg-gray-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl border border-gray-700 animate-in fade-in zoom-in-95 duration-500">
        {/* Profile Info */}
        <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-full mb-4 flex items-center justify-center shadow-lg">
          <span className="text-2xl font-bold text-white">
            {data.personal.fullName.charAt(0)}
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-1">
          {data.personal.fullName}
        </h1>
        <p className="text-emerald-400 text-sm font-medium mb-8">
          {data.personal.tagline}
        </p>

        {/* The QR Code Engine */}
        <div className="bg-white p-4 rounded-2xl shadow-inner mb-8 transition-transform hover:scale-105 duration-300">
          {currentUrl ? (
            <QRCode
              value={currentUrl}
              size={180}
              bgColor="#ffffff"
              fgColor="#111827" // Dark gray/black for the QR code
              level="H" // High error correction so it scans easily on cracked phone screens!
            />
          ) : (
            <div className="w-[180px] h-[180px] bg-gray-100 animate-pulse rounded-xl" />
          )}
        </div>

        <p className="text-xs text-gray-400 mb-2">
          Scan to view full portfolio
        </p>

        <a
          href={currentUrl}
          className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
        >
          View Portfolio ↗
        </a>
      </div>
    </main>
  );
}
