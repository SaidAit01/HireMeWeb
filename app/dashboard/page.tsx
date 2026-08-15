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

  useEffect(() => {
    async function loadDashboard() {
      try {
        // 1. Get Active Session from the Magic Link
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          router.replace("/login");
          return;
        }

        // 2. THE FIX: Find their 'Lead' account in public.users using their email!
        const { data: publicUser } = await supabase
          .from("users")
          .select("id, full_name")
          .eq("email", session.user.email)
          .single();

        if (!publicUser) {
          // If they haven't bought anything yet
          setLoading(false);
          return;
        }

        setUserName(publicUser.full_name);

        // 3. Fetch the User's Order Status using their Lead ID
        const { data: orderData } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", publicUser.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (orderData) {
          setOrder(orderData);
        }

        // 4. Fetch the Profile ID (To generate their unique website link)
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

    // 5. This ensures the dashboard updates the second a Magic Link is clicked
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          loadDashboard();
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

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
            <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 animate-pulse"></div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-4">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Engineering in Progress
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    We are building your site
                  </h2>
                  <p className="text-gray-600 max-w-md leading-relaxed">
                    Our team has received your CV and intake data. We are
                    currently engineering your portfolio and optimizing it for
                    recruiter ATS systems.
                  </p>
                  <p className="text-sm text-gray-400 mt-4 font-medium">
                    Expected delivery: Within 48 hours
                  </p>
                </div>
                <div className="w-full sm:w-1/3 bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                  <div className="text-4xl mb-3">🛠️</div>
                  <p className="text-sm font-bold text-gray-900">
                    Status: In the Lab
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    We will email you the moment it goes live.
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* STATE 3: Order is Completed (The Celebration!) */}
        {order && order.payment_status === "completed" && profileId && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 sm:p-10 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm mb-4">
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
                    className="bg-white text-blue-600 px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-md text-center flex items-center justify-center gap-2"
                  >
                    View Live Website ↗
                  </a>

                  <a
                    href={`/portfolio/${profileId}/card`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-700/60 hover:bg-blue-700 text-white border border-blue-400/30 px-6 py-3.5 rounded-xl font-bold text-sm transition-all text-center flex items-center justify-center gap-2"
                  >
                    📱 Open Mobile QR Card
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl border border-emerald-100">
                  📊
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    Vercel Analytics Active
                  </h3>
                  <p className="text-sm text-gray-500">
                    We are now tracking recruiter visits to your site.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 hidden sm:block">
                Monitoring Live
              </span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
