const express = require('express');
const {
  getTeachers,
  getAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require('../controllers/teacherController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/public', getTeachers);
router.get('/', protect, admin, getAllTeachers);
router.post('/', protect, admin, createTeacher);
router.put('/:id', protect, admin, updateTeacher);
router.delete('/:id', protect, admin, deleteTeacher);

module.exports = router;
