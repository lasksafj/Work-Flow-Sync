const express = require("express");
const router = express.Router();
const shiftController = require("../controllers/shiftController");
const authMiddleware = require("../middlewares/authMiddleware");

const shiftRoutes = (app) => {
    router.get("/get-employees", authMiddleware, shiftController.getEmployees);
    router.get("/get-shifts", authMiddleware, shiftController.getShifts);
    router.post("/add-shifts", authMiddleware, shiftController.addShifts);
    router.post("/assign-shifts", authMiddleware, shiftController.assignShifts);
    router.get("/get-roles", authMiddleware, shiftController.getRoles);


    return app.use("/api/shift", router);
}


module.exports = shiftRoutes;