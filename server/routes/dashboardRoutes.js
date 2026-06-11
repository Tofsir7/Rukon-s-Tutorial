const express = require('express');
const { getDashboardStats, getStudentDashboard } = require('../controllers/dashboardController');
const { protect, admin, student } = require('../middleware/auth');

const router = express.Router();

router.get('/admin', protect, admin, getDashboardStats);
router.get('/student', protect, student, getStudentDashboard);

module.exports = router;
