const Message = require("../models/Message");

// Save a new message
exports.saveMessage = async (req, res, next) => {
  try {
    const newMessage = await Message.create(req.body);
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

// Fetch a single message by ID
exports.getMessageById = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found." });
    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

// Mark a message as read
exports.markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!message) return res.status(404).json({ message: "Message not found." });
    res.status(200).json({ message: "Message marked as read.", data: message });
  } catch (error) {
    next(error);
  }
};

// Delete a message
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found." });
    res.status(200).json({ message: "Message deleted successfully." });
  } catch (error) {
    next(error);
  }
};