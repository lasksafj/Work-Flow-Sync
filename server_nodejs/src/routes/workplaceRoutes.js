const workplaceController = require('../controllers/workplaceController');
const authMiddleware = require("../middlewares/authMiddleware");

const express = require("express");
const router = express.Router();


const workplaceRoutes = (app) => {
    router.get("/get-roles", authMiddleware, workplaceController.getRoles);
    router.get("/get-org", authMiddleware, workplaceController.getOrg);
    router.get("/get-employee-details", authMiddleware, workplaceController.getEmployeeDetails);
    router.post("/add-workplace", authMiddleware, workplaceController.addWorkplace);
    router.post("/add-employee-to-workplace", authMiddleware, workplaceController.addEmployeeToWorkplace);
    router.get("/search-employee", authMiddleware, workplaceController.searchEmployee);
    router.put("/update-employee-role", authMiddleware, workplaceController.updateEmployeeRole);
    return app.use('/api/workplace', router)

}

module.exports = workplaceRoutes;