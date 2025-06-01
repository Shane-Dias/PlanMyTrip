const express = require("express");
const router = express.Router();
const SafetyScoreController = require("../controllers/safetyScoreController");

router.post(
  "/calculate-safety-score",
  SafetyScoreController.calculateSafetyScore
);

module.exports = router;
