const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/get-groups', authMiddleware, chatController.getGroups);

module.exports = router;
