const mongoose = require("mongoose");

const healthSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true, // Ensure this field is always provided
  },
  deviceEmail: {
    type: String,
    required: true, // Ensure this field is always provided
  },
  temperature: {
    type: Number,
    default: 98.6, // Default body temperature in Fahrenheit
  },
  spo2: {
    type: Number,
    default: 95, // Oxygen Saturation (SpO₂) in percentage
  },
  pulseRate: {
    type: Number,
    default: 75, // Pulse Rate (Heart Rate) in beats per minute (BPM)
  },
  rawPulseSignal: {
    type: [Number],
    default: [], // Raw Pulse Signal (for visualization or analysis)
  },
  bloodPressure: {
    type: String, // Example format: "120/80"
    required: false, // Optional field, can be provided when available
  },
  oxygenLevel: {
    type: Number, // Oxygen level in percentage, example: 98
    required: false, // Optional field
  },
  hospitalId: {
    type: String,
    default: "defaultHospitalId", // Set the default value here
  },

  timestamp: {
    type: Date,
    default: Date.now, // Timestamp for when the data was recorded
  },
});

module.exports = mongoose.model("Health", healthSchema);
