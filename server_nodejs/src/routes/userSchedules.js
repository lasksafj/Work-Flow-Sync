
const express = require('express');
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware');
const scheduleController = require('../controllers/scheduleController')

/**
 * 
 * @param {*} app - express app 
 */

const scheduleRoutes = (app) => {
    router.get('/get-user-data', authMiddleware, scheduleController.getUserData)

    return app.use('/api/schedule', router)
}

module.exports = scheduleRoutes;