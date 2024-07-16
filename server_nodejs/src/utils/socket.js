const socketIO = require('socket.io');
const { authSocketMiddleware } = require('../middlewares/authMiddleware');

const socketConfig = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: '*',
        },
    });

    io.use(authSocketMiddleware);

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.email}`);

        socket.on('sendMessage', async (data) => {
            const { groupId, message } = data;
            const newMessage = await messageModel.createMessage(groupId, socket.user.id, message);
            io.to(groupId).emit('newMessage', newMessage);
        });

        socket.on('joinChat', (groupId) => {
            socket.join(groupId);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.email}`);
        });
    });
};

module.exports = socketConfig;
