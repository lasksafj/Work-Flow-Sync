const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/notification-get', authMiddleware, notificationsController.getNotifications);

module.exports = router;
