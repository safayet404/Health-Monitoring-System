const express = require("express");
const {
  createHealthData,
  getHealthData,
  getSingleHealthData,
  getHealthDataByUserId,
  updateHealthData,
  deleteHealthData,
  getHealthRecordsByUserId,
  getHealthConditionByUserId,
  getDataForDoctor
} = require("../controller/healthController");

const router = express.Router();

router.post("/create-data", createHealthData);
router.get("/get-data", getHealthData);
router.get("/get-all-data", getDataForDoctor);
router.get("/single-data/:id", getSingleHealthData);
router.get("/healthdata/:email", getHealthDataByUserId);
router.get("/healthrecords/:email", getHealthRecordsByUserId);
router.get("/healthcondition/:userId", getHealthConditionByUserId);
router.patch("/update-data/:id", updateHealthData);
router.delete("/delete-data/:id", deleteHealthData);

module.exports = router;
