require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const connectDB = require("./config/db");
connectDB();

app.use(cors());
app.use(express.json());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const shopRoutes = require("./routes/shopRoutes");
app.use("/api/shop", shopRoutes);

// AUTH ROUTES
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// SERVICE ROUTES (FIXED)
const serviceRoutes = require("./routes/serviceRoutes");
app.use("/api/services", serviceRoutes);

//barber connect routes

const barberRoutes = require("./routes/barberRoutes");
app.use("/api/barbers", barberRoutes);

//booking route
const bookingRoutes = require("./routes/bookingRoutes");

app.use("/api/bookings", bookingRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});