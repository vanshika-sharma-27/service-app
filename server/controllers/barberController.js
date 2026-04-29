const Barber = require("../models/Barber");

// ================= CREATE BARBER =================
exports.createBarber = async (req, res) => {
  try {
    const {
      name,
      phone,
      specialty,
      specialization,
      experience,
      image
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        msg: "Name and phone are required"
      });
    }

    const barber = new Barber({
      ownerId: req.user.id,
      name: name.trim(),
      phone: phone.trim(),
      specialty:
        specialty ||
        specialization ||
        "",
      specialization:
        specialization ||
        specialty ||
        "",
      experience:
        Number(experience) || 0,
      image: image || ""
    });

    await barber.save();

    res.status(201).json({
      msg: "Barber added successfully",
      barber
    });

  } catch (err) {
    console.log(
      "CREATE BARBER ERROR:",
      err
    );

    res.status(500).json({
      msg: "Server Error"
    });
  }
};

// ================= GET ALL BARBERS (PUBLIC + DYNAMIC) =================
exports.getBarbers = async (req, res) => {
  try {
    const { ownerId } = req.query;

    let query = {};

    // Optional owner filtering
    if (ownerId) {
      query.ownerId = ownerId;
    }

    const barbers = await Barber.find(query)
      .populate(
        "ownerId",
        "name email role"
      )
      .sort({ createdAt: -1 });

    res.status(200).json(barbers);

  } catch (err) {
    console.log(
      "GET BARBERS ERROR:",
      err
    );

    res.status(500).json({
      msg: "Server Error"
    });
  }
};

// ================= GET OWNER BARBERS =================
exports.getOwnerBarbers = async (
  req,
  res
) => {
  try {
    const barbers = await Barber.find({
      ownerId: req.user.id
    }).sort({
      createdAt: -1
    });

    res.status(200).json(barbers);

  } catch (err) {
    console.log(
      "GET OWNER BARBERS ERROR:",
      err
    );

    res.status(500).json({
      msg: "Server Error"
    });
  }
};

// ================= UPDATE BARBER =================
exports.updateBarber = async (req, res) => {
  try {
    const barber = await Barber.findById(
      req.params.id
    );

    if (!barber) {
      return res.status(404).json({
        msg: "Barber not found"
      });
    }

    if (
      barber.ownerId.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        msg: "Unauthorized"
      });
    }

    barber.name =
      req.body.name?.trim() ||
      barber.name;

    barber.phone =
      req.body.phone?.trim() ||
      barber.phone;

    barber.specialty =
      req.body.specialty ||
      req.body.specialization ||
      barber.specialty;

    barber.specialization =
      req.body.specialization ||
      req.body.specialty ||
      barber.specialization;

    barber.experience =
      Number(req.body.experience) ||
      barber.experience;

    
    await barber.save();

    res.status(200).json({
      msg: "Barber updated successfully",
      barber
    });

  } catch (err) {
    console.log(
      "UPDATE BARBER ERROR:",
      err
    );

    res.status(500).json({
      msg: "Server Error"
    });
  }
};

// ================= DELETE BARBER =================
exports.deleteBarber = async (req, res) => {
  try {
    const barber = await Barber.findById(
      req.params.id
    );

    if (!barber) {
      return res.status(404).json({
        msg: "Barber not found"
      });
    }

    if (
      barber.ownerId.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        msg: "Unauthorized"
      });
    }

    await barber.deleteOne();

    res.status(200).json({
      msg: "Barber deleted successfully"
    });

  } catch (err) {
    console.log(
      "DELETE BARBER ERROR:",
      err
    );

    res.status(500).json({
      msg: "Server Error"
    });
  }
};