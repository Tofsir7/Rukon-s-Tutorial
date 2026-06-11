const express = require('express');
const {
  getMaterials,
  getMyMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} = require('../controllers/materialController');
const { protect, admin, student } = require('../middleware/auth');

const router = express.Router();

router.get('/my', protect, student, getMyMaterials);
router.get('/', protect, getMaterials);
router.post('/', protect, admin, createMaterial);
router.put('/:id', protect, admin, updateMaterial);
router.delete('/:id', protect, admin, deleteMaterial);

module.exports = router;
