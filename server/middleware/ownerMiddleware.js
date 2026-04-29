module.exports = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        msg: "Unauthorized"
      });
    }

    if (req.user.role !== "owner") {
      return res.status(403).json({
        msg: "Access denied. Owner only."
      });
    }

    next();

  } catch (err) {
    console.log("OWNER MIDDLEWARE ERROR:", err);

    res.status(500).json({
      msg: "Server Error"
    });
  }
};