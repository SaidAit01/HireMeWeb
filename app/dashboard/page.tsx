"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function StudentDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState("Student");
  const [order, setOrder] = useState<any>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  // General Update Notes State
  const [updateNote, setUpdateNote] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState(false);

  // 🔥 NEW: Staging & Draft Feedback State
  const [draftFeedback, setDraftFeedback] = useState("");
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);
  const [draftSuccess, setDraftSuccess] = useState(false);

  useEffect(() => {
    let orderSubscription: any;

    async function loadDashboard() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          router.replace("/login");
          return;
        }

        const { data: publicUser } = await supabase
          .from("users")
          .select("id, full_name")
          .eq("email", session.user.email)
          .single();

        if (!publicUser) {
          setLoading(false);
          return;
        }

        setUserName(publicUser.full_name);

        const { data: orderData } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", publicUser.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (orderData) {
          setOrder(orderData);
          if (orderData.client_notes) setUpdateNote(orderData.client_notes);
          if (orderData.draft_feedback)
            setDraftFeedback(orderData.draft_feedback);

          // Real-time listener
          orderSubscription = supabase
            .channel("custom-order-channel")
            .on(
              "postgres_changes",
              {
                event: "UPDATE",
                schema: "public",
                table: "orders",
                filter: `id=eq.${orderData.id}`,
              },
              (payload) => {
                setOrder(payload.new);
              },
            )
            .subscribe();
        }

        const { data: profileData } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", publicUser.id)
          .single();

        if (profileData) {
          setProfileId(profileData.id);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      if (orderSubscription) supabase.removeChannel(orderSubscription);
    };
  }, [router]);

  const handleUpdateNote = async () => {
    if (!updateNote.trim() || !order) return;
    setIsSubmittingNote(true);
    setNoteSuccess(false);

    const { error } = await supabase
      .from("orders")
      .update({ client_notes: updateNote })
      .eq("id", order.id);

    setIsSubmittingNote(false);
    if (!error) {
      setNoteSuccess(true);
      setTimeout(() => setNoteSuccess(false), 3000);
    }
  };

  // 🔥 NEW: Handle Draft Feedback Submission
  const handleDraftFeedback = async () => {
    if (!draftFeedback.trim() || !order) return;
    setIsSubmittingDraft(true);
    setDraftSuccess(false);

    const { error } = await supabase
      .from("orders")
      .update({ draft_feedback: draftFeedback })
      .eq("id", order.id);

    setIsSubmittingDraft(false);
    if (!error) {
      setDraftSuccess(true);
      setTimeout(() => setDraftSuccess(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600 font-medium">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading your workspace...</span>
        </div>
      </div>
    );
  }

  const currentStep = order?.project_step || 1;
  const progressPercentage = (currentStep - 1) * 33.33;

  const milestones = [
    { num: 1, label: "Data\nReceived" },
    { num: 2, label: "CV\nArchitecture" },
    { num: 3, label: "Site\nEngineering" },
    { num: 4, label: "Final\nDeployment" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6 sm:py-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Welcome back, {userName.split(" ")[0]}
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your graduate portfolio and networking assets.
            </p>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/login");
            }}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm"
          >
            Sign Out
          </button>
        </header>

        {/* STATE 1: No Order */}
        {!order && (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No Active Portfolio
            </h2>
            <p className="text-gray-500 mb-6">
              Let's get you set up to stand out to recruiters.
            </p>
            <Link
              href="/#pricing"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
            >
              View Packages
            </Link>
          </div>
        )}

        {/* STATE 2: In Progress (Building Phase) */}
        {order &&
          (order.payment_status === "pending" ||
            order.payment_status === "in progress") && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm flex-1 min-w-[200px]">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    Selected Package
                  </p>
                  <p className="font-bold text-gray-900 text-lg capitalize">
                    {order.tier || "Standard"} Tier
                  </p>
                </div>
                <div className="bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm flex-1 min-w-[200px]">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    Payment Status
                  </p>
                  <p className="font-bold text-emerald-600 text-lg flex items-center gap-2">
                    ✓{" "}
                    {order.tier?.toLowerCase() === "basic"
                      ? "100% Paid"
                      : "50% Deposit Secured"}
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 sm:p-12 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-12">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Engineering your portfolio
                    </h2>
                    <p className="text-gray-600 max-w-md leading-relaxed">
                      Our team is currently reviewing your CV and crafting your
                      recruiter-optimized platform.
                    </p>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2 font-semibold text-sm">
                    <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                    Milestone {currentStep} of 4
                  </div>
                </div>

                {/* DYNAMIC PROGRESS TRACKER */}
                <div className="relative pt-4 pb-2">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full"></div>
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>

                  <div className="relative flex justify-between">
                    {milestones.map((milestone) => (
                      <div
                        key={milestone.num}
                        className="flex flex-col items-center"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md z-10 ring-4 ring-white transition-colors duration-500 ${
                            currentStep > milestone.num
                              ? "bg-blue-600 text-white"
                              : currentStep === milestone.num
                                ? "bg-white border-2 border-blue-600 text-blue-600"
                                : "bg-white border-2 border-gray-200 text-gray-400"
                          }`}
                        >
                          {currentStep > milestone.num ? "✓" : milestone.num}
                        </div>
                        <span
                          className={`text-xs font-bold mt-3 text-center hidden sm:block whitespace-pre-line ${currentStep >= milestone.num ? "text-gray-900" : "text-gray-400"}`}
                        >
                          {milestone.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 🔥 NEW: FIRST DRAFT REVEAL (Only visible on Step 3) */}
              {currentStep === 3 && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 sm:p-8 rounded-3xl border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-sm border border-indigo-100 text-xl shrink-0">
                      👀
                    </div>
                    <div className="w-full">
                      <h4 className="font-bold text-gray-900 mb-1">
                        Your First Draft is Ready!
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        We have deployed a private staging link for your
                        portfolio. Please review it and submit any final
                        text/image tweaks below before we push it to your live
                        custom domain.
                      </p>

                      {order.draft_link ? (
                        <a
                          href={order.draft_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mb-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all"
                        >
                          View Private Staging Link ↗
                        </a>
                      ) : (
                        <div className="mb-6 px-4 py-3 bg-indigo-100/50 text-indigo-800 text-sm rounded-xl border border-indigo-200">
                          Admin is currently generating your secure Vercel
                          preview link...
                        </div>
                      )}

                      <textarea
                        value={draftFeedback}
                        onChange={(e) => setDraftFeedback(e.target.value)}
                        placeholder="e.g. Can we change the hero text to 'Software Engineer'? Everything else looks perfect!"
                        className="w-full rounded-xl border border-indigo-200 px-4 py-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white shadow-sm"
                        rows={4}
                      />
                      <button
                        onClick={handleDraftFeedback}
                        disabled={isSubmittingDraft || !draftFeedback.trim()}
                        className={`mt-3 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                          draftSuccess
                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                        }`}
                      >
                        {isSubmittingDraft
                          ? "Submitting..."
                          : draftSuccess
                            ? "✓ Feedback Sent"
                            : "Submit Final Revisions"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Standard Update Notes Box (Hides during Step 3 to prevent confusion) */}
              {currentStep !== 3 && (
                <div className="bg-blue-50/50 p-6 sm:p-8 rounded-3xl border border-blue-100 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-sm border border-blue-100 text-xl shrink-0">
                    📝
                  </div>
                  <div className="w-full">
                    <h4 className="font-bold text-gray-900 mb-1">
                      Forgot to add something?
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      You can request changes or add extra experiences (like a
                      new internship) before we finish building your site.
                    </p>
                    <textarea
                      value={updateNote}
                      onChange={(e) => setUpdateNote(e.target.value)}
                      placeholder="e.g. Please also include my summer internship at Deloitte..."
                      className="w-full rounded-xl border border-blue-200 px-4 py-3 text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white shadow-sm"
                      rows={3}
                    />
                    <button
                      onClick={handleUpdateNote}
                      disabled={isSubmittingNote || !updateNote.trim()}
                      className={`mt-3 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                        noteSuccess
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                      }`}
                    >
                      {isSubmittingNote
                        ? "Saving..."
                        : noteSuccess
                          ? "✓ Note Sent to Admin"
                          : "Submit Request"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        {/* STATE 3: Awaiting Final Payment */}
        {order && order.payment_status === "awaiting_final_payment" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-amber-200 shadow-lg text-center relative overflow-hidden">
              <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm">
                🎉
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Your Portfolio is Ready!
              </h2>
              <p className="text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
                We have successfully finished engineering your{" "}
                {order.tier || "Standard"} tier portfolio. To receive your live
                custom domain and QR networking card, please submit the final
                50% balance.
              </p>

              <a
                href="https://buy.stripe.com/YOUR_FINAL_PAYMENT_LINK"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-md"
              >
                Pay Final Balance
              </a>
            </div>
          </div>
        )}

        {/* STATE 4: Order Completed */}
        {order && order.payment_status === "completed" && profileId && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 sm:p-10 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm mb-4 border border-white/20">
                  ✓ Deployment Successful
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
                  Your Portfolio is Live!
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <a
                    href={`/portfolio/${profileId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-blue-600 px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-lg text-center flex items-center justify-center gap-2"
                  >
                    View Live Website ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
