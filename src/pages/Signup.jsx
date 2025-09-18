import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "https://vercel-backend-one-sepia.vercel.app/api/user/signup",
        formData
      );
      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
      <ToastContainer position="top-center" autoClose={2000} />
      <form
        onSubmit={handleSignup}
        className="bg-white/10 p-8 rounded-2xl backdrop-blur-md shadow-lg flex flex-col gap-4 w-[300px]"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-4">Signup</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="p-2 rounded bg-white/20 text-white placeholder-gray-200 focus:outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="p-2 rounded bg-white/20 text-white placeholder-gray-200 focus:outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="p-2 rounded bg-white/20 text-white placeholder-gray-200 focus:outline-none"
        />
        <button className="cursor-pointer bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
          Signup
        </button>
        <p className="text-white text-sm text-center">
          Already have an account?{" "}
          <span
            className="text-yellow-300 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
