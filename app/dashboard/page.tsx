"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase"; // Ensure this matches your project structure!

export default function Dashboard() {
  const router = useRouter();

  // Database State
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);

  // File Upload State
  const [uploading, setUploading] = useState(false);
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  // 1. Fetch Auth & Database Info
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const {
          data: { session },
          error: authError,
        } = await supabase.auth.getSession();

        if (authError || !session) {
          router.push("/login");
          return;
        }

        const email = session.user.email;

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        if (userError) throw userError;
        setStudent(userData);

        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("*, tiers(tier_name)")
          .eq("user_id", userData.id)
          .single();

        if (!orderError && orderData) {
          setOrder(orderData);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  // 2. Handle File Uploads
  const handleUploadClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${student.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents") // Make sure you created this bucket in Supabase!
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      alert("Brilliant! Document uploaded successfully.");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "There was an error uploading the file.");
    } finally {
      setUploading(false);
    }
  };

  // 3. Loading Screen
  if (loading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center bg-gray-50 min-h-screen">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">
          Verifying Secure Link...
        </p>
      </main>
    );
  }

  if (!student) return null;

  return (
    <main className="flex-1 bg-gray-50 py-12 px-6 sm:py-16 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back, {student.full_name.split(" ")[0]}
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Track your portfolio build and manage your files.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
          {/* 1. Hero Tile: Project Status */}
          <div className="md:col-span-2 rounded-3xl bg-white p-8 sm:p-10 border border-gray-200 shadow-sm flex flex-col justify-center transition-shadow hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Build Status</h2>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-full text-sm font-semibold inline-block text-center capitalize">
                {order?.payment_status === "pending"
                  ? "Awaiting Deposit"
                  : "In Progress"}
              </span>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
              <div
                className="bg-blue-600 h-3 rounded-full relative"
                style={{
                  width: order?.payment_status === "pending" ? "10%" : "50%",
                }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 bg-blue-600 border-4 border-white rounded-full"></div>
              </div>
            </div>

            <div className="flex justify-between text-sm font-medium mb-6">
              <span
                className={
                  order?.payment_status === "pending"
                    ? "text-blue-600 font-bold"
                    : "text-gray-500"
                }
              >
                Order Placed
              </span>
              <span
                className={
                  order?.payment_status === "pending"
                    ? "text-gray-400"
                    : "text-blue-600 font-bold"
                }
              >
                First Draft
              </span>
              <span className="text-gray-400">Final Delivery</span>
            </div>

            <p className="mt-auto text-gray-600 text-sm leading-relaxed">
              {order?.payment_status === "pending"
                ? "We have received your details! Please check your email for the secure payment link to activate your build."
                : "Our team is currently designing your first draft. We will send you a private review link via WhatsApp shortly."}
            </p>
          </div>

          {/* 2. Accent Tile: File Upload */}
          <div className="rounded-3xl bg-blue-600 p-8 border border-blue-700 shadow-sm text-white flex flex-col justify-between transition-transform hover:-translate-y-1">
            <div>
              <h2 className="text-xl font-bold mb-3">Missing Files?</h2>
              <p className="text-blue-100 text-sm leading-relaxed">
                Forgot to include a project? You can still upload an updated CV
                or a new professional headshot for us to use.
              </p>
            </div>

            {/* Hidden Input for File Selection */}
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            />

            <button
              onClick={handleUploadClick}
              disabled={uploading}
              className="mt-8 w-full bg-white text-blue-600 font-bold py-3.5 rounded-xl shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Documents"}
            </button>
          </div>

          {/* 3. Feature Tile: Order Details */}
          <div className="rounded-3xl bg-white p-8 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Order Summary
            </h2>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span>Package:</span>
                <span className="font-semibold text-gray-900">
                  {order?.tiers?.tier_name || "Unknown Tier"}
                </span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span>Order Date:</span>
                <span className="font-semibold text-gray-900">
                  {order?.created_at
                    ? new Date(order.created_at).toLocaleDateString()
                    : "Pending"}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span>Status:</span>
                <span className="font-semibold text-gray-900 capitalize">
                  {order?.payment_status || "Pending"}
                </span>
              </li>
            </ul>
          </div>

          {/* 4. Feature Tile: Support & Communication */}
          <div className="md:col-span-2 rounded-3xl bg-white p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Need Help?</h2>
              <p className="text-gray-600 text-sm mt-2">
                Have a question about your build? Chat directly with your
                assigned designer on WhatsApp.
              </p>
            </div>
            <button className="w-full sm:w-auto whitespace-nowrap bg-gray-900 text-white font-semibold py-3.5 px-8 rounded-xl hover:bg-gray-800 transition-colors">
              Open WhatsApp
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
