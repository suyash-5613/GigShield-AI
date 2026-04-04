const express = require('express');
const router = express.Router();
const simulatorController = require('../controllers/simulatorController');

// Simulator will be available without auth for easy demo via panel, or could be protected.
// For hackathon demo ease, leaving it open
router.post('/trigger', simulatorController.triggerEvent);

module.exports = router;
