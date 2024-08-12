const jwt = require('jsonwebtoken');

const authSocketMiddleware = (socket, next) => {
    const token = socket.handshake.query.token;
    console.log(token);
    if (!token) {
        return next(new Error('Authentication error'));
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) {
            return next(new Error('Authentication error'));
        }
        socket.user = user;
        next();
    });
}

module.exports = authSocketMiddleware;