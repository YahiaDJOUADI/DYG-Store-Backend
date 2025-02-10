const express = require("express");
const messageController = require("../controllers/messageController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddelware");
const validationMiddleware = require("../middlewares/validationMiddleware");
const { createMessageSchema } = require("../validations/messageValidation");
const router = express.Router();

// Save a new message (public route)
router.post("/messages", validationMiddleware(createMessageSchema), messageController.saveMessage);

// Fetch all messages (admin route)
router.get("/messages", authMiddleware, adminMiddleware, messageController.getMessages);

// Fetch a single message by ID (admin route)
router.get("/messages/:id", authMiddleware, adminMiddleware, messageController.getMessageById);

// Mark a message as read (admin route)
router.patch("/messages/:id", authMiddleware, adminMiddleware, messageController.markAsRead);

// Delete a message (admin route)
router.delete("/messages/:id", authMiddleware, adminMiddleware, messageController.deleteMessage);

module.exports = router;