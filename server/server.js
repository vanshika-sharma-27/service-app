require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// ================= DATABASE =================
const connectDB = require("./config/db");
connectDB();

// ================= CORS CONFIG =================
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
  })
);

// ================= BODY PARSER =================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ================= ROUTES =================

// Shop Routes
const shopRoutes = require("./routes/shopRoutes");
app.use("/api/shop", shopRoutes);

// Auth Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Service Routes
const serviceRoutes = require("./routes/serviceRoutes");
app.use("/api/services", serviceRoutes);

// Barber Routes
const barberRoutes = require("./routes/barberRoutes");
app.use("/api/barbers", barberRoutes);

// Booking Routes
const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.status(200).send("API Running Successfully");
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});