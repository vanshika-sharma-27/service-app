const express = require("express");
const router = express.Router();

const {
  createBarber,
  getBarbers,
  updateBarber,
  deleteBarber
} = require("../controllers/barberController");

const {
  authMiddleware,
  ownerOnly
} = require("../middleware/authMiddleware");

// ================= PUBLIC =================
router.get("/", getBarbers);

// ================= OWNER ONLY =================
router.post(
  "/",
  authMiddleware,
  ownerOnly,
  createBarber
);

router.put(
  "/:id",
  authMiddleware,
  ownerOnly,
  updateBarber
);

router.delete(
  "/:id",
  authMiddleware,
  ownerOnly,
  deleteBarber
);

module.exports = router;