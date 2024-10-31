const express = require('express');
const router = express.Router();
const notificationCRUDController = require('../controllers/notificationCRUDController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/notification-fetch', authMiddleware, notificationCRUDController.fetchNotifications);

module.exports = router;


