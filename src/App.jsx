import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: "",
  });

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/expense/view");
      setExpenses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.date) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/expense/insert",
        formData
      );
      if (res.status === 200) {
        toast.success("Expense added successfully");
        setFormData({ amount: "", category: "", date: "" });
        fetchExpenses();
      }
    } catch (err) {
      toast.error("Failed to add expense");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/expense/delete/${id}`);
      toast.success("Expense deleted successfully");
      fetchExpenses();
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Failed to delete expense");
    }
  };

  // ---- Stats ----
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const thisMonth = expenses
    .filter((exp) => new Date(exp.date).getMonth() === new Date().getMonth())
    .reduce((sum, exp) => sum + Number(exp.amount), 0);

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center py-10">
      <ToastContainer position="top-center" autoClose={2000} />

      {/* Title */}
      <h1 className="font-extrabold text-white text-4xl md:text-5xl mb-10 drop-shadow-lg tracking-wide animate-fadeIn">
        💰 Expense Tracker Dashboard
      </h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-[90%] max-w-6xl mb-10">
        <div className="backdrop-blur-md bg-white/20 p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition">
          <h3 className="text-xl font-semibold text-white">Total Expenses</h3>
          <p className="text-3xl font-bold text-yellow-300 mt-2">₹{totalExpenses}</p>
        </div>
        <div className="backdrop-blur-md bg-white/20 p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition">
          <h3 className="text-xl font-semibold text-white">This Month</h3>
          <p className="text-3xl font-bold text-green-300 mt-2">₹{thisMonth}</p>
        </div>
        <div className="backdrop-blur-md bg-white/20 p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition">
          <h3 className="text-xl font-semibold text-white">Top Category</h3>
          <p className="text-3xl font-bold text-pink-300 mt-2">
            {Object.keys(categoryTotals).length
              ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]
              : "—"}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-[90%] max-w-6xl">
        {/* Left Form */}
        <div className="backdrop-blur-md bg-white/20 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">➕ Add Expense</h2>
          <form className="flex flex-col gap-6" onSubmit={addExpense}>
            <div>
              <label className="text-white font-semibold">Amount</label>
              <input
                type="number"
                name="amount"
                className="mt-2 border border-white/30 rounded-lg p-3 w-full bg-white/10 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Enter Amount"
                onChange={handleChange}
                value={formData.amount}
              />
            </div>
            <div>
              <label className="text-white font-semibold">Category</label>
              <select
                name="category"
                className="mt-2 border border-white/30 rounded-lg p-3 w-full bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onChange={handleChange}
                value={formData.category}
              >
                <div className="text-black">
                  <option value="">Select Category</option>
                  <option value="food">🍔 Food</option>
                  <option value="transport">🚗 Transport</option>
                  <option value="entertainment">🎬 Entertainment</option>
                  <option value="utilities">💡 Utilities</option>
                  <option value="other">📌 Other</option>
                </div>
              </select>
            </div>
            <div>
              <label className="text-white font-semibold">Date</label>
              <input
                type="date"
                name="date"
                className="mt-2 border border-white/30 rounded-lg p-3 w-full bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                onChange={handleChange}
                value={formData.date}
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-lg font-semibold hover:opacity-90 transition shadow-lg"
            >
              Add Expense
            </button>
          </form>
        </div>

        {/* Right List */}
        <div className="backdrop-blur-md bg-white/20 rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[500px]">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            📋 Expense List
          </h2>

          {loading ? (
            <p className="text-center text-white">Loading...</p>
          ) : expenses.length === 0 ? (
            <p className="text-center text-white">No expenses found</p>
          ) : (
            <table className="w-full border-collapse text-white">
              <thead>
                <tr className="bg-white/10">
                  <th className="px-4 py-2 border border-white/20">Amount</th>
                  <th className="px-4 py-2 border border-white/20">Category</th>
                  <th className="px-4 py-2 border border-white/20">Date</th>
                  <th className="px-4 py-2 border border-white/20">Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr
                    key={exp._id}
                    className="hover:bg-white/10 transition duration-200"
                  >
                    <td className="px-4 py-2 border border-white/20 text-center">
                      ₹{exp.amount}
                    </td>
                    <td className="px-4 py-2 border border-white/20 text-center capitalize">
                      {exp.category}
                    </td>
                    <td className="px-4 py-2 border border-white/20 text-center">
                      {exp.date?.split("T")[0]}
                    </td>
                    <td
                      className="text-red-400 px-4 py-2 border border-white/20 text-center cursor-pointer hover:text-red-600"
                      onClick={() => deleteExpense(exp._id)}
                    >
                      🗑️
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
