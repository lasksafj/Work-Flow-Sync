const logger = require('../utils/logger');
const chatService = require('../services/chatService');
const { log } = require('winston');

exports.sendMessage = async (io, data) => {
    try {
        console.log(data);
        const { userId, groupId, content } = data;
        let newMessage = await chatService.createMessage(groupId, userId, content);
        io.to(groupId).emit('newMessage', newMessage);
        logger.info('Socket sendMessage: success');
    }
    catch (error) {
        logger.error('Socket sendMessage:', error);
    }
}