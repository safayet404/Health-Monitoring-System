const mongoose = require("mongoose");

const healthSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true, // Make sure this field is always provided
  },
  email: {
    type: String,
    required: true, // Make sure this field is always provided
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
    default: [] // Raw Pulse Signal (for visualization or analysis)
  },
  timestamp: {
    type: Date,
    default: Date.now, // Timestamp for when the data was recorded
  },
});

module.exports = mongoose.model("Health", healthSchema);
