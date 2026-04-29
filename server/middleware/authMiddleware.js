// FILE: middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

// ================= VERIFY TOKEN =================
const authMiddleware = (req, res, next) => {
  try {
    // ================= GET AUTH HEADER =================
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        msg: "Access denied. No token provided."
      });
    }

    // ================= FORMAT CHECK =================
    // Expected: Bearer token
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        msg: "Invalid token format."
      });
    }

    // ================= EXTRACT TOKEN =================
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        msg: "Token missing."
      });
    }

    // ================= VERIFY TOKEN =================
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // decoded contains:
    // id
    // role
    req.user = decoded;

    next();

  } catch (err) {
    console.error("JWT ERROR:", err.message);

    return res.status(401).json({
      msg: "Invalid or expired token."
    });
  }
};

// ================= OWNER ONLY =================
const ownerOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        msg: "Unauthorized access."
      });
    }

    if (req.user.role !== "owner") {
      return res.status(403).json({
        msg: "This account is not authorized as owner."
      });
    }

    next();

  } catch (err) {
    console.error("OWNER AUTH ERROR:", err.message);

    return res.status(500).json({
      msg: "Authorization failed."
    });
  }
};

module.exports = {
  authMiddleware,
  ownerOnly
};