import { useState, useEffect } from "react";
import API from "../utils/axiosInstance.js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/auth/profile");
        setForm({
          username: data.data.username || "",
          email: data.data.email || "",
          password: "",
          role: data.data.role || "",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await API.put("/auth/profile", form);
      navigate("/view-profile");
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              name="password"
              type="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
            />
            <Input
              name="role"
              placeholder="Role"
              value={form.role}
              onChange={handleChange}
            />
            <Button type="submit" className="w-full" disabled={updating}>
              {updating ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
              {updating ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
