const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authMiddleware = require("../middlewares/authMiddleware");
const validationMiddleware = require("../middlewares/validationMiddleware");
const { addUserSchema, updateUserSchema, loginSchema } = require("../validations/userValidation");
const adminMiddleware = require("../middlewares/adminMiddelware");

// Public routes (no authentication needed)
router.post("/users", validationMiddleware(addUserSchema), usersController.addUser); 
router.post("/login", validationMiddleware(loginSchema), usersController.login); 

// Protected routes (require authentication)
router.get("/users", authMiddleware, usersController.getUsers); 
router.get("/users/:id", authMiddleware, usersController.getUser); 
router.get("/users/:id/details", authMiddleware, usersController.getUserDetails); 
router.put("/users/:id", authMiddleware, validationMiddleware(updateUserSchema), usersController.updateUser); 
router.delete("/users/:id", authMiddleware, adminMiddleware, usersController.deleteUser); 
router.patch("/users/:id/promote", authMiddleware, usersController.promoteToAdmin); 
router.get("/account", authMiddleware, usersController.account); 
router.post("/reset-password", usersController.resetPassword);

module.exports = router;