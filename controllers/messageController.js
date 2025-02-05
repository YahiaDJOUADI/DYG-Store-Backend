const Message = require("../models/Message");

// Save a new message
exports.saveMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // Create and save the message
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully!", data: newMessage });
  } catch (error) {
    next(error);
  }
};

// Fetch all messages for the admin
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

// Mark a message as read
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(id, { read: true }, { new: true });

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    res.status(200).json({ message: "Message marked as read.", data: message });
  } catch (error) {
    next(error);
  }
};

// Delete a message
exports.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    res.status(200).json({ message: "Message deleted successfully." });
  } catch (error) {
    next(error);
  }
};