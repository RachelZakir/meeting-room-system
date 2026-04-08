const express = require('express');
const { login, refresh } = require('../controllers/authController');
const router = express.Router();

router.post('/auth/login', login);
router.post('/auth/refresh', refresh);

module.exports = router;
