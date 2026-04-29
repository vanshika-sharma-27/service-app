const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Barber = require("../models/Barber");

// ================= TIME HELPER =================
const calculateEndTime = (startTime, duration) => {
  return Number(startTime) + Number(duration);
};

// ================= SLOT CHECK =================
const isSlotAvailable = async (
  barberId,
  date,
  start,
  endTime,
  excludeBookingId = null
) => {
  const existingBookings = await Booking.find({
    barberId,
    date,
    status: { $ne: "cancelled" }
  });

  for (const booking of existingBookings) {
    if (
      excludeBookingId &&
      booking._id.toString() === excludeBookingId.toString()
    ) {
      continue;
    }

    if (
      start < booking.endTime &&
      endTime > booking.startTime
    ) {
      return false;
    }
  }

  return true;
};

// ================= CREATE BOOKING =================
exports.createBooking = async (req, res) => {
  try {
    let {
      barberId,
      serviceId,
      shopId,
      date,
      startTime,
      customerName,
      customerPhone,
      notes,
      totalAmount,

      // FRONTEND COMPATIBILITY
      barber,
      service,
      time,
      phone
    } = req.body;

    // ================= FRONTEND FIELD MAPPING =================
    barberId = barberId || barber;
    serviceId = serviceId || service;
    customerPhone = customerPhone || phone;
    startTime = startTime || time;

    // Convert HH:mm to numeric minutes
    if (typeof startTime === "string" && startTime.includes(":")) {
      const [hours, minutes] = startTime.split(":");
      startTime =
        Number(hours) * 60 + Number(minutes);
    }

    // ================= VALIDATION =================
    if (
      !barberId ||
      !serviceId ||
      !date ||
      startTime === undefined ||
      !customerName ||
      !customerPhone
    ) {
      return res.status(400).json({
        msg: "All required fields must be filled"
      });
    }

    // ================= FETCH SERVICE =================
    const serviceData = await Service.findById(serviceId);

    if (!serviceData) {
      return res.status(404).json({
        msg: "Service not found"
      });
    }

    // ================= FETCH BARBER =================
    const barberData = await Barber.findById(barberId);

    if (!barberData) {
      return res.status(404).json({
        msg: "Barber not found"
      });
    }

    const start = Number(startTime);

    const endTime = calculateEndTime(
      start,
      serviceData.duration
    );

    // ================= SLOT CHECK =================
    const slotAvailable = await isSlotAvailable(
      barberId,
      date,
      start,
      endTime
    );

    if (!slotAvailable) {
      return res.status(400).json({
        msg: "Selected slot not available"
      });
    }

    // ================= CREATE =================
    const newBooking = new Booking({
      userId: req.user.id,
      barberId,
      serviceId,
      shopId: shopId || null,
      customerName,
      customerPhone,
      notes: notes || "",
      date,
      startTime: start,
      endTime,
      totalAmount:
        totalAmount || serviceData.price,
      status: "pending"
    });

    await newBooking.save();

    const populatedBooking =
      await Booking.findById(newBooking._id)
        .populate("userId", "name email")
        .populate(
          "barberId",
          "name specialization"
        )
        .populate(
          "serviceId",
          "name price duration category"
        );

    res.status(201).json({
      msg: "Booking created successfully",
      booking: populatedBooking
    });

  } catch (err) {
    console.log(
      "CREATE BOOKING ERROR:",
      err
    );

    res.status(500).json({
      msg: "Server Error"
    });
  }
};

// ================= USER BOOKINGS =================
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.id
    })
      .populate(
        "barberId",
        "name specialization"
      )
      .populate(
        "serviceId",
        "name price duration category"
      )
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    console.log(
      "GET USER BOOKINGS ERROR:",
      err
    );

    res.status(500).json({
      msg: "Server Error"
    });
  }
};

// ================= OWNER BOOKINGS =================
exports.getOwnerBookings = async (req, res) => {
  try {
    const ownerBarbers = await Barber.find({
      ownerId: req.user.id
    });

    const barberIds = ownerBarbers.map(
      (barber) => barber._id
    );

    const bookings = await Booking.find({
      barberId: { $in: barberIds }
    })
      .populate("userId", "name email")
      .populate(
        "barberId",
        "name specialization"
      )
      .populate(
        "serviceId",
        "name price duration"
      )
      .sort({
        date: 1,
        startTime: 1
      });

    res.json(bookings);

  } catch (err) {
    console.log(
      "GET OWNER BOOKINGS ERROR:",
      err
    );

    res.status(500).json({
      msg: "Server Error"
    });
  }
};

// ================= ALL BOOKINGS =================
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("barberId", "name")
      .populate("serviceId", "name")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    console.log(
      "GET ALL BOOKINGS ERROR:",
      err
    );

    res.status(500).json({
      msg: "Server Error"
    });
  }
};

// ================= CANCEL =================
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        msg: "Booking not found"
      });
    }

    booking.status = "cancelled";

    await booking.save();

    res.json({
      msg: "Booking cancelled successfully"
    });

  } catch (err) {
    console.log(
      "CANCEL BOOKING ERROR:",
      err
    );

    res.status(500).json({
      msg: "Server Error"
    });
  }
};

// ================= DELETE =================
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        msg: "Booking not found"
      });
    }

    await booking.deleteOne();

    res.json({
      msg: "Booking deleted successfully"
    });

  } catch (err) {
    console.log(
      "DELETE BOOKING ERROR:",
      err
    );

    res.status(500).json({
      msg: "Server Error"
    });
  }
};

// ================= RESCHEDULE =================
exports.rescheduleBooking = async (req, res) => {
  try {
    const { date, startTime } = req.body;

    if (!date || startTime === undefined) {
      return res.status(400).json({
        msg: "Date and startTime required"
      });
    }

    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        msg: "Booking not found"
      });
    }

    const serviceData = await Service.findById(
      booking.serviceId
    );

    if (!serviceData) {
      return res.status(404).json({
        msg: "Service not found"
      });
    }

    const start = Number(startTime);

    const endTime = calculateEndTime(
      start,
      serviceData.duration
    );

    const slotAvailable =
      await isSlotAvailable(
        booking.barberId,
        date,
        start,
        endTime,
        booking._id
      );

    if (!slotAvailable) {
      return res.status(400).json({
        msg: "Selected slot not available"
      });
    }

    booking.date = date;
    booking.startTime = start;
    booking.endTime = endTime;
    booking.status = "pending";

    await booking.save();

    res.json({
      msg: "Booking rescheduled successfully",
      booking
    });

  } catch (err) {
    console.log(
      "RESCHEDULE BOOKING ERROR:",
      err
    );

    res.status(500).json({
      msg: "Server Error"
    });
  }
};

// ================= STATUS UPDATE =================
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "completed",
      "cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        msg: "Invalid status"
      });
    }

    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        msg: "Booking not found"
      });
    }

    booking.status = status;

    await booking.save();

    res.json({
      msg: `Booking marked as ${status}`,
      booking
    });

  } catch (err) {
    console.log(
      "UPDATE STATUS ERROR:",
      err
    );

    res.status(500).json({
      msg: "Server Error"
    });
  }
};