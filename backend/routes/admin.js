const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Gửi magic link tới email admin
router.post('/request-login', adminController.requestLogin);

// Xác minh token
router.post('/verify-token', adminController.verifyToken);

module.exports = router;
