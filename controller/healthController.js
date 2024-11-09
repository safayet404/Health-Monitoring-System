const asyncHandler = require("express-async-handler");
const Health = require("../model/healthModel");
const { evaluateHealthStatus } = require("../utils/HealthUtils");

const createHealthData = asyncHandler(async (req, res) => {
  try {
    const healthData = await Health.create(req.body);
    res.json(healthData);
  } catch (error) {
    throw new Error(error);
  }
});

const getHealthData = asyncHandler(async (req, res) => {
  try {
    const result = await Health.aggregate([
      {
        $group: {
          _id: "$userId", // Group by patient_id
          healthEntries: { $push: "$$ROOT" }, // Push the whole document into an array
        },
      },
      {
        $project: {
          userId: "$_id", // Rename _id to patient_id
          healthEntries: 1, // Include the healthEntries array
          _id: 0, // Exclude the default _id field
        },
      },
    ]);

    // Evaluate health status for each user's health entries
    result.forEach((user) => {
      user.healthEntries.forEach((entry) => {
        evaluateHealthStatus(entry); // Evaluate the health status for each entry
      });
    });
    res.json(result); // Respond with the aggregated data including evaluations
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // Handle errors
  }
});

const getSingleHealthData = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const singleData = await Health.findById(id);
    res.json(singleData);
  } catch (error) {
    throw new Error(error);
  }
});

const getHealthDataByUserId = asyncHandler(async (req, res) => {
  try {
    const { email } = req.params; // Extract userId from the request parameters

    // Query the latest health data by userId, assuming you have a `timestamp` field
    const healthData = await Health.find({ deviceEmail: email }) // Filter by userId
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order (latest first)
      .limit(1); // Only get the most recent record

      console.log('====> ',healthData)
      // Check if any data was found
    if (!healthData || healthData.length === 0) {
      return res
        .status(200)
        .json({ message: "No health data found for this patient." });
    }

    console.log('====> ',healthData)
    // Return the found health data (latest one)
    res.status(200).json(healthData[0]); // Send only the first entry (latest data)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const getHealthRecordsByUserId = asyncHandler(async (req, res) => {
  try {
    const { email } = req.params;
    const { period } = req.query; // Add a query parameter for the period filter

    // Determine the date range based on the period filter
    let startDate;
    const currentDate = new Date();

    if (period === "7days") {
      startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
    } else if (period === "1months") {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    } else if (period === "2months") {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 2));
    } else if (period === "3months") {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
    } else if (period === "6months") {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
    }

    // Aggregate health data based on userId and within the specified date range
    const healthData = await Health.aggregate([
      {
        $match: {
          deviceEmail: email,
          ...(startDate && { timestamp: { $gte: startDate } }), // Filter by date if startDate is defined
        },
      },
      {
        $sort: { timestamp: -1 }, // Sort records by timestamp in descending order
      },
      {
        $group: {
          _id: null, // Grouping without an id to return a single document
          temperature: { $push: "$temperature" },
          bloodPressure: { $push: "$bloodPressure" },
          oxygenLevel: { $push: "$oxygenLevel" },
          // heartRateVariability: {
          //   $push: "$pulseOximeter.heartRateVariability",
          // },
          pulseRate: { $push: "$pulseRate" },
          // respirationRate: { $push: "$pulseOximeter.respirationRate" },
          spo2: { $push: "$spo2" },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id from the result
        },
      },
    ]);

    // If no data was found, return a message
    if (!healthData || healthData.length === 0) {
      return res
        .status(200)
        .json({ message: "No health data found for this patient." });
    }

    // Assuming healthData[0] now contains the arrays directly
    const responseData = healthData[0];

    // Return the health data properties with their respective arrays
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getHealthConditionByUserId = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { period } = req.query;

    // Determine the date range based on the period filter
    let startDate;
    const currentDate = new Date();

    // Handle periods
    switch (period) {
      case "7days":
        startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
        break;
      case "1month":
        startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        break;
      case "2months":
        startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 2));
        break;
      case "3months":
        startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
        break;
      case "6months":
        startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
        break;
      default:
        return res.status(400).json({ message: "Invalid period parameter." });
    }

    // Fetch health data
    const healthData = await Health.find({
      userId: userId,
      ...(startDate && { timestamp: { $gte: startDate } }),
    }).sort({ timestamp: -1 });

    // If no data found
    if (!healthData || healthData.length === 0) {
      return res
        .status(200)
        .json({ message: "No health data found for this user." });
    }

    // Process health data
    const healthConditions = healthData.map((record) => {
      evaluateHealthStatus(record); // Assuming this modifies the record
      return {
        timestamp: record.timestamp,
        healthStatus: record.healthStatus,
        notWellReasons: record.notWellReasons,
      };
    });
    return res.status(200).json(healthConditions);
  } catch (error) {
    console.error("Error fetching health conditions:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

const updateHealthData = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = await Health.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateData);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteHealthData = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteData = await Health.findByIdAndDelete(id);
    res.json(deleteData);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createHealthData,
  getHealthData,
  getSingleHealthData,
  updateHealthData,
  deleteHealthData,
  getHealthDataByUserId,
  getHealthData,
  getHealthRecordsByUserId,
  getHealthConditionByUserId,
};
