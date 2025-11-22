import { useEffect, useState } from "react";
import API from "@/utils/axiosInstance";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/orders/my")
      .then((res) => setOrders(res.data.data || []))
      .catch(() => alert("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="max-w-4xl h-svh mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 shadow-sm">
            <p className="font-semibold">Order ID: {order._id}</p>
            <p>Status: <span className="text-blue-600">{order.status}</span></p>
            <p>Total: ₹{order.total}</p>
            <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
}
