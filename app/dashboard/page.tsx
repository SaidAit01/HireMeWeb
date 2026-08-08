"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams(); // 1. We bring in the URL reader

  // Dashboard states...
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);

  // 2. We create a state to control if the toast is visible
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // 3. The Success Detector
  useEffect(() => {
    // A. Read the 'success' parameter from the URL
    const isSuccess = searchParams.get("success");

    // B. If the payment just cleared...
    if (isSuccess === "true") {
      // 1. Trigger the sliding toast animation
      setShowSuccessToast(true);

      // 2. Hide the toast automatically after 5 seconds (5000 milliseconds)
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 5000);

      // 3. Silently clean the URL so the toast doesn't reappear if they refresh the page
      router.replace("/dashboard", { scroll: false });
    }
  }, [searchParams, router]);
  // ... (Assume the rest of your fetching logic and UI remains the same)

  return (
    <main className="flex-1 bg-gray-50 py-12 px-6 sm:py-16 min-h-screen relative overflow-hidden">
      {/* ... Your existing Bento Grid UI goes here ... */}

      {/* The Sleek Toast Notification */}
      <div
        className={`fixed bottom-8 right-8 flex items-center gap-3 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl transition-all duration-500 ease-out ${
          showSuccessToast
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex-shrink-0 h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-sm">Payment Successful</h4>
          <p className="text-gray-300 text-xs mt-0.5">
            Your portfolio build is now in progress.
          </p>
        </div>
      </div>
    </main>
  );
}
