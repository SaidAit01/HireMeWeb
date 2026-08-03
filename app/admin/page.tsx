"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // The strict security gatekeeper
  const ADMIN_EMAIL = "said.aitennecer01@gmail.com";

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const {
          data: { session },
          error: authError,
        } = await supabase.auth.getSession();

        if (authError || !session) {
          router.push("/login");
          return;
        }

        // Bouncer logic: If the logged-in user is not you, block them immediately
        if (session.user.email !== ADMIN_EMAIL) {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        // Fetch all orders with user and tier relationships
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select(
            `
            id,
            payment_status,
            created_at,
            users ( full_name, email ),
            tiers ( tier_name )
          `,
          )
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;

        setOrders(ordersData || []);
      } catch (error) {
        console.error("Admin fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  // Function to instantly update database status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      // Update local state to reflect the change instantly in the UI
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, payment_status: newStatus }
            : order,
        ),
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update the order status.");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="h-12 w-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600">
          You do not have the required clearance to view this sector.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-8 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Return to Client Dashboard
        </button>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-gray-50 py-12 px-6 sm:py-16 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Command Centre
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage incoming builds and update client statuses.
            </p>
          </div>
          <div className="text-sm font-semibold text-gray-500 bg-gray-200 px-4 py-2 rounded-lg">
            Admin: {ADMIN_EMAIL}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
                  <th className="p-6">Client</th>
                  <th className="p-6">Tier</th>
                  <th className="p-6">Order Date</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-6">
                      <p className="font-bold text-gray-900">
                        {order.users?.full_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.users?.email}
                      </p>
                    </td>
                    <td className="p-6 font-medium text-gray-700">
                      {order.tiers?.tier_name}
                    </td>
                    <td className="p-6 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString("en-GB")}
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          order.payment_status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.payment_status === "in progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="p-6">
                      <select
                        value={order.payment_status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-500">
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
