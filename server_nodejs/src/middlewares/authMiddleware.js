const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    let token = req.cookies.accessToken;

    // Check Authorization header if no token in cookies
    if (!token && req.headers.authorization) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
    }


    if (!token) return res.status(401).json({ message: 'Access token is missing' });

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) return res.status(401).json({ message: 'Unauthorized user' });
        req.user = user;
        next();
    });
};

module.exports = authMiddleware;
