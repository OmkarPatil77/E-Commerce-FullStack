import { useState } from "react";
import API from "../utils/axiosInstance.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const res = await API.post("/auth/login", formData);

    if (res.data?.data?.token) {
      localStorage.setItem("token", res.data.data.token);
    }

    setMessage("Login successful!");
    console.log("Login response:", res.data);
    navigate("/");

  } catch (err) {
    let errorMsg = "Login failed. Try again.";

    if (err.response?.data?.message) {
      errorMsg = err.response.data.message;
    } else if (err.request) {
      errorMsg = "No response from server. Please check your connection.";
    } else {
      errorMsg = `Error: ${err.message}`;
    }

    console.error("Login failed:", err);
    setMessage(errorMsg);
  }
};

  return (
     <div className="min-h-screen w-full flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password:</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {message && (
          <p className="text-center text-red-500 mt-4">{message}</p>
        )}

        <p className="text-sm mt-2 text-center text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-blue-600 font-semibold hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
