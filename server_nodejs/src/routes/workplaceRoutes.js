const express = require("express"); // Import the Express framework to create and manage routes
const router = express.Router(); // Initialize a new Express router instance for grouping related routes

// Import the controller that contains the handler functions for workplace routes
const workplaceController = require('../controllers/workplaceController');

// Import the authentication middleware to protect routes
const authMiddleware = require("../middlewares/authMiddleware");

// Route to get the organization details of the authenticated user
// The `authMiddleware` ensures the route is only accessible to authenticated users
router.get("/get-org", authMiddleware, workplaceController.getOrg);

// Route to get details of employees in a specified organization
// Protected with `authMiddleware` to restrict access to authenticated users
router.get("/get-employee-details", authMiddleware, workplaceController.getEmployeeDetails);

// Route to add a new workplace (organization)
// The `authMiddleware` ensures that only authenticated users can add a workplace
router.post("/add-workplace", authMiddleware, workplaceController.addWorkplace);

// Route to add an employee to a workplace with specified details like role and pay rate
// Only authenticated users can add employees to a workplace
router.post("/add-employee-to-workplace", authMiddleware, workplaceController.addEmployeeToWorkplace);

// Route to search for an employee by phone number within an organization
// Protected with `authMiddleware` to restrict access to authenticated users
router.get("/search-employee", authMiddleware, workplaceController.searchEmployee);

// Route to update the role of an employee within a workplace
// The `authMiddleware` restricts this action to authenticated users only
router.put("/update-employee-role", authMiddleware, workplaceController.updateEmployeeRole);

// Export the router so it can be used in other parts of the application
module.exports = router;
