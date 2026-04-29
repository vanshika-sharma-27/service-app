const Service = require("../models/Service");

// ================= CREATE =================
exports.createService = async (req, res) => {
  try {
    const { name, price, duration, description, category } = req.body;

    if (!name || !price || !duration) {
      return res.status(400).json({
        msg: "Name, price, and duration are required"
      });
    }

    const newService = new Service({
      ownerId: req.user.id,
      name,
      price,
      duration,
      description: description || "",
      category: category || "General"
    });

    await newService.save();

    res.status(201).json({
      msg: "Service created successfully",
      service: newService
    });

  } catch (err) {
    console.log("CREATE SERVICE ERROR:", err);

    res.status(500).json({
      msg: "Server Error"
    });
  }
};



// ================= ADD THIS TO serviceController.js =================

// ================= GET OWNER SERVICES =================
exports.getOwnerServices = async (req, res) => {
  try {
    const services = await Service.find({
      ownerId: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json(services);

  } catch (err) {
    console.log("GET OWNER SERVICES ERROR:", err);

    res.status(500).json({
      msg: "Server Error"
    });
  }
};
// ================= GET ALL PUBLIC SERVICES =================
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("ownerId", "name shopName")
      .sort({ createdAt: -1 });

    res.status(200).json(services);

  } catch (err) {
    console.log("GET SERVICES ERROR:", err);

    res.status(500).json({
      msg: "Server Error"
    });
  }
};

// ================= UPDATE =================
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        msg: "Service not found"
      });
    }

    if (service.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        msg: "Unauthorized"
      });
    }

    Object.assign(service, req.body);

    await service.save();

    res.json({
      msg: "Service updated successfully",
      service
    });

  } catch (err) {
    console.log("UPDATE SERVICE ERROR:", err);

    res.status(500).json({
      msg: "Server Error"
    });
  }
};

// ================= DELETE =================
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        msg: "Service not found"
      });
    }

    if (service.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        msg: "Unauthorized"
      });
    }

    await service.deleteOne();

    res.json({
      msg: "Service deleted successfully"
    });

  } catch (err) {
    console.log("DELETE SERVICE ERROR:", err);

    res.status(500).json({
      msg: "Server Error"
    });
  }
};