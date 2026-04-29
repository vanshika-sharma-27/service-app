const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // ================= CUSTOMER =================
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    customerName: {
      type: String,
      required: true,
      trim: true
    },

    customerPhone: {
      type: String,
      required: true,
      trim: true
    },

    customerEmail: {
      type: String,
      default: "",
      trim: true
    },

    // ================= BOOKING DETAILS =================
    barberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barber",
      required: true
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },

    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop"
    },

    date: {
      type: Date,
      required: true
    },

    startTime: {
      type: Number,
      required: true
    },

    endTime: {
      type: Number,
      required: true
    },

    // ================= STATUS =================
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "booked",
        "completed",
        "cancelled",
        "no-show"
      ],
      default: "pending"
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded"
      ],
      default: "pending"
    },

    paymentMethod: {
      type: String,
      default: "cash"
    },

    // ================= EXTRA INFO =================
    notes: {
      type: String,
      default: "",
      trim: true
    },

    bookingSource: {
      type: String,
      enum: ["website", "walk-in", "phone", "admin"],
      default: "website"
    },

    totalAmount: {
      type: Number,
      default: 0
    },

    // ================= CUSTOMER TYPE =================
    isRegularCustomer: {
      type: Boolean,
      default: false
    },

    visitCount: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Booking", bookingSchema);