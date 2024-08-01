// chatHandlers.js
const chatSocketService = require('../socketServices/chatSocketService');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('user connected', socket.user.id);
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.id}`);
        });

        // ChatScreen
        socket.on('sendMessage', (data) => {
            chatSocketService.sendMessage(io, { ...data, userId: socket.user.id });
        });

        socket.on('joinChat', (groupId) => {
            socket.join(groupId);
        });

        socket.on('leaveChat', (groupId) => {
            socket.leave(groupId);
        });

        // ChatList
        socket.on('ChatList:join', (userEmail) => {
            socket.join('ChatList:' + userEmail);
        });

        socket.on('ChatList:leave', (userEmail) => {
            socket.leave('ChatList:' + userEmail);
        });

        // seen chat
        socket.on('seenChat', (groupId) => {
            chatSocketService.seenChat(io, { groupId, userId: socket.user.id });
        })

    });
};

