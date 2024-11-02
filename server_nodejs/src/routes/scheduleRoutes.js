const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const authMiddleware = require("../middlewares/authMiddleware");

const scheduleRoutes = (app) => {
    router.get("/schedule-get", authMiddleware, scheduleController.scheduleGet);

    return app.use("/api/schedule", router);
}


module.exports = scheduleRoutes;