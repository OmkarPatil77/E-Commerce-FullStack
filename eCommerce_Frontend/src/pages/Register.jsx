// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import API from "../utils/axiosInstance.js";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setMessage("");

    try {
      const res = await API.post("/auth/register", formData);

      if (res.data?.data?.token) {
        localStorage.setItem("token", res.data.data.token);
      }

      setMessage("Registration successful!");
      console.log("Register response:", res.data);

      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";

      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
  <form
    onSubmit={handleSubmit}
    className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
  >
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
      Create an Account
    </h2>

    {errorMsg && (
      <p className="text-red-500 text-sm text-center">{errorMsg}</p>
    )}
    {message && (
      <p className="text-green-500 text-sm text-center">{message}</p>
    )}

    <div>
      <Label htmlFor="username" className="text-gray-700 font-medium">
        Username
      </Label>
      <Input
        id="username"
        name="username"
        placeholder="Enter your username"
        value={formData.username}
        onChange={handleChange}
        className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <Label htmlFor="email" className="text-gray-700 font-medium">
        Email
      </Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <Label htmlFor="password" className="text-gray-700 font-medium">
        Password
      </Label>
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Enter Password"
        value={formData.password}
        onChange={handleChange}
        className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <Label className="text-gray-700 font-medium">Role</Label>
      <Select
        onValueChange={handleRoleChange}
        defaultValue="USER"
        className="mt-1 w-full"
      >
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USER">User</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <Button
      type="submit"
      className="w-full py-2 text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-md font-semibold"
      disabled={loading}
    >
      {loading ? "Registering..." : "Register"}
    </Button>

    <p className="text-sm text-center text-gray-600">
    Already have an account?{" "}
    <button
      type="button"
      className="text-blue-600 font-semibold hover:underline"
      onClick={() => navigate("/login")}
    >
      Login
    </button>
  </p>
  </form>
</div>

  );
};

export default Register;
