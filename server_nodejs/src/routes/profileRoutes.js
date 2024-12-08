const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middlewares/authMiddleware");

// Define the request-related routes and middleware
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
    router.put("/profile-putChangePassword", authMiddleware, profileController.profilePutPassword);

    return app.use("/api/profile", router);
}

module.exports = profileRoutes;