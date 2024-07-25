// chatHandlers.js
const chatSocketService = require('../socketServices/chatSocketService');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('user connected', socket.user.id);

        socket.on('sendMessage', (data) => {
            chatSocketService.sendMessage(io, { ...data, userId: socket.user.id });
        });

        socket.on('joinChat', (groupId) => {
            socket.join(groupId);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.id}`);
        });
    });
};

