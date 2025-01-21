const express = require("express");

const usersController = require("../controllers/usersController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();


// Public routes (no authentication needed)
router.post("/users",  usersController.addUser); // Add a new user
router.post("/login", usersController.login);

// Protected routes (authentication required)
router.get("/users", authMiddleware, usersController.getUsers);
router.get("/users/:id", authMiddleware, usersController.getUser);
router.put("/users/:id", authMiddleware, usersController.updateUser);
router.delete("/users/:id", authMiddleware, usersController.deleteUser);

// New route for promoting a user to admin, with an added check for the logged-in user's role
router.patch("/users/:id/promote", authMiddleware, usersController.promoteToAdmin);

// Protected route for getting authenticated user's details
router.get("/myAccount", authMiddleware, usersController.myAccount);


module.exports = router;