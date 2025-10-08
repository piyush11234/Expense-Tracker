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

  const token = localStorage.getItem("token");

  // Categories with better organization
  const categories = [
    { value: "food", label: "🍔 Food & Dining", color: "bg-orange-500" },
    { value: "transport", label: "🚗 Transport", color: "bg-blue-500" },
    { value: "entertainment", label: "🎬 Entertainment", color: "bg-purple-500" },
    { value: "shopping", label: "🛍️ Shopping", color: "bg-pink-500" },
    { value: "utilities", label: "💡 Utilities", color: "bg-yellow-500" },
    { value: "healthcare", label: "🏥 Healthcare", color: "bg-green-500" },
    { value: "other", label: "📌 Other", color: "bg-gray-500" },
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

  // Get category color
  const getCategoryColor = (category) => {
    const found = categories.find(cat => cat.value === category);
    return found ? found.color : "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <ToastContainer 
        position="top-center" 
        autoClose={2000}
        toastClassName="rounded-xl shadow-lg"
      />
      
      {/* Header - Keep your existing header code here */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        {/* Your existing header code */}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards - Keep your existing summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Your existing summary cards code */}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Add Expense Form - Keep your existing form */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            {/* Your existing form code */}
          </div>

          {/* Enhanced Expense List */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white mr-3">📋</span>
                Transaction History
              </h2>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
                {filteredExpenses.length} transactions
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-slate-500">Loading transactions...</p>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-slate-500 text-lg">No transactions found</p>
                <p className="text-slate-400">Add your first transaction to get started!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {/* Mobile Card View */}
                <div className="block md:hidden space-y-3">
                  {filteredExpenses.map((exp) => (
                    <div
                      key={exp._id}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-all duration-200"
                    >
                      {/* Top Row - Amount and Actions */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${getCategoryColor(exp.category)}`}>
                            {exp.type === "spent" ? "💸" : "💰"}
                          </div>
                          <div>
                            <span className={`text-lg font-bold ${exp.type === "spent" ? "text-red-600" : "text-green-600"}`}>
                              {exp.type === "spent" ? "-" : "+"}₹{exp.amount}
                            </span>
                            <p className="text-slate-600 text-sm capitalize">{exp.category}</p>
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
                      
                      {/* Bottom Row - Details */}
                      <div className="flex justify-between items-center text-sm text-slate-500">
                        <div className="flex flex-col space-y-1">
                          {exp.description && (
                            <span className="text-slate-600">📝 {exp.description}</span>
                          )}
                          <span>👥 {exp.group}</span>
                        </div>
                        <span>📅 {exp.date?.split("T")[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-1 gap-3">
                    {filteredExpenses.map((exp) => (
                      <div
                        key={exp._id}
                        className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${getCategoryColor(exp.category)}`}>
                              {exp.type === "spent" ? "💸" : "💰"}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-slate-800 capitalize">
                                  {exp.category}
                                </span>
                                {exp.description && (
                                  <span className="text-slate-500 text-sm">• {exp.description}</span>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
                                <span>👥 {exp.group}</span>
                                <span>📅 {exp.date?.split("T")[0]}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <span className={`text-lg font-bold ${
                              exp.type === "spent" ? "text-red-600" : "text-green-600"
                            }`}>
                              {exp.type === "spent" ? "-" : "+"}₹{exp.amount}
                            </span>
                            <button
                              onClick={() => deleteExpense(exp._id)}
                              className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;