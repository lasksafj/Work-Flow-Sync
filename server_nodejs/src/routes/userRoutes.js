const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const userRoutes = (app) => {
    router.post('/register', userController.registerUser);
    router.post('/login', userController.loginUser);
    router.post('/refresh-token', userController.refreshToken);
    router.post('/verify', userController.verifyUser);
    router.post('/save-push-token', authMiddleware, userController.savePushToken);
    router.post('/logout', userController.logout);


    router.get('/protected', authMiddleware, (req, res) => {
        res.status(200).json({ number: req.query.number, message: 'This is a protected route' });
    });

    return app.use('/api/user', router);
}


module.exports = userRoutes;
