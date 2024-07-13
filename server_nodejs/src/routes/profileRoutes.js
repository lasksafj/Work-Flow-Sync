const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/profile-get", authMiddleware, profileController.profileGet);
router.put("/profile-put", authMiddleware, profileController.profilePut);

module.exports = router;
