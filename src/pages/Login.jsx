import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.warning("Please fill all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://vercel-backend-one-sepia.vercel.app/api/user/login",
        formData
      );
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <ToastContainer position="top-center" autoClose={2000} />
      
      {/* Main Container */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Left Side - Brand/Image Section */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center p-8">
          <div className="text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">💰</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">Expense Tracker</h1>
            <p className="text-indigo-100">Manage your finances with ease and precision</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12">
          <div className="max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="md:hidden flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">💰</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-center mb-8">Sign in to your account</p>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="peer pt-8 pb-3 px-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder=" "
                  required
                />
                <label className="absolute top-2 left-4 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600 pointer-events-none">
                  Email Address
                </label>
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="peer pt-8 pb-3 px-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white pr-12"
                  placeholder=" "
                  required
                />
                <label className="absolute top-2 left-4 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600 pointer-events-none">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              {/* <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors">
                  Forgot password?
                </a>
              </div> */}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Social Login */}
              {/* <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span>GitHub</span>
                  </button>
                </div>
              </div> */}

              {/* Sign Up Link */}
              <p className="text-center text-gray-600 text-sm mt-8">
                Don't have an account?{" "}
                <span
                  className="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-500 transition-colors"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;