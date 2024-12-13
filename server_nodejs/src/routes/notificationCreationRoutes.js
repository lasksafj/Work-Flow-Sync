const express = require('express');
const router = express.Router();
const notificationCreationController = require('../controllers/notificationCreationController');
const authMiddleware = require('../middlewares/authMiddleware');

const notificationCreationRoutes = (app) => {
    router.get('/notifications-fetch', authMiddleware, notificationCreationController.fetchNotifications);
    router.post('/notification-create', authMiddleware, notificationCreationController.createNotification);
    router.get('/organizations-fetch', authMiddleware, notificationCreationController.fetchOrganizations);
    router.get('/organization-details-fetch', authMiddleware, notificationCreationController.fetchOrganizationDetails);
    router.get('/employees-fetch', authMiddleware, notificationCreationController.fetchEmployees);
    router.get('/employee-id-fetch', authMiddleware, notificationCreationController.fetchEmployeeId);

    return app.use('/api/notification', router);
}

module.exports = notificationCreationRoutes;

