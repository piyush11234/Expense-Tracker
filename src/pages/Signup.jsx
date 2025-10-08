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
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check password strength
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const mediumRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (strongRegex.test(password)) {
      setPasswordStrength("strong");
    } else if (mediumRegex.test(password)) {
      setPasswordStrength("medium");
    } else if (password.length > 0) {
      setPasswordStrength("weak");
    } else {
      setPasswordStrength("");
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "strong":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "weak":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case "strong":
        return "Strong password";
      case "medium":
        return "Medium strength";
      case "weak":
        return "Weak password";
      default:
        return "Password strength";
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.warning("Please fill all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://vercel-backend-one-sepia.vercel.app/api/user/signup",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password
        }
      );
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Signup failed");
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
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 items-center justify-center p-8">
          <div className="text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🚀</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">Join Expense Tracker</h1>
            <p className="text-green-100">Start managing your finances smarter today</p>
            <div className="mt-8 space-y-3 text-left">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">✓</span>
                <span className="text-green-100">Track expenses effortlessly</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">✓</span>
                <span className="text-green-100">Visualize your spending</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">✓</span>
                <span className="text-green-100">Achieve financial goals</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12">
          <div className="max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="md:hidden flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">💰</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Create Account</h2>
            <p className="text-gray-600 text-center mb-8">Join thousands managing their finances better</p>

            <form onSubmit={handleSignup} className="space-y-6">
              {/* Name Field */}
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="peer pt-8 pb-3 px-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder=" "
                  required
                />
                <label className="absolute top-2 left-4 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600 pointer-events-none">
                  Full Name
                </label>
              </div>

              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="peer pt-8 pb-3 px-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder=" "
                  required
                />
                <label className="absolute top-2 left-4 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600 pointer-events-none">
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
                  className="peer pt-8 pb-3 px-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white pr-12"
                  placeholder=" "
                  required
                  minLength="6"
                />
                <label className="absolute top-2 left-4 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600 pointer-events-none">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{getPasswordStrengthText()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()} ${
                          passwordStrength === "strong" ? "w-full" : 
                          passwordStrength === "medium" ? "w-2/3" : 
                          passwordStrength === "weak" ? "w-1/3" : "w-0"
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="peer pt-8 pb-3 px-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white pr-12"
                  placeholder=" "
                  required
                />
                <label className="absolute top-2 left-4 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600 pointer-events-none">
                  Confirm Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-1">
                    <span className={`text-xs ${
                      formData.password === formData.confirmPassword 
                        ? "text-green-600" 
                        : "text-red-600"
                    }`}>
                      {formData.password === formData.confirmPassword 
                        ? "✓ Passwords match" 
                        : "✗ Passwords don't match"
                      }
                    </span>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              {/* <label className="flex items-start space-x-3">
                <input 
                  type="checkbox" 
                  className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500" 
                  required 
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-green-600 hover:text-green-500 transition-colors">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-green-600 hover:text-green-500 transition-colors">
                    Privacy Policy
                  </a>
                </span>
              </label> */}

              {/* Signup Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Social Signup */}
              {/* <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or sign up with</span>
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

              {/* Login Link */}
              <p className="text-center text-gray-600 text-sm mt-8">
                Already have an account?{" "}
                <span
                  className="text-green-600 font-semibold cursor-pointer hover:text-green-500 transition-colors"
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;