"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

interface OrderWithUser {
  id: string;
  created_at: string;
  payment_status: "pending" | "in progress" | "completed";
  tier?: string;
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

  // 1. Authorised Admin Identity
  const ADMIN_EMAIL =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "your.email@example.com";

  // 2. Fetch Orders with Relational Data
  const fetchAdminData = useCallback(async () => {
    try {
      // Step A: Verify Auth Session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session || session.user.email !== ADMIN_EMAIL) {
        console.warn("Unauthorised access attempt redirected.");
        router.replace("/login");
        return;
      }

      // Step B: Query Orders joined with Users
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          created_at,
          payment_status,
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

  // 3. Status Mutation Handler
  const markAsCompleted = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: "completed" })
        .eq("id", orderId);

      if (error) throw error;

      // Optimistically update local state for immediate UI feedback
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, payment_status: "completed" }
            : order,
        ),
      );
    } catch (err: unknown) {
      console.error("Failed to update order status:", err);
      alert("Could not update the order. Please check console logs.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600 font-medium">
          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          <span>Verifying admin credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              HireMeWeb Command Centre
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time pipeline monitoring and order fulfilment.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Gateway Connected
            </span>
            <button
              onClick={() => fetchAdminData()}
              className="px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Refresh
            </button>
          </div>
        </header>

        {/* Orders Table Container */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-900 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Client</th>
                  <th className="py-3.5 px-4 sm:px-6">Contact</th>
                  <th className="py-3.5 px-4 sm:px-6">Ordered On</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-normal">
                {orders.map((order) => {
                  const isUpdating = updatingId === order.id;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Client Name */}
                      <td className="py-4 px-4 sm:px-6 font-medium text-gray-900">
                        {order.users?.full_name || "Name not provided"}
                      </td>

                      {/* Client Email */}
                      <td className="py-4 px-4 sm:px-6 text-gray-500">
                        {order.users?.email || "No email on record"}
                      </td>

                      {/* Formatted Date */}
                      <td className="py-4 px-4 sm:px-6 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </td>

                      {/* Payment / Build Status */}
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

                      {/* Fulfilment Button */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        {order.payment_status === "in progress" ? (
                          <button
                            onClick={() => markAsCompleted(order.id)}
                            disabled={isUpdating}
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
                          >
                            {isUpdating ? "Saving..." : "Mark Complete"}
                          </button>
                        ) : order.payment_status === "completed" ? (
                          <span className="text-xs font-medium text-emerald-600">
                            ✓ Fulfilled
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Awaiting Deposit
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-gray-400 text-sm"
                    >
                      No orders have been placed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
