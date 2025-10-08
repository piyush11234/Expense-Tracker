// import axios from "axios";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function Home() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     amount: "",
//     category: "",
//     date: "",
//   });
//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem("token");

//   // Redirect to login if not authenticated
//   useEffect(() => {
//     if (!token) {
//       toast.warning("Please login to continue");
//       navigate("/login");
//     } else {
//       fetchExpenses();
//     }
//   }, [token, navigate]);

//   // Fetch user-specific expenses
//   const fetchExpenses = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         "https://vercel-backend-one-sepia.vercel.app/api/expense/view",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setExpenses(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching expenses:", err);
//       toast.error("Failed to fetch expenses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add expense
//   const addExpense = async (e) => {
//     e.preventDefault();
//     if (!formData.amount || !formData.category || !formData.date) {
//       toast.warning("Please fill all fields");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         "https://vercel-backend-one-sepia.vercel.app/api/expense/insert",
//         formData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.status === 200) {
//         toast.success("Expense added successfully");
//         setFormData({ amount: "", category: "", date: "" });
//         fetchExpenses();
//       }
//     } catch (err) {
//       toast.error("Failed to add expense");
//       console.error(err);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Delete expense
//   const deleteExpense = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this expense?")) return;
//     try {
//       await axios.delete(
//         `https://vercel-backend-one-sepia.vercel.app/api/expense/delete/${id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("Expense deleted successfully");
//       fetchExpenses();
//     } catch (err) {
//       console.error("Delete error", err);
//       toast.error("Failed to delete expense");
//     }
//   };

//   // ---- Stats ----
//   const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
//   const thisMonth = expenses
//     .filter((exp) => new Date(exp.date).getMonth() === new Date().getMonth())
//     .reduce((sum, exp) => sum + Number(exp.amount), 0);

//   const categoryTotals = expenses.reduce((acc, exp) => {
//     acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
//     return acc;
//   }, {});

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center py-10">
//       <ToastContainer position="top-center" autoClose={2000} />

//       {/* Title */}
//       <h1 className="font-extrabold text-white text-4xl md:text-5xl mb-10 drop-shadow-lg tracking-wide animate-fadeIn">
//         💰 Expense Tracker Dashboard
//       </h1>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-[90%] max-w-6xl mb-10">
//         <div className="backdrop-blur-md bg-white/20 p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition">
//           <h3 className="text-xl font-semibold text-white">Total Expenses</h3>
//           <p className="text-3xl font-bold text-yellow-300 mt-2">₹{totalExpenses}</p>
//         </div>
//         <div className="backdrop-blur-md bg-white/20 p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition">
//           <h3 className="text-xl font-semibold text-white">This Month</h3>
//           <p className="text-3xl font-bold text-green-300 mt-2">₹{thisMonth}</p>
//         </div>
//         <div className="backdrop-blur-md bg-white/20 p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition">
//           <h3 className="text-xl font-semibold text-white">Top Category</h3>
//           <p className="text-3xl font-bold text-pink-300 mt-2">
//             {Object.keys(categoryTotals).length
//               ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]
//               : "—"}
//           </p>
//         </div>
//       </div>

//       {/* Main Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-[90%] max-w-6xl">
//         {/* Form */}
//         <div className="backdrop-blur-md bg-white/20 rounded-2xl shadow-xl p-8">
//           <h2 className="text-2xl font-bold text-white mb-6">➕ Add Expense</h2>
//           <form className="flex flex-col gap-6" onSubmit={addExpense}>
//             <div>
//               <label className="text-white font-semibold">Amount</label>
//               <input
//                 type="number"
//                 name="amount"
//                 className="mt-2 border border-white/30 rounded-lg p-3 w-full bg-white/10 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
//                 placeholder="Enter Amount"
//                 onChange={handleChange}
//                 value={formData.amount}
//               />
//             </div>
//             <div>
//               <label className="text-white font-semibold">Category</label>
//               <select
//                 name="category"
//                 className="mt-2 border border-white/30 rounded-lg p-3 w-full bg-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                 onChange={handleChange}
//                 value={formData.category}
//               >
//                 <option value="">Select Category</option>
//                 <option value="food">🍔 Food</option>
//                 <option value="transport">🚗 Transport</option>
//                 <option value="entertainment">🎬 Entertainment</option>
//                 <option value="utilities">💡 Utilities</option>
//                 <option value="other">📌 Other</option>
//               </select>
//             </div>
//             <div>
//               <label className="text-white font-semibold">Date</label>
//               <input
//                 type="date"
//                 name="date"
//                 className="mt-2 border border-white/30 rounded-lg p-3 w-full bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
//                 onChange={handleChange}
//                 value={formData.date}
//               />
//             </div>
//             <button
//               type="submit"
//               className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-lg font-semibold hover:opacity-90 transition shadow-lg"
//             >
//               Add Expense
//             </button>
//           </form>
//         </div>

//         {/* Expense List */}
//         <div className="backdrop-blur-md bg-white/20 rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[500px]">
//           <h2 className="text-2xl font-bold text-white mb-6 text-center">📋 Expense List</h2>

//           {loading ? (
//             <p className="text-center text-white">Loading...</p>
//           ) : expenses.length === 0 ? (
//             <p className="text-center text-white">No expenses found</p>
//           ) : (
//             <table className="w-full border-collapse text-white">
//               <thead>
//                 <tr className="bg-white/10">
//                   <th className="px-4 py-2 border border-white/20">Amount</th>
//                   <th className="px-4 py-2 border border-white/20">Category</th>
//                   <th className="px-4 py-2 border border-white/20">Date</th>
//                   <th className="px-4 py-2 border border-white/20">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {expenses.map((exp) => (
//                   <tr key={exp._id} className="hover:bg-white/10 transition duration-200">
//                     <td className="px-4 py-2 border border-white/20 text-center">₹{exp.amount}</td>
//                     <td className="px-4 py-2 border border-white/20 text-center capitalize">{exp.category}</td>
//                     <td className="px-4 py-2 border border-white/20 text-center">{exp.date?.split("T")[0]}</td>
//                     <td
//                       className="text-red-400 px-4 py-2 border border-white/20 text-center cursor-pointer hover:text-red-600"
//                       onClick={() => deleteExpense(exp._id)}
//                     >
//                       🗑️
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;



import axios from "axios";
import { useState, useEffect } from "react";
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
    date: "",
  });
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalSpent: 0, totalReceived: 0, balance: 0 });
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      toast.error("Failed to apply filter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center py-10">
      <ToastContainer position="top-center" autoClose={2000} />
      <h1 className="font-extrabold text-white text-4xl md:text-5xl mb-10 drop-shadow-lg tracking-wide">
        💰 Expense Tracker Dashboard
      </h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-[90%] max-w-6xl mb-10">
        <div className="bg-white/20 p-6 rounded-2xl text-center shadow-lg">
          <h3 className="text-xl text-white">Total Spent</h3>
          <p className="text-3xl font-bold text-red-400 mt-2">₹{summary.totalSpent}</p>
        </div>
        <div className="bg-white/20 p-6 rounded-2xl text-center shadow-lg">
          <h3 className="text-xl text-white">Total Received</h3>
          <p className="text-3xl font-bold text-green-400 mt-2">₹{summary.totalReceived}</p>
        </div>
        <div className="bg-white/20 p-6 rounded-2xl text-center shadow-lg">
          <h3 className="text-xl text-white">Balance</h3>
          <p className="text-3xl font-bold text-yellow-300 mt-2">₹{summary.balance}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        <button onClick={() => filterExpenses({ period: "day" })} className="px-4 py-2 bg-white/20 text-white rounded-lg">Today</button>
        <button onClick={() => filterExpenses({ period: "week" })} className="px-4 py-2 bg-white/20 text-white rounded-lg">This Week</button>
        <button onClick={() => filterExpenses({ period: "month" })} className="px-4 py-2 bg-white/20 text-white rounded-lg">This Month</button>
        <button onClick={fetchExpenses} className="px-4 py-2 bg-white/20 text-white rounded-lg">All</button>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-[90%] max-w-6xl">
        {/* Add Expense Form */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">➕ Add Expense</h2>
          <form className="flex flex-col gap-6" onSubmit={addExpense}>
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              className="p-3 rounded-lg bg-white/10 text-white border border-white/30 focus:outline-none"
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-300 text-gray-800"
            >
              <option value="">Select Category</option>
              <option value="food">🍔 Food</option>
              <option value="transport">🚗 Transport</option>
              <option value="entertainment">🎬 Entertainment</option>
              <option value="utilities">💡 Utilities</option>
              <option value="other">📌 Other</option>
            </select>
            <input
              type="text"
              name="description"
              placeholder="Optional description"
              value={formData.description}
              onChange={handleChange}
              className="p-3 rounded-lg bg-white/10 text-white border border-white/30 focus:outline-none"
            />
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-300 text-gray-800"
            >
              <option value="spent">💸 Spent</option>
              <option value="received">💰 Received</option>
            </select>
            <input
              type="text"
              name="group"
              placeholder="Group (Personal, Family, etc.)"
              value={formData.group}
              onChange={handleChange}
              className="p-3 rounded-lg bg-white/10 text-white border border-white/30 focus:outline-none"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="p-3 rounded-lg bg-white/10 text-white border border-white/30 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-lg font-semibold hover:opacity-90 transition shadow-lg"
            >
              Add Expense
            </button>
          </form>
        </div>

        {/* Expense List */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[500px]">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">📋 Expense List</h2>

          {loading ? (
            <p className="text-center text-white">Loading...</p>
          ) : expenses.length === 0 ? (
            <p className="text-center text-white">No expenses found</p>
          ) : (
            <table className="w-full border-collapse text-white">
              <thead>
                <tr className="bg-white/10">
                  <th className="px-3 py-2 border border-white/20">Type</th>
                  <th className="px-3 py-2 border border-white/20">Amount</th>
                  <th className="px-3 py-2 border border-white/20">Category</th>
                  <th className="px-3 py-2 border border-white/20">Group</th>
                  <th className="px-3 py-2 border border-white/20">Date</th>
                  <th className="px-3 py-2 border border-white/20">Description</th>
                  <th className="px-3 py-2 border border-white/20">Action</th>
                </tr>
              </thead>
              <tbody>
                {[...expenses]
                  .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest first
                  .map((exp) => (
                    <tr
                      key={exp._id}
                      className={`hover:bg-white/10 transition duration-200 ${
                        exp.type === "spent" ? "bg-red-900/20" : "bg-green-900/20"
                      }`}
                    >
                      <td className="text-center px-3 py-2 border border-white/20 font-bold">
                        {exp.type === "spent" ? "💸 Spent" : "💰 Received"}
                      </td>
                      <td className="px-3 py-2 text-center border border-white/20 font-semibold">
                        ₹{exp.amount}
                      </td>
                      <td className="text-center capitalize border border-white/20">{exp.category}</td>
                      <td className="text-center border border-white/20">{exp.group}</td>
                      <td className="text-center border border-white/20">{exp.date?.split("T")[0]}</td>
                      <td className="text-center border border-white/20 italic text-gray-200">
                        {exp.description || "—"}
                      </td>
                      <td
                        className="text-red-400 px-3 py-2 text-center border border-white/20 cursor-pointer hover:text-red-600"
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

export default Home;
