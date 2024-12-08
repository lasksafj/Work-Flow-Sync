const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middlewares/authMiddleware');

// Define the request-related routes and middleware
const requestRoutes = (app) => {
    router.get('/get-org', authMiddleware, requestController.getOrg);
    router.get('/get-dropshifts', authMiddleware, requestController.getDropShifts);
    router.get('/get-swapshifts', authMiddleware, requestController.getSwapShifts);
    router.put('/update-dropshifts', authMiddleware, requestController.updateDropShifts);
    router.put('/update-swapshifts', authMiddleware, requestController.updateSwapShifts);
    return app.use('/api/request', router);
}

module.exports = requestRoutes;