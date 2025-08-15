import React, { useEffect, useState } from "react";
import API from "@/utils/axiosInstance";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/admin/dashboard", {
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem("token")}`,
          // },
        });
        setStats(data.stats);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <Card className="bg-white shadow-lg rounded-xl">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card className="bg-white shadow-lg rounded-xl">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-700">Total Products</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.totalProducts}</p>
          </CardContent>
        </Card>

        {/* Total Reviews */}
        <Card className="bg-white shadow-lg rounded-xl">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-700">Total Reviews</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{stats.totalReviews}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
