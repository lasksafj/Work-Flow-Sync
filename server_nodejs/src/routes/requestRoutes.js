const requestController = require('../controllers/requestController');
const authMiddleware = require("../middlewares/authMiddleware");

const express = require("express");
const router = express.Router();


const requestRoutes = (app) => {
    // Route to create a drop shift request, protected by authentication middleware
    router.post("/create-drop-request", authMiddleware, requestController.createDropRequest);

    // Route to get details of employees available on a specific date, protected by authentication middleware
    router.get("/get-date-details", authMiddleware, requestController.getDateDetails);

    // Route to create a swap shift request, protected by authentication middleware
    router.post("/create-swap-request", authMiddleware, requestController.createSwapRequest);

    // Mount the router on the '/api/request' path in the main application   
    return app.use('/api/request', router)
}

module.exports = requestRoutes;