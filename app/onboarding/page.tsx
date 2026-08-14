"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Core Account State
  const [fullName, setFullName] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [tierId, setTierId] = useState("2");

  // Discount Verification State
  const [uniEmail, setUniEmail] = useState("");
  const [gradYear, setGradYear] = useState("");

  // Portfolio Content State
  const [degree, setDegree] = useState("");
  const [university, setUniversity] = useState("");
  const [bio, setBio] = useState("");

  // NEW: CV File State
  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Validate the .ac.uk email
      if (tierId !== "3" && !uniEmail.endsWith(".ac.uk")) {
        throw new Error(
          "A valid .ac.uk email is required to claim the 50% graduate discount.",
        );
      }

      // 2. Insert User
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

      // 4. NEW: Securely Upload the CV File (If provided)
      let uploadedFilePath = null;
      if (cvFile) {
        // Create a unique filename to prevent overwriting
        const fileExt = cvFile.name.split(".").pop();
        const uniqueFileName = `${userData.id}-${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("cv_uploads")
          .upload(uniqueFileName, cvFile);

        if (uploadError) {
          console.error("CV Upload Failed:", uploadError);
          // We don't throw here so the order still completes even if the PDF fails
          setErrorMsg(
            "Order placed, but CV upload failed. You can email it to us later.",
          );
        } else {
          uploadedFilePath = uploadData.path;
        }
      }

      // 5. Insert into the profiles table (Now including the cv_file_path!)
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          user_id: userData.id,
          degree: degree,
          university: university,
          graduation_year: gradYear,
          bio: bio,
          cv_file_path: uploadedFilePath, // Links the file to the database row
          selected_sections: ["verification: " + uniEmail],
        },
      ]);

      if (profileError) throw profileError;

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
            Provide your details below.
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
                  className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Personal Email
                </label>
                <input
                  type="email"
                  required
                  value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                  className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Package & Verification */}
          <div className="space-y-6 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              2. Package Selection
            </h3>
            <select
              value={tierId}
              onChange={(e) => setTierId(e.target.value)}
              className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="1">Basic Tier (£99 Student Rate)</option>
              <option value="2">Standard Tier (£199 Student Rate)</option>
              <option value="3">
                Complex Tier (£798 Retail - No Discount)
              </option>
            </select>

            {tierId !== "3" && (
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 space-y-6">
                <p className="text-sm text-blue-800 font-medium">
                  *Student discount requires validation.
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
                      className="mt-2 block w-full rounded-md border border-blue-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                      className="mt-2 block w-full rounded-md border border-blue-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select Year</option>
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Portfolio Details & CV Upload */}
          <div className="space-y-6 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              3. Portfolio Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Degree Title
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. BSc Computer Science"
                  className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  University Name
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. University College London"
                  className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Professional Bio
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short paragraph about who you are and what you do..."
                className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* THE NEW CV UPLOADER */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 border-dashed">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Upload Your CV (PDF)
              </label>
              <p className="text-xs text-gray-500 mb-4">
                We will use this to extract your experience and project details
                for your website.
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setCvFile(e.target.files[0]);
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : (
                "Submit Portfolio Order"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
