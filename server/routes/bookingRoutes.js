const express = require("express");
const router = express.Router();

const {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking,
  rescheduleBooking,
  getOwnerBookings,
  deleteBooking,
  updateBookingStatus
} = require("../controllers/bookingController");

const { authMiddleware, ownerOnly } = require("../middleware/authMiddleware");

// ================= DEBUG CHECK =================
console.log("BOOKING CONTROLLER CHECK:", {
  createBooking: typeof createBooking,
  getUserBookings: typeof getUserBookings,
  getAllBookings: typeof getAllBookings,
  cancelBooking: typeof cancelBooking,
  rescheduleBooking: typeof rescheduleBooking,
  getOwnerBookings: typeof getOwnerBookings,
  deleteBooking: typeof deleteBooking,
  updateBookingStatus: typeof updateBookingStatus
});

// ================= USER ROUTES =================

// Create booking
router.post(
  "/",
  authMiddleware,
  createBooking
);

// User bookings
router.get(
  "/my-bookings",
  authMiddleware,
  getUserBookings
);

// Cancel booking
router.put(
  "/cancel/:id",
  authMiddleware,
  cancelBooking
);

// Reschedule booking
router.put(
  "/reschedule/:id",
  authMiddleware,
  rescheduleBooking
);

// ================= OWNER ROUTES =================

// All bookings
router.get(
  "/",
  authMiddleware,
  ownerOnly,
  getAllBookings
);

// Owner dashboard bookings
router.get(
  "/owner",
  authMiddleware,
  ownerOnly,
  getOwnerBookings
);

// Update booking status
router.put(
  "/status/:id",
  authMiddleware,
  ownerOnly,
  updateBookingStatus
);

// Delete booking
router.delete(
  "/:id",
  authMiddleware,
  ownerOnly,
  deleteBooking
);

module.exports = router;