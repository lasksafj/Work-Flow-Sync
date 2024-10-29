const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/schedule-get", authMiddleware, scheduleController.scheduleGet);

module.exports = router;