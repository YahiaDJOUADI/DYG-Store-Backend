const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authMiddleware = require("../middlewares/authMiddleware");
const validationMiddleware = require("../middlewares/validationMiddleware");
const { addUserSchema, updateUserSchema, loginSchema } = require("../validations/userValidation");

// Public routes (no authentication needed)
router.post("/users", validationMiddleware(addUserSchema), usersController.addUser); 
router.post("/login", validationMiddleware(loginSchema), usersController.login); 

// Protected routes (require authentication)
router.get("/users", authMiddleware, usersController.getUsers); 
router.get("/users/:id", authMiddleware, usersController.getUser); 
router.put("/users/:id", authMiddleware, validationMiddleware(updateUserSchema), usersController.updateUser); 
router.delete("/users/:id", authMiddleware, usersController.deleteUser); 
router.patch("/users/:id/promote", authMiddleware, usersController.promoteToAdmin); 
router.get("/myAccount", authMiddleware, usersController.myAccount); 

module.exports = router;