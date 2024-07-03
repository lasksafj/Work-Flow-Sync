const logger = require('../utils/logger');

// Middleware to log incoming requests and outgoing responses
const requestLogger = (req, res, next) => {
    const originalSend = res.send;
    let responseBody = '';

    res.send = function (body) {
        responseBody = body;
        return originalSend.apply(this, arguments);
    };

    res.on('finish', () => {
        if (res.statusCode >= 400) {
            logger.error(`${new Date().toLocaleString()} - ${req.method} ${req.url} - Status: ${res.statusCode} - Response: ${responseBody}`);
        }
        else {
            logger.info(`${new Date().toLocaleString()} - ${req.method} ${req.url} - Status: ${res.statusCode} - ${res.statusMessage}`);
        }
    });

    next();
};
module.exports = requestLogger;