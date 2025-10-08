import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// MUI Components
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as BalanceIcon,
} from "@mui/icons-material";

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
  const [activeTab, setActiveTab] = useState(0);

  const token = localStorage.getItem("token");

  // Categories with icons
  const categories = [
    { value: "food", label: "🍔 Food & Dining" },
    { value: "transport", label: "🚗 Transport" },
    { value: "entertainment", label: "🎬 Entertainment" },
    { value: "shopping", label: "🛍️ Shopping" },
    { value: "utilities", label: "💡 Utilities" },
    { value: "healthcare", label: "🏥 Healthcare" },
    { value: "other", label: "📌 Other" },
  ];

  // Your existing logic remains the same...
  useEffect(() => {
    if (!token) {
      toast.warning("Please login to continue");
      navigate("/login");
    } else {
      fetchExpenses();
    }
  }, [token, navigate]);

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

  const calculateSummary = (data) => {
    const totalSpent = data.filter(e => e.type === "spent").reduce((sum, e) => sum + Number(e.amount), 0);
    const totalReceived = data.filter(e => e.type === "received").reduce((sum, e) => sum + Number(e.amount), 0);
    setSummary({ totalSpent, totalReceived, balance: totalReceived - totalSpent });
  };

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
          date: new Date().toISOString().split("T")[0],
        });
        fetchExpenses();
      }
    } catch (err) {
      toast.error("Failed to add expense");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
    <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <ToastContainer position="top-center" autoClose={2000} />
      
      {/* Header */}
      <AppBar position="static" elevation={2} sx={{ backgroundColor: "white", color: "text.primary" }}>
        <Toolbar>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            💰 Expense Tracker
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ background: "linear-gradient(135deg, #ff6b6b, #ee5a52)" }}>
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <TrendingDownIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h5" gutterBottom>Total Spent</Typography>
                <Typography variant="h4" fontWeight="bold">₹{summary.totalSpent}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ background: "linear-gradient(135deg, #51cf66, #40c057)" }}>
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h5" gutterBottom>Total Received</Typography>
                <Typography variant="h4" fontWeight="bold">₹{summary.totalReceived}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ 
              background: summary.balance >= 0 
                ? "linear-gradient(135deg, #339af0, #228be6)" 
                : "linear-gradient(135deg, #ff8787, #fa5252)"
            }}>
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <BalanceIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h5" gutterBottom>Balance</Typography>
                <Typography variant="h4" fontWeight="bold">₹{summary.balance}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Filters */}
        <Box sx={{ mb: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button variant="outlined" onClick={() => filterExpenses({ period: "day" })}>Today</Button>
          <Button variant="outlined" onClick={() => filterExpenses({ period: "week" })}>This Week</Button>
          <Button variant="outlined" onClick={() => filterExpenses({ period: "month" })}>This Month</Button>
          <Button variant="outlined" onClick={fetchExpenses}>All Transactions</Button>
        </Box>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Add Expense Form */}
          <Grid item xs={12} lg={5}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <AddIcon sx={{ mr: 1 }} /> Add New Transaction
                </Typography>
                <form onSubmit={addExpense}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Amount"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        select
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        {categories.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Optional description"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                      >
                        <MenuItem value="spent">💸 Spent</MenuItem>
                        <MenuItem value="received">💰 Received</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Group"
                        name="group"
                        value={formData.group}
                        onChange={handleChange}
                        placeholder="Personal, Family, etc."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ py: 1.5 }}
                      >
                        Add Transaction
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Expense List */}
          <Grid item xs={12} lg={7}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
                  📋 Transaction History
                </Typography>
                
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : expenses.length === 0 ? (
                  <Typography textAlign="center" color="text.secondary" py={4}>
                    No transactions found
                  </Typography>
                ) : (
                  <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 500 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[...expenses]
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((exp) => (
                            <TableRow key={exp._id} hover>
                              <TableCell>
                                <Chip
                                  label={exp.type === "spent" ? "Spent" : "Received"}
                                  color={exp.type === "spent" ? "error" : "success"}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                ₹{exp.amount}
                              </TableCell>
                              <TableCell sx={{ textTransform: "capitalize" }}>
                                {exp.category}
                              </TableCell>
                              <TableCell>
                                {exp.date?.split("T")[0]}
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  color="error"
                                  onClick={() => deleteExpense(exp._id)}
                                  size="small"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;