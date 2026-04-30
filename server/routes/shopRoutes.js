const express = require("express");
const router = express.Router();
const Shop = require("../models/Shop");

// CORRECT IMPORTS
const { authMiddleware } = require("../middleware/authMiddleware");
const ownerMiddleware = require("../middleware/ownerMiddleware");

// CONTROLLERS
const {
  createOrUpdateShop,
  getOwnerShop,
  getPublicShop
} = require("../controllers/shopController");

const {
  getOwnerBookings
} = require("../controllers/bookingController");

// ================= OWNER ONLY ROUTES =================

// Create or update shop profile
router.put(
  "/update",
  authMiddleware,
  ownerMiddleware,
  createOrUpdateShop
);

// Get logged-in owner shop profile
router.get(
  "/me",
  authMiddleware,
  ownerMiddleware,
  getOwnerShop
);

// Get owner dashboard bookings
router.get(
  "/owner-bookings",
  authMiddleware,
  ownerMiddleware,
  getOwnerBookings
);

// ================= PUBLIC ROUTES =================

// Public shop details
router.get(
  "/public",
  getPublicShop
);

module.exports = router;