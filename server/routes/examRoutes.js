const express = require('express');
const {
  getExams,
  createExam,
  updateExam,
  deleteExam,
  getExamResults,
  saveResults,
  getStudentResults,
} = require('../controllers/examController');
const { protect, admin, student } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getExams);
router.get('/results/student/:studentId?', protect, getStudentResults);
router.get('/:examId/results', protect, getExamResults);
router.post('/', protect, admin, createExam);
router.post('/results', protect, admin, saveResults);
router.put('/:id', protect, admin, updateExam);
router.delete('/:id', protect, admin, deleteExam);

module.exports = router;
