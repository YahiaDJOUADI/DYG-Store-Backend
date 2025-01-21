const express = require("express");
const messageController = require("../controllers/messageController")

const router = express.Router();

// Save a new message (public route)
router.post("/messages", messageController.saveMessage);

// Fetch all messages (admin route)
router.get("/messages", messageController.getMessages);

// Mark a message as read (admin route)
router.patch("/messages/:id/read", messageController.markAsRead);

// Delete a message (admin route)
router.delete("/messages/:id", messageController.deleteMessage);

module.exports = router;