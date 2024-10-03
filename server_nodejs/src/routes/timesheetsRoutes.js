const express = require('express');
const router = express.Router();
const timesheetsController = require('../controllers/timesheetsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/clock-in-out', authMiddleware, timesheetsController.clockInOut);

module.exports = router;
