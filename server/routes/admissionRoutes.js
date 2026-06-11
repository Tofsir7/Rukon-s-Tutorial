const express = require('express');
const {
  getAdmissions,
  getMyAdmissions,
  createAdmission,
  approveAdmission,
  rejectAdmission,
  updateAdmission,
  deleteAdmission,
} = require('../controllers/admissionController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createAdmission);
router.get('/my', protect, getMyAdmissions);
router.get('/', protect, admin, getAdmissions);
router.patch('/:id/approve', protect, admin, approveAdmission);
router.patch('/:id/reject', protect, admin, rejectAdmission);
router.put('/:id', protect, admin, updateAdmission);
router.delete('/:id', protect, admin, deleteAdmission);

module.exports = router;
