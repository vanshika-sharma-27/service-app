// FILE: models/Shop.js
// Replace your full Shop model with this exact version

const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    shopName: {
      type: String,
      required: true,
      trim: true
    },

    ownerName: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    whatsapp: {
      type: String,
      default: ""
    },

    email: {
      type: String,
      required: true,
      trim: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    openingTime: {
      type: String,
      default: ""
    },

    closingTime: {
      type: String,
      default: ""
    },

    sundayHours: {
      type: String,
      default: ""
    },

    description: {
      type: String,
      default: ""
    },

    logo: {
      type: String,
      default: ""
    },

    mapLink: {
      type: String,
      default: ""
    },

    experienceYears: {
      type: Number,
      default: 0
    },

    averageDailyCustomers: {
      type: Number,
      default: 0
    },

    regularCustomers: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Shop", shopSchema);