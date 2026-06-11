const express = require('express');
const {
  getNotices,
  getPublicNotices,
  getMyNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeController');
const { protect, admin, student } = require('../middleware/auth');

const router = express.Router();

router.get('/public', getPublicNotices);
router.get('/my', protect, student, getMyNotices);
router.get('/', protect, admin, getNotices);
router.post('/', protect, admin, createNotice);
router.put('/:id', protect, admin, updateNotice);
router.delete('/:id', protect, admin, deleteNotice);

module.exports = router;
