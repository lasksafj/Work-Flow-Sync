require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

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
            logger.info(`${new Date().toLocaleString()} - ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });

    next();
};
app.use(requestLogger);

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
