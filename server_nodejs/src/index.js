require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const requestLogger = require('./middlewares/loggerMiddleware');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const earningsRoutes = require('./routes/earningsRoutes'); // Anh
const notificationsRoutes = require('./routes/notificationsRoutes'); // Long
const profileRoutes = require("./routes/profileRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const scheduleRoutess = require("./routes/userSchedules");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationCRUDRoutes = require('./routes/notificationCRUDRoutes');


const socketConfig = require('./config/socket');
const authSocketMiddleware = require('./middlewares/authSocketMiddleware');
const chatSocket = require('./socket/chatSocket');


const PORT = process.env.PORT || 3000;
const allowedOrigins = [
    'http://localhost:3000', // Web client
    'http://localhost:8081', // React Native app on local network
    'http://your-ngrok-url' // If you're using ngrok for React Native mobile
];

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow credentials like cookies
}));

app.use(cookieParser());
app.use(requestLogger);

// Routes
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/earnings', earningsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/schedule", scheduleRoutes);
scheduleRoutess(app)
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/notificationCRUD', notificationCRUDRoutes);

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

// Start socket
const io = socketConfig(server)
const chatIo = io.of('/chat');
chatIo.use(authSocketMiddleware);
chatSocket(chatIo);
