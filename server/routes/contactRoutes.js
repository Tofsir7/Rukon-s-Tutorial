const express = require('express');
const { createContact, getContacts } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/', createContact);
router.get('/', protect, admin, getContacts);

module.exports = router;
