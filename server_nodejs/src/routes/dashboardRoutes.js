const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/get-example", authMiddleware, dashboardController.getExample);

router.get("/get-detail-shift", authMiddleware, dashboardController.getDetailShift);

module.exports = router;
