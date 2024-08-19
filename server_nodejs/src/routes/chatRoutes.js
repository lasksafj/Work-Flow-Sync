const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/get-groups', authMiddleware, chatController.getGroups);
router.post('/create-group', authMiddleware, chatController.createGroup);
router.post('/add-participant', authMiddleware, chatController.addParticipants);
router.get('/get-employees', authMiddleware, chatController.getEmployees);
router.get('/get-participants', authMiddleware, chatController.getParticipants);
router.get('/get-group-with-2participants', authMiddleware, chatController.getGroupWith2Participants);

router.get('/get-messages', authMiddleware, chatController.getMessages);
// router.post('/messages', authMiddleware, chatController.postMessage);

module.exports = router;
