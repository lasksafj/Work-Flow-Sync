const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const authMiddleware = require('../middlewares/authMiddleware');

const notificationsRoutes = (app) => {
    // Route for getting notifications, protected by auth middleware
    router.get('/notification-get', authMiddleware, notificationsController.getNotifications);

    return app.use('/api/notifications', router);
}

// Export the router to be used in other parts of the application
module.exports = notificationsRoutes;
