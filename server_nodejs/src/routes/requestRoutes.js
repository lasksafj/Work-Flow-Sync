const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middlewares/authMiddleware');

// Define the request-related routes and middleware
const requestRoutes = (app) => {
    // Route to create a drop shift request, protected by authentication middleware
    router.post("/create-drop-request", authMiddleware, requestController.createDropRequest);

    // Route to get details of employees available on a specific date, protected by authentication middleware
    router.get("/get-date-details", authMiddleware, requestController.getDateDetails);

    // Route to create a swap shift request, protected by authentication middleware
    router.post("/create-swap-request", authMiddleware, requestController.createSwapRequest);

    router.get('/get-org', authMiddleware, requestController.getOrg);
    router.get('/get-dropshifts', authMiddleware, requestController.getDropShifts);
    router.get('/get-swapshifts', authMiddleware, requestController.getSwapShifts);
    router.put('/update-dropshifts', authMiddleware, requestController.updateDropShifts);
    router.put('/update-swapshifts', authMiddleware, requestController.updateSwapShifts);

    // Mount the router on the '/api/request' path in the main application   
    return app.use('/api/request', router)
}

module.exports = requestRoutes;