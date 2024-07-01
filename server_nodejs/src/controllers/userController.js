const userService = require('../services/userService');

exports.registerUser = async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { accessToken, refreshToken, profile } = await userService.loginUser(req.body);
        res.status(200).json({
            access: accessToken,
            refresh: refreshToken,
            profile
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { accessToken, refreshToken } = await userService.refreshToken(req.body.refresh);
        res.status(200).json({
            access: accessToken,
            refresh: refreshToken
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.verifyUser = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const accessToken = authHeader && authHeader.split(' ')[1];
        const { profile } = await userService.verifyUser(accessToken);
        res.status(200).json({
            access: accessToken,
            profile
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};