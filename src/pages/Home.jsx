import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled, { keyframes } from "styled-components";

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  padding: 2rem 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  animation: ${fadeIn} 0.6s ease-out;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(45deg, #FF6B6B, #FF8E53);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const FilterButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.15)'};
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 0.3rem 0.5rem 0;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
`;

const ExpenseItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.8rem;
  border-left: 4px solid ${props => props.type === 'spent' ? '#FF6B6B' : '#4ECDC4'};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }
`;

// Main Component
function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    type: "spent",
    group: "Personal",
    date: "",
  });
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalSpent: 0, totalReceived: 0, balance: 0 });
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const token = localStorage.getItem("token");

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
        toast.success("Expense added successfully");
        setFormData({
          amount: "",
          category: "",
          description: "",
          type: "spent",
          group: "Personal",
          date: "",
        });
        fetchExpenses();
      }
    } catch (err) {
      toast.error("Failed to add expense");
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
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await axios.delete(
        `https://vercel-backend-one-sepia.vercel.app/api/expense/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Expense deleted successfully");
      fetchExpenses();
    } catch (err) {
      toast.error("Failed to delete expense");
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

  return (
    <AppContainer>
      <ToastContainer 
        position="top-center" 
        autoClose={2000}
        toastStyle={{
          background: "rgba(255, 255, 255, 0.9)",
          color: "#333",
          borderRadius: "12px"
        }}
      />
      
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-5xl font-black text-white text-center mb-12 drop-shadow-lg tracking-tight">
          💰 Expense Tracker
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-2">Total Spent</h3>
            <p className="text-4xl font-bold text-red-300">₹{summary.totalSpent}</p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-2">Total Received</h3>
            <p className="text-4xl font-bold text-green-300">₹{summary.totalReceived}</p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-2">Balance</h3>
            <p className={`text-4xl font-bold ${summary.balance >= 0 ? 'text-yellow-300' : 'text-red-300'}`}>
              ₹{summary.balance}
            </p>
          </GlassCard>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center mb-8">
          <FilterButton 
            active={activeFilter === "day"} 
            onClick={() => filterExpenses({ period: "day" })}
          >
            📅 Today
          </FilterButton>
          <FilterButton 
            active={activeFilter === "week"} 
            onClick={() => filterExpenses({ period: "week" })}
          >
            📆 This Week
          </FilterButton>
          <FilterButton 
            active={activeFilter === "month"} 
            onClick={() => filterExpenses({ period: "month" })}
          >
            🗓️ This Month
          </FilterButton>
          <FilterButton 
            active={activeFilter === "all"} 
            onClick={() => { fetchExpenses(); setActiveFilter("all"); }}
          >
            🔄 All
          </FilterButton>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Expense Form */}
          <GlassCard>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              ➕ Add New Transaction
            </h2>
            <form onSubmit={addExpense}>
              <StyledInput
                type="number"
                name="amount"
                placeholder="Amount ₹"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
              <StyledSelect
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option value="food">🍔 Food & Dining</option>
                <option value="transport">🚗 Transport</option>
                <option value="entertainment">🎬 Entertainment</option>
                <option value="shopping">🛍️ Shopping</option>
                <option value="utilities">💡 Utilities</option>
                <option value="healthcare">🏥 Healthcare</option>
                <option value="other">📌 Other</option>
              </StyledSelect>
              <StyledInput
                type="text"
                name="description"
                placeholder="📝 Description (optional)"
                value={formData.description}
                onChange={handleChange}
              />
              <StyledSelect
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="spent">💸 Spent</option>
                <option value="received">💰 Received</option>
              </StyledSelect>
              <StyledInput
                type="text"
                name="group"
                placeholder="👥 Group (Personal, Family, etc.)"
                value={formData.group}
                onChange={handleChange}
              />
              <StyledInput
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
              <PrimaryButton type="submit">
                💾 Add Transaction
              </PrimaryButton>
            </form>
          </GlassCard>

          {/* Expense List */}
          <GlassCard>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              📋 Recent Transactions
            </h2>

            {loading ? (
              <div className="text-center text-white py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2">Loading transactions...</p>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="text-center text-white py-8">
                <p className="text-lg">No transactions found</p>
                <p className="text-sm opacity-75">Add your first transaction to get started!</p>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto pr-2">
                {filteredExpenses.map((exp) => (
                  <ExpenseItem key={exp._id} type={exp.type}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-white capitalize">
                            {exp.category} 
                            {exp.description && ` · ${exp.description}`}
                          </span>
                          <span className={`font-bold text-lg ${
                            exp.type === "spent" ? "text-red-300" : "text-green-300"
                          }`}>
                            {exp.type === "spent" ? "-" : "+"}₹{exp.amount}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-200">
                          <span>👥 {exp.group}</span>
                          <span>📅 {exp.date?.split("T")[0]}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteExpense(exp._id)}
                        className="ml-3 text-red-300 hover:text-red-500 transition-colors p-1"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </ExpenseItem>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </AppContainer>
  );
}

export default Home;