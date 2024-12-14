const express = require('express');
const router = express.Router();
const notificationCreationController = require('../controllers/notificationCreationController');
const authMiddleware = require('../middlewares/authMiddleware');

const notificationCreationRoutes = (app) => {
    router.get('/notifications-fetch', authMiddleware, notificationCreationController.fetchNotifications);
    router.post('/notification-create', authMiddleware, notificationCreationController.createNotification);
    router.get('/employees-fetch', authMiddleware, notificationCreationController.fetchEmployees);

    return app.use('/api/notification', router);
}

module.exports = notificationCreationRoutes;

