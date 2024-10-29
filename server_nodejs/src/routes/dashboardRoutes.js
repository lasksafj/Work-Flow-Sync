const express = require("express"); // Import the Express framework
const router = express.Router(); // Create a new router instance for defining routes

// Import the controller that contains the handler functions for dashboard routes
const dashboardController = require('../controllers/dashboardController');

// Import the authentication middleware to protect routes
const authMiddleware = require("../middlewares/authMiddleware");

// Define a GET route for '/get-example'
// Apply the authentication middleware and then the controller's getExample function
router.get("/get-example", authMiddleware, dashboardController.getExample);

// Define a GET route for '/get-detail-shift'
// Apply the authentication middleware and then the controller's getDetailShift function
router.get("/get-detail-shift", authMiddleware, dashboardController.getDetailShift);

// Export the router so it can be used in other parts of the application
module.exports = router;
