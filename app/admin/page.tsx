"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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

        if (session.user.email !== ADMIN_EMAIL) {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        // We are now fetching the portfolio_content linked to the order as well
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select(
            `
            id,
            user_id,
            payment_status,
            created_at,
            users ( id, full_name, email ),
            tiers ( tier_name ),
            portfolio_content ( design_preferences )
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

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

  // --- New File Download Logic ---
  const handleDownloadFiles = async (userId: string) => {
    try {
      setDownloadingId(userId);

      // 1. Look inside the client's specific folder in the bucket
      const { data: files, error: listError } = await supabase.storage
        .from("documents")
        .list(`${userId}/`);

      if (listError) throw listError;

      if (!files || files.length === 0) {
        alert("This client hasn't uploaded any additional files yet.");
        return;
      }

      // 2. Generate public URLs and open them
      for (const file of files) {
        // Skip hidden system files
        if (file.name === ".emptyFolderPlaceholder") continue;

        const { data } = supabase.storage
          .from("documents")
          .getPublicUrl(`${userId}/${file.name}`);

        if (data?.publicUrl) {
          window.open(data.publicUrl, "_blank");
        }
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to retrieve client files.");
    } finally {
      setDownloadingId(null);
    }
  };
  // -------------------------------

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
              Manage incoming builds and retrieve client assets.
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
                  <th className="p-6">Client Details</th>
                  <th className="p-6">Preferences</th>
                  <th className="p-6">Order Date</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Assets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Client Name & Tier */}
                    <td className="p-6">
                      <p className="font-bold text-gray-900">
                        {order.users?.full_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.users?.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded">
                        {order.tiers?.tier_name}
                      </span>
                    </td>

                    {/* Design Preferences */}
                    <td className="p-6 text-sm text-gray-600 max-w-xs truncate">
                      {order.portfolio_content?.[0]?.design_preferences ||
                        "None specified"}
                    </td>

                    {/* Date */}
                    <td className="p-6 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString("en-GB")}
                    </td>

                    {/* Status Update Dropdown */}
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

                    {/* Download Button */}
                    <td className="p-6">
                      <button
                        onClick={() => handleDownloadFiles(order.user_id)}
                        disabled={downloadingId === order.user_id}
                        className="text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {downloadingId === order.user_id
                          ? "Fetching..."
                          : "Download Files"}
                      </button>
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
