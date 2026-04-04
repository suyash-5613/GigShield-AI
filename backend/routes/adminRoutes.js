const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminMiddleware } = require('../middlewares/authMiddleware');

router.get('/stats', adminMiddleware, adminController.getDashboardStats);

module.exports = router;
