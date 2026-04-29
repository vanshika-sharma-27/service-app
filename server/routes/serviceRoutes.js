// routes/serviceRoutes.js

const express = require("express");
const router = express.Router();

// ================= CONTROLLERS =================
const serviceController = require("../controllers/serviceController");

// ================= MIDDLEWARE =================
const {
  authMiddleware,
  ownerOnly
} = require("../middleware/authMiddleware");

// ================= DEBUG CHECK =================
console.log("SERVICE CONTROLLER CHECK:", {
  createService: typeof serviceController.createService,
  getServices: typeof serviceController.getServices,
  getOwnerServices: typeof serviceController.getOwnerServices,
  updateService: typeof serviceController.updateService,
  deleteService: typeof serviceController.deleteService
});

// ======================================================
// OWNER ROUTES
// ======================================================

// Create new service
router.post(
  "/",
  authMiddleware,
  ownerOnly,
  serviceController.createService
);

// Get logged-in owner's services
router.get(
  "/owner",
  authMiddleware,
  ownerOnly,
  serviceController.getOwnerServices
);

// Update service
router.put(
  "/:id",
  authMiddleware,
  ownerOnly,
  serviceController.updateService
);

// Delete service
router.delete(
  "/:id",
  authMiddleware,
  ownerOnly,
  serviceController.deleteService
);

// ======================================================
// PUBLIC ROUTE
// ======================================================

// Get all services for users
router.get(
  "/",
  serviceController.getServices
);

module.exports = router;