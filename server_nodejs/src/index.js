require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const requestLogger = require('./middlewares/loggerMiddleware');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const socketConfig = require('./utils/socket');


const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(requestLogger);

// Routes
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

socketConfig(server)