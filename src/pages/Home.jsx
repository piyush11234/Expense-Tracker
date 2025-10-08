import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    type: "spent",
    group: "Personal",
    date: new Date().toISOString().split("T")[0],
  });
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalSpent: 0, totalReceived: 0, balance: 0 });
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const token = localStorage.getItem("token");

  // Check mobile screen on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Categories with better organization
  const categories = [
    { value: "food", label: "🍔 Food & Dining", color: "bg-orange-500", icon: "🍔" },
    { value: "transport", label: "🚗 Transport", color: "bg-blue-500", icon: "🚗" },
    { value: "entertainment", label: "🎬 Entertainment", color: "bg-purple-500", icon: "🎬" },
    { value: "shopping", label: "🛍️ Shopping", color: "bg-pink-500", icon: "🛍️" },
    { value: "utilities", label: "💡 Utilities", color: "bg-yellow-500", icon: "💡" },
    { value: "healthcare", label: "🏥 Healthcare", color: "bg-green-500", icon: "🏥" },
    { value: "other", label: "📌 Other", color: "bg-gray-500", icon: "📌" },
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      toast.warning("Please login to continue");
      navigate("/login");
    } else {
      fetchExpenses();
    }
  }, [token, navigate]);

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://vercel-backend-one-sepia.vercel.app/api/expense/view",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data.data || [];
      setExpenses(data);
      calculateSummary(data);
    } catch (err) {
      toast.error("Failed to fetch expenses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary
  const calculateSummary = (data) => {
    const totalSpent = data.filter(e => e.type === "spent").reduce((sum, e) => sum + Number(e.amount), 0);
    const totalReceived = data.filter(e => e.type === "received").reduce((sum, e) => sum + Number(e.amount), 0);
    setSummary({ totalSpent, totalReceived, balance: totalReceived - totalSpent });
  };

  // Add expense
  const addExpense = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.date) {
      toast.warning("Please fill all required fields");
      return;
    }

    try {
      const res = await axios.post(
        "https://vercel-backend-one-sepia.vercel.app/api/expense/insert",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        toast.success("Transaction added successfully");
        setFormData({
          amount: "",
          category: "",
          description: "",
          type: "spent",
          group: "Personal",
          date: new Date().toISOString().split("T")[0],
        });
        fetchExpenses();
      }
    } catch (err) {
      toast.error("Failed to add transaction");
      console.error(err);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Delete expense
  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await axios.delete(
        `https://vercel-backend-one-sepia.vercel.app/api/expense/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Transaction deleted successfully");
      fetchExpenses();
    } catch (err) {
      toast.error("Failed to delete transaction");
      console.error(err);
    }
  };

  // Filter expenses
  const filterExpenses = async (params = {}) => {
    try {
      setLoading(true);
      const query = new URLSearchParams(params).toString();
      const res = await axios.get(
        `https://vercel-backend-one-sepia.vercel.app/api/expense/filter?${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data.data || [];
      setExpenses(data);
      calculateSummary(data);
      setActiveFilter(params.period || "all");
    } catch (err) {
      toast.error("Failed to apply filter");
    } finally {
      setLoading(false);
    }
  };

  // Filtered expenses for display
  const filteredExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses]);

  // Get category info
  const getCategoryInfo = (category) => {
    const found = categories.find(cat => cat.value === category);
    return found || { color: "bg-gray-500", icon: "📌" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-8">
      <ToastContainer 
        position={isMobile ? "top-center" : "top-right"}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-lg shadow-md"
        bodyClassName="text-sm font-medium"
      />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                💰 Expense Tracker
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2 lg:space-x-4">
              {["day", "week", "month", "all"].map((period) => (
                <button 
                  key={period}
                  onClick={() => period === "all" ? fetchExpenses() : filterExpenses({ period })}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${
                    activeFilter === period 
                      ? "bg-blue-100 text-blue-700 border border-blue-200" 
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {period === "day" && "📅 Today"}
                  {period === "week" && "📆 Week"}
                  {period === "month" && "🗓️ Month"}
                  {period === "all" && "🔄 All"}
                </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="text-xl">{mobileMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-slate-200 bg-white">
              <div className="grid grid-cols-2 gap-2">
                {["day", "week", "month", "all"].map((period) => (
                  <button 
                    key={period}
                    onClick={() => {
                      period === "all" ? fetchExpenses() : filterExpenses({ period });
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                      activeFilter === period 
                        ? "bg-blue-100 text-blue-700 border border-blue-200" 
                        : "text-slate-600 hover:bg-slate-100 border border-transparent"
                    }`}
                  >
                    {period === "day" && "📅 Today"}
                    {period === "week" && "📆 Week"}
                    {period === "month" && "🗓️ Month"}
                    {period === "all" && "🔄 All"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-xs sm:text-sm font-medium">Total Spent</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">₹{summary.totalSpent.toLocaleString()}</p>
              </div>
              <div className="text-2xl sm:text-3xl">💸</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm font-medium">Total Received</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">₹{summary.totalReceived.toLocaleString()}</p>
              </div>
              <div className="text-2xl sm:text-3xl">💰</div>
            </div>
          </div>
          
          <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg ${
            summary.balance >= 0 
              ? "bg-gradient-to-br from-blue-500 to-cyan-600" 
              : "bg-gradient-to-br from-orange-500 to-red-600"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm font-medium">Balance</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">₹{summary.balance.toLocaleString()}</p>
              </div>
              <div className="text-2xl sm:text-3xl">{summary.balance >= 0 ? "📈" : "📉"}</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Add Expense Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center">
              <span className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-2 sm:mr-3 text-sm sm:text-base">+</span>
              Add New Transaction
            </h2>
            
            <form onSubmit={addExpense} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">Amount ₹</label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm sm:text-base"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Optional description..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm sm:text-base"
                  >
                    <option value="spent">💸 Spent</option>
                    <option value="received">💰 Received</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">Group</label>
                  <input
                    type="text"
                    name="group"
                    placeholder="Personal, Family, etc."
                    value={formData.group}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg text-sm sm:text-base"
              >
                💾 Add Transaction
              </button>
            </form>
          </div>

          {/* Expense List */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center">
                <span className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500 rounded-lg flex items-center justify-center text-white mr-2 sm:mr-3 text-sm sm:text-base">📋</span>
                Transaction History
              </h2>
              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
                {filteredExpenses.length} transactions
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mb-2 sm:mb-4"></div>
                <p className="text-slate-500 text-sm sm:text-base">Loading transactions...</p>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📊</div>
                <p className="text-slate-500 text-base sm:text-lg">No transactions found</p>
                <p className="text-slate-400 text-sm sm:text-base">Add your first transaction to get started!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {filteredExpenses.map((exp) => {
                  const categoryInfo = getCategoryInfo(exp.category);
                  return (
                    <div
                      key={exp._id}
                      className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200 hover:border-slate-300 transition-all duration-200 group"
                    >
                      {/* Mobile Layout */}
                      <div className="block sm:hidden">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white ${categoryInfo.color} text-sm`}>
                              {categoryInfo.icon}
                            </div>
                            <div>
                              <span className={`text-base font-bold ${exp.type === "spent" ? "text-red-600" : "text-green-600"}`}>
                                {exp.type === "spent" ? "-" : "+"}₹{exp.amount}
                              </span>
                              <p className="text-slate-600 text-xs capitalize">{exp.category}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteExpense(exp._id)}
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-slate-500">
                          <div className="flex flex-col space-y-1">
                            {exp.description && (
                              <span className="text-slate-600 truncate max-w-[120px]">📝 {exp.description}</span>
                            )}
                            <span>👥 {exp.group}</span>
                          </div>
                          <span>📅 {exp.date?.split("T")[0]}</span>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:flex items-center justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white ${categoryInfo.color}`}>
                            {exp.type === "spent" ? "💸" : "💰"}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-slate-800 capitalize text-sm sm:text-base">
                                {exp.category}
                              </span>
                              {exp.description && (
                                <span className="text-slate-500 text-xs sm:text-sm">• {exp.description}</span>
                              )}
                            </div>
                            <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-slate-500 mt-1">
                              <span>👥 {exp.group}</span>
                              <span>📅 {exp.date?.split("T")[0]}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <span className={`text-base sm:text-lg font-bold ${
                            exp.type === "spent" ? "text-red-600" : "text-green-600"
                          }`}>
                            {exp.type === "spent" ? "-" : "+"}₹{exp.amount}
                          </span>
                          <button
                            onClick={() => deleteExpense(exp._id)}
                            className="opacity-0 group-hover:opacity-100 p-1 sm:p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;