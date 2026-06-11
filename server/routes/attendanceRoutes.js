const express = require('express');
const {
  getAttendance,
  saveAttendance,
  getAttendanceHistory,
  getStudentAttendance,
  getStudentAttendancePercentage,
} = require('../controllers/attendanceController');
const { protect, admin, student } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, admin, getAttendance);
router.post('/', protect, admin, saveAttendance);
router.get('/history', protect, admin, getAttendanceHistory);
router.get('/percentage', protect, admin, getStudentAttendancePercentage);
router.get('/student/:studentId?', protect, getStudentAttendance);

module.exports = router;
