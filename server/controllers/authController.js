const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= TOKEN GENERATOR =================
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );
};

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      ownerSecretKey
    } = req.body;

    // ================= VALIDATION =================
    if (!name || !email || !password) {
      return res.status(400).json({
        msg: "Name, email, and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        msg: "Password must be at least 6 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ================= CHECK EXISTING USER =================
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists"
      });
    }

    // ================= ROLE LOGIC =================
    let finalRole = "user";

    if (role === "owner") {
      if (
        !ownerSecretKey ||
        ownerSecretKey !== process.env.OWNER_SECRET_KEY
      ) {
        return res.status(403).json({
          msg: "Invalid owner secret key"
        });
      }

      finalRole = "owner";
    }

    // ================= HASH PASSWORD =================
    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // ================= CREATE USER =================
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: finalRole
    });

    await user.save();

    // ================= TOKEN =================
    const token = generateToken(user);

    return res.status(201).json({
      msg:
        finalRole === "owner"
          ? "Owner registered successfully"
          : "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return res.status(500).json({
      msg: "Server Error"
    });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ================= VALIDATION =================
    if (!email || !password) {
      return res.status(400).json({
        msg: "Email and password are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ================= FIND USER =================
    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid email or password"
      });
    }

    // ================= PASSWORD CHECK =================
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid email or password"
      });
    }

    // ================= TOKEN =================
    const token = generateToken(user);

    return res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(500).json({
      msg: "Server Error"
    });
  }
};

// ================= GOOGLE LOGIN =================
exports.googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({
        msg: "Email required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let user = await User.findOne({
      email: normalizedEmail
    });

    // ================= CREATE NEW GOOGLE USER =================
    if (!user) {
      const hashedPassword = await bcrypt.hash(
        "google_auth_secure",
        12
      );

      user = new User({
        name: name?.trim() || "Google User",
        email: normalizedEmail,
        password: hashedPassword,
        role: "user"
      });

      await user.save();
    }

    // ================= OWNER SECURITY =================
    if (user.role === "owner") {
      return res.status(403).json({
        msg: "Owner accounts cannot login via Google"
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      msg: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("GOOGLE LOGIN ERROR:", err);

    return res.status(500).json({
      msg: "Server Error"
    });
  }
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        msg: "Email is required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(404).json({
        msg: "User not found"
      });
    }

    return res.status(200).json({
      msg:
        "Password reset request received. Implement nodemailer reset system."
    });

  } catch (err) {
    console.error(
      "FORGOT PASSWORD ERROR:",
      err
    );

    return res.status(500).json({
      msg: "Server Error"
    });
  }
};