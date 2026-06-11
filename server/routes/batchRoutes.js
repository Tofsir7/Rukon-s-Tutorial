const express = require('express');
const {
  getBatches,
  getPublicBatches,
  getBatch,
  createBatch,
  updateBatch,
  deleteBatch,
  getBatchStudents,
} = require('../controllers/batchController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/public', getPublicBatches);
router.get('/', protect, getBatches);
router.get('/:id/students', protect, admin, getBatchStudents);
router.get('/:id', protect, getBatch);
router.post('/', protect, admin, createBatch);
router.put('/:id', protect, admin, updateBatch);
router.delete('/:id', protect, admin, deleteBatch);

module.exports = router;
