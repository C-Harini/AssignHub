const express = require('express');
const { adminStats, studentStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/admin', protect, requireRole('admin'), adminStats);
router.get('/student', protect, requireRole('student'), studentStats);

module.exports = router;
