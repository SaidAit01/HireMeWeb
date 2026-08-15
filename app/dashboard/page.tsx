"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function StudentDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Data States
  const [userName, setUserName] = useState("Student");
  const [order, setOrder] = useState<any>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  // NEW: Update Notes State
  const [updateNote, setUpdateNote] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState(false);

  useEffect(() => {
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
          if (orderData.client_notes) {
            setUpdateNote(orderData.client_notes);
          }
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

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        loadDashboard();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // NEW: Function to save the note to Supabase
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
      setTimeout(() => setNoteSuccess(false), 3000); // Hide success message after 3s
    } else {
      console.error("Error saving note:", error);
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

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6 sm:py-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
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
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm"
          >
            Sign Out
          </button>
        </header>

        {/* STATE 1: No Order Found */}
        {!order && (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              📂
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No Active Portfolio
            </h2>
            <p className="text-gray-500 mb-6">
              You haven't started your portfolio build yet. Let's get you set up
              to stand out to recruiters.
            </p>
            <Link
              href="/#pricing"
              className="inline-flex rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
            >
              View Packages
            </Link>
          </div>
        )}

        {/* STATE 2: Order is Pending or In Progress (Building Phase) */}
        {order &&
          (order.payment_status === "pending" ||
            order.payment_status === "in progress") && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-white p-8 sm:p-12 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>

                <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-12">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Engineering your portfolio
                    </h2>
                    <p className="text-gray-600 max-w-md leading-relaxed">
                      Our team is currently reviewing your CV and academic
                      details to craft a recruiter-optimized platform. You will
                      receive an email once deployment is complete.
                    </p>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2 font-semibold text-sm shadow-sm">
                    <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                    Status: In the Lab
                  </div>
                </div>

                {/* THE PROGRESSION TRACKER */}
                <div className="relative pt-4 pb-2">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full"></div>
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width:
                        order.payment_status === "in progress" ? "50%" : "15%",
                    }}
                  ></div>

                  <div className="relative flex justify-between">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md z-10 ring-4 ring-white">
                        ✓
                      </div>
                      <span className="text-xs font-bold text-gray-900 mt-3 text-center hidden sm:block">
                        Data
                        <br />
                        Received
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md z-10 ring-4 ring-white transition-colors duration-500 ${order.payment_status === "in progress" ? "bg-blue-600 text-white" : "bg-white border-2 border-blue-600 text-blue-600"}`}
                      >
                        {order.payment_status === "in progress" ? "✓" : "2"}
                      </div>
                      <span
                        className={`text-xs font-bold mt-3 text-center hidden sm:block ${order.payment_status === "in progress" ? "text-gray-900" : "text-blue-600"}`}
                      >
                        CV
                        <br />
                        Extraction
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm z-10 ring-4 ring-white transition-colors duration-500 ${order.payment_status === "in progress" ? "bg-white border-2 border-blue-600 text-blue-600" : "bg-white border-2 border-gray-200 text-gray-400"}`}
                      >
                        3
                      </div>
                      <span
                        className={`text-xs font-bold mt-3 text-center hidden sm:block ${order.payment_status === "in progress" ? "text-blue-600" : "text-gray-400"}`}
                      >
                        Site
                        <br />
                        Engineering
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold shadow-sm z-10 ring-4 ring-white">
                        4
                      </div>
                      <span className="text-xs font-medium text-gray-400 mt-3 text-center hidden sm:block">
                        Final
                        <br />
                        Deployment
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* NEW: THE UPDATE REQUEST BOX */}
              <div className="bg-blue-50/50 p-6 sm:p-8 rounded-3xl border border-blue-100 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-sm border border-blue-100 text-xl shrink-0">
                  📝
                </div>
                <div className="w-full">
                  <h4 className="font-bold text-gray-900 mb-1">
                    Forgot to add something?
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    You can request changes or add extra experiences (like a new
                    internship) before we finish building your site.
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
            </div>
          )}

        {/* STATE 3: Order is Completed (The Celebration!) */}
        {order && order.payment_status === "completed" && profileId && (
          // ... (Completed UI remains exactly the same as before)
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 sm:p-10 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm mb-4 border border-white/20">
                  ✓ Deployment Successful
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
                  Your Portfolio is Live!
                </h2>
                <p className="text-blue-100 max-w-lg text-sm sm:text-base leading-relaxed mb-8">
                  Your custom portfolio has been successfully engineered,
                  hosted, and deployed. You are officially ready to start
                  networking and applying.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={`/portfolio/${profileId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-blue-600 px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-lg text-center flex items-center justify-center gap-2"
                  >
                    View Live Website ↗
                  </a>
                  <a
                    href={`/portfolio/${profileId}/card`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-700/60 hover:bg-blue-700 text-white border border-blue-400/30 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md text-center flex items-center justify-center gap-2"
                  >
                    📱 Open Mobile QR Card
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
