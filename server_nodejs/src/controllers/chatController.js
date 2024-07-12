const userService = require('../services/chatService');

exports.getGroups = async (req, res) => {
    try {
        const groups = chatService.getGroups(req.user.id);
        res.status(200).json(groups);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};