"use client";

import { useState } from "react";
// Ensure this relative path points correctly to your supabase.ts file
import { supabase } from "../../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // This tells Supabase where to send the user after they click the link
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      setMessage("Check your university email for the magic link!");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-gray-50 px-6 py-24 sm:py-32 min-h-screen w-full">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your .ac.uk email to securely access your student dashboard.
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {errorMsg}
          </div>
        )}
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
            {message}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              University Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. a.smith@surrey.ac.uk"
              className="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
          >
            {loading ? "Sending Magic Link..." : "Send Magic Link"}
          </button>
        </form>
      </div>
    </main>
  );
}
