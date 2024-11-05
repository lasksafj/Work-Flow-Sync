const express = require('express');
const router = express.Router();
const earningsController = require('../controllers/earningsController');
const authMiddleware = require('../middlewares/authMiddleware');

const earningsRoutes = (app) => {
    router.get('/earning', authMiddleware, earningsController.getEarnings);

    return app.use('/api/earnings', router);
}

module.exports = earningsRoutes;
