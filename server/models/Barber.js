const mongoose = require("mongoose");

const barberSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  specialty: {
    type: String,
    default: ""
  },

  experience: {
    type: String,
    default: ""
  },

  image: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("Barber", barberSchema);