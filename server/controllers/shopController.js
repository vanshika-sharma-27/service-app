const Shop = require("../models/Shop");

// ================= CREATE OR UPDATE SHOP PROFILE =================
exports.createOrUpdateShop = async (req, res) => {
  try {
    const {
      shopName,
      ownerName,
      phone,
      whatsapp,
      email,
      address,
      openingTime,
      closingTime,
      sundayHours,
      description,
      logo,
      bannerImage,
      mapLink,
      experienceYears,
      averageDailyCustomers,
      regularCustomers,
      services
    } = req.body;

    // ================= VALIDATION =================
    if (
      !shopName ||
      !phone ||
      !email ||
      !address ||
      !openingTime ||
      !closingTime
    ) {
      return res.status(400).json({
        msg:
          "Shop name, phone, email, address, opening time and closing time are required"
      });
    }

    // ================= SINGLE OWNER PERMANENT PROFILE =================
    const shop = await Shop.findOneAndUpdate(
      {
        ownerId: req.user.id
      },
      {
        ownerId: req.user.id,

        shopName,
        ownerName: ownerName || "",
        phone,
        whatsapp: whatsapp || "",
        email,
        address,

        openingTime,
        closingTime,
        sundayHours: sundayHours || "",

        description: description || "",

        logo: logo || "",
        bannerImage: bannerImage || "",
        mapLink: mapLink || "",

        experienceYears: Number(experienceYears) || 0,
        averageDailyCustomers:
          Number(averageDailyCustomers) || 0,
        regularCustomers:
          Number(regularCustomers) || 0,

        services: Array.isArray(services)
          ? services
          : []
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      msg: "Shop profile saved successfully",
      shop
    });

  } catch (err) {
    console.log("SHOP PROFILE ERROR:", err);

    res.status(500).json({
      msg: "Server Error",
      error: err.message
    });
  }
};

// ================= GET LOGGED-IN OWNER SHOP =================
exports.getOwnerShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({
      ownerId: req.user.id
    });

    if (!shop) {
      return res.status(404).json({
        msg: "Shop not found"
      });
    }

    res.status(200).json(shop);

  } catch (err) {
    console.log("GET OWNER SHOP ERROR:", err);

    res.status(500).json({
      msg: "Server Error",
      error: err.message
    });
  }
};

// ================= PUBLIC SHOP VIEW =================
exports.getPublicShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({
      isActive: true
    });

    if (!shop) {
      return res.status(404).json({
        msg: "Shop not found"
      });
    }

    res.status(200).json(shop);

  } catch (err) {
    console.log("PUBLIC SHOP FETCH ERROR:", err);

    res.status(500).json({
      msg: "Server Error",
      error: err.message
    });
  }
};

// ================= GET ALL SHOPS =================
exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find({
      isActive: true
    }).populate("ownerId", "name email");

    res.status(200).json(shops);

  } catch (err) {
    console.log("GET ALL SHOPS ERROR:", err);

    res.status(500).json({
      msg: "Server Error",
      error: err.message
    });
  }
};