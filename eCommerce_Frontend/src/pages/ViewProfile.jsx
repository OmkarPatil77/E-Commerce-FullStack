// src/pages/ViewProfile.jsx
import { useEffect, useState } from "react";
import API from "../utils/axiosInstance.js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ViewProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Check if user is logged in

  useEffect(() => {

     if (!token) {
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/auth/profile");
        setProfile(data.data); // Assuming ApiResponse wraps data
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

    // If not logged in
  if (!token) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md shadow-lg p-6 text-center">
          <CardTitle className="text-xl mb-4">Not Logged In</CardTitle>
          <p className="mb-4">You need to log in or register to view your profile.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate("/login")}>Login</Button>
            <Button onClick={() => navigate("/register")} variant="secondary">
              Register
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold">Username:</p>
            <p>{profile?.username}</p>
          </div>
          <div>
            <p className="font-semibold">Email:</p>
            <p>{profile?.email}</p>
          </div>
          <div>
            <p className="font-semibold">Role:</p>
            <p>{profile?.role}</p>
          </div>

          {/* Show only for Admin */}
          {profile?.role === "ADMIN" && (
            <Button
              className="w-full mt-2 bg-green-600 hover:bg-green-700"
              onClick={() => navigate("/add-product")}
            >
              Add Product
            </Button>
          )}

          {profile?.role === "ADMIN" && (
            <Button
              className="w-full mt-2 bg-yellow-400 text-black hover:bg-yellow-500"
              onClick={() => navigate("/admin-dashboard")}
            >
              View Dashboard
            </Button>
          )}

          <Button
            className="w-full mt-4"
            variant="default"
            onClick={() => navigate("/update-profile")}
          >
            Update Profile
          </Button>
          <Button
            className="w-full mt-2"
            variant="destructive"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}




















// import React, { useEffect, useState } from "react";
// import axiosInstance from "@/api";
// import { Card, CardContent } from "@/components/ui/card";

// const ViewProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axiosInstance.get("/auth/profile");
//         setProfile(res.data.data);
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//         setError("Failed to load profile.");
//       }
//     };
//     fetchProfile();
//   }, []);

//   if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
//   if (!profile) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <Card className="w-full max-w-md shadow-xl">
//         <CardContent className="p-6 space-y-2">
//           <h2 className="text-xl font-bold mb-4">User Profile</h2>
//           <p><strong>Username:</strong> {profile.username}</p>
//           <p><strong>Email:</strong> {profile.email}</p>
//           <p><strong>Role:</strong> {profile.role}</p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ViewProfile;
