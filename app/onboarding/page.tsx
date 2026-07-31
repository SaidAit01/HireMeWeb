"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase"; // Ensure this path is correct

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Core Account State
  const [fullName, setFullName] = useState("");
  const [personalEmail, setPersonalEmail] = useState(""); // Permanent login
  const [tierId, setTierId] = useState("2"); // Defaults to Standard (£199)

  // Discount Verification State
  const [uniEmail, setUniEmail] = useState("");
  const [gradYear, setGradYear] = useState("");

  // Portfolio Content State
  const [designPreferences, setDesignPreferences] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Validate the .ac.uk email if they are claiming the student discount
      if (tierId !== "3" && !uniEmail.endsWith(".ac.uk")) {
        throw new Error(
          "A valid .ac.uk email is required to claim the 50% graduate discount.",
        );
      }

      // 2. Insert User into Supabase (Using PERSONAL email for their permanent account)
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert([{ full_name: fullName, email: personalEmail }])
        .select()
        .single();

      if (userError) throw userError;

      // 3. Create the Order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: userData.id,
            tier_id: parseInt(tierId),
            payment_status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 4. Insert Portfolio Content (including the uni email for your records)
      const { error: contentError } = await supabase
        .from("portfolio_content")
        .insert([
          {
            order_id: orderData.id,
            design_preferences: designPreferences,
            resume_data: JSON.stringify({
              uni_email_verification: uniEmail,
              graduation_year: gradYear,
              education: education,
              experience: experience,
            }),
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
      <main className="flex-1 flex flex-col items-center justify-center bg-gray-50 px-6 py-24 min-h-screen">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4 font-bold text-xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Application Received
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you, {fullName}. We will review your details and send a secure
            payment link to <strong>{personalEmail}</strong> shortly.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gray-50 py-16 px-6 sm:py-24 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-200">
        <div className="mb-10 border-b border-gray-200 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Build Your Portfolio
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Provide your details below. Your personal email will be used for
            your permanent account access.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Core Account Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              1. Account Details
            </h3>
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
                  className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Personal Email (For Login)
                </label>
                <input
                  type="email"
                  required
                  value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                  placeholder="e.g. alex@gmail.com"
                  className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Package & Verification */}
          <div className="space-y-6 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              2. Package Selection
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Tier
              </label>
              <select
                value={tierId}
                onChange={(e) => setTierId(e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="1">Basic Tier (£99 Student Rate)</option>
                <option value="2">Standard Tier (£199 Student Rate)</option>
                <option value="3">
                  Complex Tier (£798 Retail - No Discount)
                </option>
              </select>
            </div>

            {/* Conditional Discount Fields */}
            {tierId !== "3" && (
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 space-y-6">
                <p className="text-sm text-blue-800 font-medium">
                  *Student discount requires validation. Valid for current
                  students and recent graduates (up to 2 years post-graduation).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-900">
                      University Email (.ac.uk)
                    </label>
                    <input
                      type="email"
                      required={tierId !== "3"}
                      value={uniEmail}
                      onChange={(e) => setUniEmail(e.target.value)}
                      placeholder="e.g. a.smith@surrey.ac.uk"
                      className="mt-2 block w-full rounded-md border border-blue-200 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900">
                      Graduation Year
                    </label>
                    <select
                      required={tierId !== "3"}
                      value={gradYear}
                      onChange={(e) => setGradYear(e.target.value)}
                      className="mt-2 block w-full rounded-md border border-blue-200 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select Year</option>
                      <option value="2026">2026 (Current)</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Content */}
          <div className="space-y-6 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              3. Portfolio Content
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Design Preferences
              </label>
              <textarea
                rows={2}
                value={designPreferences}
                onChange={(e) => setDesignPreferences(e.target.value)}
                placeholder="Preferred colours, styles, or links to websites you like..."
                className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Experience & Education (Optional)
              </label>
              <textarea
                rows={4}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Paste your CV text here, or skip this and upload your PDF in the dashboard later..."
                className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Processing..." : "Submit Portfolio Order"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
