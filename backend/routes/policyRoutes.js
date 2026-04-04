const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/calculate-premium', authMiddleware, policyController.calculatePremium);
router.post('/purchase', authMiddleware, policyController.purchasePolicy);
router.get('/my-policy', authMiddleware, policyController.getMyPolicy);
router.get('/my-claims', authMiddleware, policyController.getMyClaims);

module.exports = router;
