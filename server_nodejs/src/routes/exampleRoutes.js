const express = require("express");
const router = express.Router();
const exampleController = require("../controllers/exampleController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/example-get", authMiddleware, exampleController.exampleGet);

module.exports = router;
