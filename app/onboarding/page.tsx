"import client";
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [tierId, setTierId] = useState("2"); // Default to Standard (£199)
  const [designPreferences, setDesignPreferences] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [projects, setProjects] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Basic validation for student email
      if (!email.endsWith(".ac.uk") && !email.includes("student")) {
        // We can give a soft warning or just require a note, but let's allow it with a check or proceed
      }

      // 2. Insert User into Supabase
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert([{ full_name: fullName, email: email }])
        .select()
        .single();

      if (userError) throw userError;
      const userId = userData.id;

      // 3. Create an Order linked to the User and Tier
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: userId,
            tier_id: parseInt(tierId),
            payment_status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;
      const orderId = orderData.id;

      // 4. Insert Portfolio Content
      const resumeJson = {
        education,
        experience,
        projects,
      };

      const { error: contentError } = await supabase
        .from("portfolio_content")
        .insert([
          {
            order_id: orderId,
            design_preferences: designPreferences,
            resume_data: resumeJson,
          },
        ]);

      if (contentError) throw contentError;

      // Success!
      setLoading(false);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message || "An unexpected error occurred during submission.",
      );
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center bg-gray-50 px-6 py-24">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4 font-bold text-xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Application Submitted!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you, {fullName}. Your details have been securely saved to our
            database. We will review your submission and reach out via
            WhatsApp/Email shortly to begin building your portfolio.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Return Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gray-50 py-16 px-6 sm:py-24">
      <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-200">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Get Your Portfolio Built
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill out your details below to lock in your 50% UK student discount
            and start your order.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Smith"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                University Email (.ac.uk)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. a.smith@surrey.ac.uk"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tier Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Package Tier
            </label>
            <select
              value={tierId}
              onChange={(e) => setTierId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="1">Basic Tier (£99 - Retail £198)</option>
              <option value="2">
                Standard Tier (£199 - Retail £398) [Most Popular]
              </option>
              <option value="3">Complex Tier (£399 - Retail £798)</option>
            </select>
          </div>

          {/* Design Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Design & Style Preferences
            </label>
            <textarea
              rows={3}
              value={designPreferences}
              onChange={(e) => setDesignPreferences(e.target.value)}
              placeholder="Mention your preferred color scheme, sections you want, or link a style you like..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Resume Fields */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Resume & Experience Data
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Education Details
              </label>
              <textarea
                rows={2}
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Degree title, university, expected graduation year, grades..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Work Experience / Volunteering
              </label>
              <textarea
                rows={3}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Roles, company names, key achievements, responsibilities..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Key Projects
              </label>
              <textarea
                rows={3}
                value={projects}
                onChange={(e) => setProjects(e.target.value)}
                placeholder="Project titles, technologies used, descriptions, GitHub/live links..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
          >
            {loading ? "Submitting Application..." : "Submit Portfolio Order"}
          </button>
        </form>
      </div>
    </main>
  );
}
