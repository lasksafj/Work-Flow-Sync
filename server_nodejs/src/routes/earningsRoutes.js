const express = require('express');
const router = express.Router();
const earningsController = require('../controllers/earningsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/earning', authMiddleware, earningsController.getEarnings);

module.exports = router;
