const express = require('express');
const router = express.Router();
const notificationCreationController = require('../controllers/notificationCreationController');
const authMiddleware = require('../middlewares/authMiddleware');

const notificationCreationRoutes = (app) => {
    router.get('/notification-fetch', authMiddleware, notificationCreationController.fetchNotifications);
    router.post('/notification-create', authMiddleware, notificationCreationController.createNotification);
    router.get('/employees-fetch', authMiddleware, notificationCreationController.fetchEmployeesByOrg);


    return app.use('/api/notification', router);
}

module.exports = notificationCreationRoutes;

