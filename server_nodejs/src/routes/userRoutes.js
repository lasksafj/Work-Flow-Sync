const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/refresh-token', userController.refreshToken);
router.post('/verify', userController.verifyUser);

router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({ number: req.query.number, message: 'This is a protected route' });
});

module.exports = router;
