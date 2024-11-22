const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middlewares/authMiddleware');

const requestRoutes = (app) => {
    router.get('/get-org', authMiddleware, requestController.getOrg);
    router.get('/get-allRequests', authMiddleware, requestController.getAllRequests);
    return app.use('/api/request', router);
}

module.exports = requestRoutes;
