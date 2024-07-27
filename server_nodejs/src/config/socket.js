const socketIO = require('socket.io');
// const { authSocketMiddleware } = require('../middlewares/authMiddleware');

const socketConfig = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: '*',
        },
    });
    return io;
};

module.exports = socketConfig;
