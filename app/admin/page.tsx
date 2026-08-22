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
  tier_id: string;
  id: string;
  created_at: string;
  payment_status:
    | "pending"
    | "in progress"
    | "awaiting_final_payment"
    | "completed";
  client_notes?: string | null;
  draft_feedback?: string | null;
  draft_link?: string | null;
  tier?: string;
  project_step?: number;
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
  const [draftLinkInput, setDraftLinkInput] = useState("");
  const [savingLink, setSavingLink] = useState(false);

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

      // 🔥 FIXED: Added draft_feedback and draft_link to this query below!
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          user_id,
          created_at,
          payment_status,
          client_notes,
          draft_feedback, 
          draft_link,     
          tier_id,
          project_step,
          users (
            full_name,
            email
          )
        `,
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
    setDraftLinkInput(order.draft_link || "");

    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", order.user_id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      setProfileData(profile || null);

      if (profile?.cv_file_path) {
        const { data: signedUrlData, error: signedUrlError } =
          await supabase.storage
            .from("cv_uploads")
            .createSignedUrl(profile.cv_file_path, 300);

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

  // 3. Mark Status (In Progress -> Awaiting Payment -> Completed)
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, payment_status: newStatus as any }
            : order,
        ),
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, payment_status: newStatus as any } : null,
        );
      }
    } catch (err: unknown) {
      console.error("Failed to update status:", err);
      alert("Could not update the order.");
    } finally {
      setUpdatingId(null);
    }
  };

  // 4. Update the Student's Live Progress Bar
  const updateProjectStep = async (orderId: string, newStep: number) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ project_step: newStep })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, project_step: newStep } : o,
        ),
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, project_step: newStep } : null,
        );
      }
    } catch (err) {
      console.error("Failed to update step:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveDraftLink = async (orderId: string) => {
    setSavingLink(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ draft_link: draftLinkInput })
        .eq("id", orderId);

      if (error) throw error;

      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, draft_link: draftLinkInput } : o,
        ),
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, draft_link: draftLinkInput } : null,
        );
      }
      alert("Staging link saved and sent to student dashboard!");
    } catch (err) {
      console.error("Failed to save draft link:", err);
      alert("Error saving link.");
    } finally {
      setSavingLink(false);
    }
  };

  function markAsCompleted(id: string): void {
    // Placeholder function if needed
  }

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
                  <th className="py-3.5 px-4 sm:px-6">Tier</th>
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
                      {order.client_notes && (
                        <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          Note
                        </span>
                      )}
                      {order.draft_feedback && (
                        <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                          Feedback
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-gray-500 capitalize">
                      {order.tier_id || "Standard"}
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
                            : order.payment_status === "awaiting_final_payment"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : order.payment_status === "in progress"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {order.payment_status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right space-x-2">
                      <button
                        onClick={() => inspectOrder(order)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Inspect Details
                      </button>
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
                  {/* CLIENT NOTES / UPDATE REQUESTS */}
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

                  {/* PROGRESS BAR UPDATER (Admin Controls) */}

                  <section className="bg-white rounded-xl p-5 border border-blue-200 shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-gray-900">
                      Push Project Update to Client
                    </h3>
                    <p className="text-xs text-gray-500">
                      This instantly updates the progress tracker on the
                      student's dashboard.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((step) => (
                        <button
                          key={step}
                          onClick={() =>
                            updateProjectStep(selectedOrder.id, step)
                          }
                          disabled={updatingId === selectedOrder.id}
                          className={`py-2 text-xs font-bold rounded-lg transition-all border ${
                            (selectedOrder.project_step || 1) === step
                              ? "bg-blue-50 border-blue-200 text-blue-700 shadow-inner"
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                          } disabled:opacity-50`}
                        >
                          Step {step}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* 🔍 FIRST DRAFT & FEEDBACK INSPECTOR */}
                  <section className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100 shadow-sm space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-900">
                      First Draft Staging & Feedback
                    </h3>

                    {/* 1. Input to generate/paste Vercel Staging Link */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700 block">
                        Vercel Private Staging URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={draftLinkInput}
                          onChange={(e) => setDraftLinkInput(e.target.value)}
                          placeholder="https://hiremeweb-staging-xyz.vercel.app"
                          className="w-full text-xs rounded-xl border border-indigo-200 px-3 py-2 bg-white text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          onClick={() => handleSaveDraftLink(selectedOrder.id)}
                          disabled={savingLink}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm shrink-0 transition-all disabled:opacity-50"
                        >
                          {savingLink ? "Saving..." : "Push Link"}
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        Pushing this link automatically unlocks the review panel
                        on the student's dashboard (Step 3).
                      </p>
                    </div>

                    {/* 2. Display Student Feedback if they submitted any */}
                    {selectedOrder.draft_feedback ? (
                      <div className="bg-white border border-indigo-200 rounded-xl p-4 space-y-1 shadow-sm">
                        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
                          💬 Student Revision Feedback Received:
                        </span>
                        <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {selectedOrder.draft_feedback}
                        </p>
                      </div>
                    ) : (
                      <div className="text-[11px] text-gray-400 italic">
                        No revision feedback submitted by the student yet.
                      </div>
                    )}
                  </section>

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

            {/* ALWAYS VISIBLE ADMIN CONTROLS (Override Status) */}
            <div className="pt-6 mt-8 border-t border-gray-100 flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Force Status Change
              </h3>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() =>
                    updateOrderStatus(selectedOrder.id, "in progress")
                  }
                  className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold rounded-lg text-xs"
                >
                  Set: In Progress
                </button>
                <button
                  onClick={() =>
                    updateOrderStatus(
                      selectedOrder.id,
                      "awaiting_final_payment",
                    )
                  }
                  className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold rounded-lg text-xs"
                >
                  Request 50% Payment
                </button>
              </div>

              <button
                onClick={() => updateOrderStatus(selectedOrder.id, "completed")}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm text-sm"
              >
                Mark Fully Paid & Unlock
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 text-sm text-gray-500 hover:text-gray-800 font-semibold transition-colors mt-2"
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
