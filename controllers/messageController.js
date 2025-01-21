const Message = require("../models/Message")

// Save a new message
exports.saveMessage = async (req, res) => {
    try {
      const { name, email, message } = req.body;
  
      // Validate input
      if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // Create and save the message
      const newMessage = new Message({ name, email, message });
      await newMessage.save();
  
      res.status(201).json({ message: "Message sent successfully!", data: newMessage });
    } catch (error) {
      console.error("Error saving message:", error);
      res.status(500).json({ message: "Failed to send message. Please try again." });
    }
  };

// Fetch all messages for the admin
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }); // Sort by latest first
    res.status(200).json({ data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages." });
  }
};

// Mark a message as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(id, { read: true }, { new: true });

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    res.status(200).json({ message: "Message marked as read.", data: message });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ message: "Failed to mark message as read." });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    res.status(200).json({ message: "Message deleted successfully." });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Failed to delete message." });
  }
};