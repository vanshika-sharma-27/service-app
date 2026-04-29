// FILE: server/middleware/roleMiddleware.js

module.exports = function (allowedRoles = []) {
  return (req, res, next) => {
    
    // ================= USER EXISTS =================
    if (!req.user) {
      return res.status(401).json({
        msg: "Unauthorized"
      });
    }

    // ================= ROLE CHECK =================
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        msg: "Access denied"
      });
    }

    next();
  };
};