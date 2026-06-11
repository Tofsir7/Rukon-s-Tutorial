const express = require('express');
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getMyProfile,
} = require('../controllers/studentController');
const { protect, admin, student } = require('../middleware/auth');

const router = express.Router();

router.get('/me', protect, student, getMyProfile);
router.get('/', protect, admin, getStudents);
router.get('/:id', protect, admin, getStudent);
router.post('/', protect, admin, createStudent);
router.put('/:id', protect, admin, updateStudent);
router.delete('/:id', protect, admin, deleteStudent);

module.exports = router;
