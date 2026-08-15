"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

interface StudentProfile {
  full_name: string | null;
  email: string;
  degree?: string;
  university?: string;
  graduation_year?: string;
  bio?: string;
  selected_sections?: string[];
  cv_file_path?: string | null;
  projects?: Array<{ title: string; description: string; link?: string }>;
}

interface OrderWithUser {
  id: string;
  created_at: string;
  payment_status: "pending" | "in progress" | "completed";
  client_notes?: string | null; // <-- ADDED THIS LINE
  tier?: string;
  user_id: string;
  users: {
    full_name: string | null;
    email: string;
  } | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modal & Inspector State
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUser | null>(
    null,
  );
  const [profileData, setProfileData] = useState<StudentProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [cvDownloadUrl, setCvDownloadUrl] = useState<string | null>(null);
  const ADMIN_EMAIL =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "your.email@example.com";

  // 1. Fetch Orders with User Records
  const fetchAdminData = useCallback(async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session || session.user.email !== ADMIN_EMAIL) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          user_id,
          created_at,
          payment_status,
          client_notes,       
          users (
            full_name,
            email
          )
        `, // <-- ADDED client_notes HERE
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders((data as unknown as OrderWithUser[]) || []);
    } catch (err: unknown) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [router, ADMIN_EMAIL]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // 2. Inspect Order: Fetch Profile & Generate Signed CV URL
  const inspectOrder = async (order: OrderWithUser) => {
    setSelectedOrder(order);
    setLoadingProfile(true);
    setProfileData(null);
    setCvDownloadUrl(null);

    try {
      // A. Query the user profile intake data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", order.user_id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      setProfileData(profile || null);

      // B. Create a secure Signed URL for the CV if it exists
      if (profile?.cv_file_path) {
        const { data: signedUrlData, error: signedUrlError } =
          await supabase.storage
            .from("cv_uploads")
            .createSignedUrl(profile.cv_file_path, 300); // 300 seconds = 5 minutes expiry

        if (!signedUrlError && signedUrlData) {
          setCvDownloadUrl(signedUrlData.signedUrl);
        }
      }
    } catch (err: unknown) {
      console.error("Failed to load order details:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  // 3. Mark Status as Completed
  const markAsCompleted = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: "completed" })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, payment_status: "completed" }
            : order,
        ),
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, payment_status: "completed" } : null,
        );
      }
    } catch (err: unknown) {
      console.error("Failed to update status:", err);
      alert("Could not update the order.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600 font-medium">
          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          <span>Verifying credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Command Centre
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Active student orders, intake profiles, and CV assets.
            </p>
          </div>
          <button
            onClick={() => fetchAdminData()}
            className="self-start sm:self-auto px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Refresh Data
          </button>
        </header>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-900 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Client</th>
                  <th className="py-3.5 px-4 sm:px-6">Contact</th>
                  <th className="py-3.5 px-4 sm:px-6">Ordered On</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6 font-medium text-gray-900">
                      {order.users?.full_name || "Name not provided"}
                      {/* Optional: Add a tiny indicator here if there's a note */}
                      {order.client_notes && (
                        <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          Note
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-gray-500">
                      {order.users?.email || "—"}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          order.payment_status === "pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : order.payment_status === "in progress"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right space-x-2">
                      <button
                        onClick={() => inspectOrder(order)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Inspect Details
                      </button>
                      {order.payment_status === "in progress" && (
                        <button
                          onClick={() => markAsCompleted(order.id)}
                          disabled={updatingId === order.id}
                          className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
                        >
                          {updatingId === order.id
                            ? "Saving..."
                            : "Mark Complete"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-Over Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-gray-900/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6 sm:p-8 animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedOrder.users?.full_name || "Order Details"}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Order ID: {selectedOrder.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {loadingProfile ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
                  <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs">Fetching intake data...</p>
                </div>
              ) : (
                <div className="space-y-6 text-sm">
                  {/* NEW: DISPLAY CLIENT NOTES (UPDATE REQUESTS) */}
                  {selectedOrder.client_notes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0 text-lg">
                          ⚠️
                        </div>
                        <div>
                          <h3 className="font-bold text-amber-900 mb-1">
                            Update Request from Client
                          </h3>
                          <p className="text-sm text-amber-800 leading-relaxed whitespace-pre-wrap">
                            {selectedOrder.client_notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Academic Background */}
                  <section className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Academic Background
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-gray-700">
                      <div>
                        <span className="text-xs text-gray-400 block">
                          Degree
                        </span>
                        <span className="font-medium">
                          {profileData?.degree || "Not specified"}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block">
                          University
                        </span>
                        <span className="font-medium">
                          {profileData?.university || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* Bio & Narrative */}
                  <section className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Professional Bio
                    </h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed">
                      {profileData?.bio ||
                        "No bio submitted during onboarding."}
                    </p>
                  </section>

                  {/* Requested Website Sections */}
                  <section className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Requested Sections
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {profileData?.selected_sections &&
                      profileData.selected_sections.length > 0 ? (
                        profileData.selected_sections.map((section) => (
                          <span
                            key={section}
                            className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md capitalize"
                          >
                            {section}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs">
                          Standard portfolio layout
                        </span>
                      )}
                    </div>
                  </section>

                  {/* CV Asset Downloader */}
                  <section className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Uploaded CV Document
                    </h3>
                    {cvDownloadUrl ? (
                      <a
                        href={cvDownloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-sm transition-all"
                      >
                        <span>Download Student CV</span>
                        <span className="text-emerald-200 text-xs">↗</span>
                      </a>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                        No CV file uploaded or link expired.
                      </div>
                    )}
                  </section>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                Close Panel
              </button>
              {selectedOrder.payment_status === "in progress" && (
                <button
                  onClick={() => markAsCompleted(selectedOrder.id)}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Mark Order Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
