function evaluateHealthStatus(data) {
  const {
    bloodPressure,
    oxygenLevel,
    pulseRate,
    respirationRate,
    heartRateVariability,
    perfusionIndex,
    spo2,
    temperature
  } = data;

  let healthStatus = "well"; // Default assumption
  const notWellReasons = []; // Array to hold reasons for not well status

  // Define conditions to check for "not well" status
  if (bloodPressure < 90) {
    notWellReasons.push("Low blood pressure");
  } else if (bloodPressure > 140) {
    // Changed from 120 to 140
    notWellReasons.push("High blood pressure");
  }

  if (oxygenLevel < 92) {
    // Changed from 90 to 92
    notWellReasons.push("Low oxygen level");
  }

  if (pulseRate < 60 || pulseRate > 100) {
    // Combined condition for low and high pulse rate
    notWellReasons.push("Pulse rate out of normal range");
  }

  if (respirationRate < 12 || respirationRate > 20) {
    // Combined condition for low and high respiration rate
    notWellReasons.push("Respiration rate out of normal range");
  }

  if (heartRateVariability < 20) {
    // Changed from 5 to 20
    notWellReasons.push("Low heart rate variability");
  } else if (heartRateVariability < 40) {
    notWellReasons.push("Hight heart rate variability");
  }

  if (perfusionIndex < 2) {
    notWellReasons.push("Low perfusion index");
  }

  if (spo2 < 92) {
    // Changed from 92 to 92 for consistency
    notWellReasons.push("Low SpO2 levels");
  }

  // Add temperature condition
  if (temperature < 97) {
    notWellReasons.push("Low body temperature");
  } else if (temperature > 99) {
    notWellReasons.push("High body temperature");
  }
  // Set healthStatus and notWellReasons in the data object
  data.healthStatus = notWellReasons.length > 0 ? "Not well" : "Well";
  data.notWellReasons = notWellReasons; // Add the reasons for not being well
}

module.exports = { evaluateHealthStatus };
