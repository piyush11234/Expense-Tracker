import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check login status and scroll effect
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    checkLoginStatus();
    window.addEventListener("scroll", handleScroll);
    
    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener("storage", checkLoginStatus);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: "/", label: "Dashboard", icon: "📊", requiresAuth: true },
    { path: "/login", label: "Login", icon: "🔐", requiresAuth: false },
    { path: "/signup", label: "Sign Up", icon: "🚀", requiresAuth: false },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200" 
        : "bg-white/90 backdrop-blur-md"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <span className="text-white text-lg">💰</span>
            </div>
            <div>
              <h1 className={`font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${
                isScrolled ? "text-transparent" : ""
              }`}>
                ExpenseTracker
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Manage your finances</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isLoggedIn ? (
              <>
                <Link
                  to="/"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActiveRoute("/") 
                      ? "bg-blue-100 text-blue-700 font-semibold" 
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <span>📊</span>
                  <span>Dashboard</span>
                </Link>
                
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {localStorage.getItem("userInitial") || "U"}
                    </div>
                    <span>▼</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">
                        {localStorage.getItem("userName") || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {localStorage.getItem("userEmail") || "Welcome!"}
                      </p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all duration-200 ${
                    isActiveRoute("/login")
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <span>🔐</span>
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <span>🚀</span>
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <span className="text-2xl">✕</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-lg rounded-b-2xl shadow-lg">
            {isLoggedIn ? (
              <div className="space-y-2">
                <Link
                  to="/"
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    isActiveRoute("/")
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">📊</span>
                  <span>Dashboard</span>
                </Link>
                
                {/* User Info in Mobile */}
                <div className="p-3 border-t border-gray-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {localStorage.getItem("userInitial") || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {localStorage.getItem("userName") || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {localStorage.getItem("userEmail") || "Welcome!"}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <span className="text-lg">🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    isActiveRoute("/login")
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">🔐</span>
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">🚀</span>
                  <span>Get Started Free</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;