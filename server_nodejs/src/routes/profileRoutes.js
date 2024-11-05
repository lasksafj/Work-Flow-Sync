const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middlewares/authMiddleware");

const profileRoutes = (app) => {
    router.get(
        "/profile-getRole",
        authMiddleware,
        profileController.profileGetRole
    );
    router.get("/profile-getOrg", authMiddleware, profileController.profileGetOrg);
    router.get(
        "/profile-getAllUsers",
        authMiddleware,
        profileController.profileGetAllUsers
    );
    router.put("/profile-put", authMiddleware, profileController.profilePut);

    app.use("/api/profile", router);
}


module.exports = profileRoutes;