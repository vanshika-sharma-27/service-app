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
      regularCustomers
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
          "Shop name, phone, whatsapp, email, address, opening time, sundayHours and closing time are required"
      });
    }

    let shop = await Shop.findOne({
      ownerId: req.user.id
    });

    // ================= UPDATE EXISTING SHOP =================
    if (shop) {
      shop.shopName = shopName;
      shop.ownerName = ownerName || "";
      shop.phone = phone;
      shop.whatsapp = whatsapp;
      shop.email = email;
      shop.address = address;
      shop.openingTime = openingTime;
      shop.closingTime = closingTime;
      shop.sundayHours = sundayHours;
      shop.description = description || "";
      shop.logo = logo || "";
      shop.bannerImage = bannerImage || "";
      shop.mapLink = mapLink || "";
      shop.experienceYears = Number(experienceYears) || 0;
      shop.averageDailyCustomers = Number(averageDailyCustomers) || 0;
      shop.regularCustomers = Number(regularCustomers) || 0;

      await shop.save();

    } else {
      // ================= CREATE NEW SHOP =================
      shop = new Shop({
        ownerId: req.user.id,
        shopName,
        ownerName: ownerName || "",
        phone,
        whatsapp,
        email,
        address,
        openingTime,
        closingTime,
        sundayHours,
        description: description || "",
        logo: logo || "",
        bannerImage: bannerImage || "",
        mapLink: mapLink || "",
        experienceYears: Number(experienceYears) || 0,
        averageDailyCustomers: Number(averageDailyCustomers) || 0,
        regularCustomers: Number(regularCustomers) || 0
      });

      await shop.save();
    }

    res.status(200).json({
      msg: "Shop profile saved successfully",
      shop
    });

  } catch (err) {
    console.log("SHOP PROFILE ERROR:", err);

    res.status(500).json({
      msg: "Server Error"
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
      msg: "Server Error"
    });
  }
};

// ================= PUBLIC SHOP VIEW =================
exports.getPublicShop = async (req, res) => {
  try {
    const ownerId = req.query.ownerId;

    if (!ownerId) {
      return res.status(400).json({
        msg: "Owner ID is required"
      });
    }

    const shop = await Shop.findOne({
      ownerId
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
      msg: "Server Error"
    });
  }
};

// ================= GET ALL SHOPS =================
exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate(
      "ownerId",
      "name email"
    );

    res.status(200).json(shops);

  } catch (err) {
    console.log("GET ALL SHOPS ERROR:", err);

    res.status(500).json({
      msg: "Server Error"
    });
  }
};