const express = require('express');
const {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  getDueList,
  getMyPayments,
  getPaymentStats,
} = require('../controllers/paymentController');
const { protect, admin, student } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, admin, getPaymentStats);
router.get('/due', protect, admin, getDueList);
router.get('/my', protect, student, getMyPayments);
router.get('/', protect, admin, getPayments);
router.get('/:id', protect, getPayment);
router.post('/', protect, admin, createPayment);
router.put('/:id', protect, admin, updatePayment);
router.delete('/:id', protect, admin, deletePayment);

module.exports = router;
