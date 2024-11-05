const express = require('express');
const router = express.Router();
const timesheetsController = require('../controllers/timesheetsController');
const authMiddleware = require('../middlewares/authMiddleware');

const timesheetsRoutes = (app) => {
    router.get('/status', authMiddleware, timesheetsController.getClockStatus);
    router.post('/clock-in-out', authMiddleware, timesheetsController.clockInOut);

    return app.use("/api/timesheets", router);
}


module.exports = timesheetsRoutes;
