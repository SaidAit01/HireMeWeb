import Link from "next/link";
import { Pricing } from "../components/Pricing";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-900 px-6 py-24 sm:py-32">
      {/* 1. Social Proof Badge */}
      <div className="mb-8 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-800 shadow-sm">
        <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
        Trusted by 100+ UK Graduates
      </div>
      {/* 2. Main Headline and Subtitle */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl">
          Land Your Dream Job with a{" "}
          <span className="text-blue-600">Standout Portfolio</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Don't let your paper CV get lost in the pile. We build professional,
          stunning personal websites for students and graduates to help you
          secure interviews faster.
        </p>
      </div>
      {/* 3. Call to Action (CTA) Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Link
          href="/pricing"
          className="rounded-md bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:scale-105"
        >
          View Student Pricing
        </Link>
        <Link
          href="#features"
          className="rounded-md bg-white border border-gray-300 px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50"
        >
          See How It Works
        </Link>
      </div>
      {/* 3. Call to Action (CTA) Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
        {/* ... buttons ... */}
      </div>
      <Pricing /> {/* <-- Render the pricing section here */}
    </main>
  );
}
