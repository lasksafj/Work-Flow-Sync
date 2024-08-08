
const express = require('express');
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware');
const scheduleController = require('../controllers/scheduleController')

/**
 * 
 * @param {*} app - express app 
 */

const scheduleRoutes = (app) => {
    router.get('/fetch-schedule-data', authMiddleware, scheduleController.getAllScheduleData)
    router.post('/update-working-hours', authMiddleware, scheduleController.updateSchedule)
    
    return app.use('/api/schedule', router)
}

module.exports = scheduleRoutes;