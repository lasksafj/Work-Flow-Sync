
const express = require('express');
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware');
const scheduleControllers = require('../controllers/scheduleControllers')

/**
 * 
 * @param {*} app - express app 
 */

const scheduleRoutes = (app) => {
    router.get('/fetch-schedule-data', authMiddleware, scheduleControllers.getAllScheduleData)
    router.post('/update-working-hours', authMiddleware, scheduleControllers.updateSchedule)

    return app.use('/api/schedule', router)
}

module.exports = scheduleRoutes;