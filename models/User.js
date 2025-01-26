const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Username is required"], 
    trim: true, 
    minlength: [3, "Username must be at least 3 characters long"], 
    maxlength: [30, "Username cannot exceed 30 characters"], 
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true, 
    match: [/.+\@.+\..+/, "Please enter a valid email address"], 
  },
  phone: {
    type: String,
    trim: true, 
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"], 
  },
  password: {
    type: String,
    required: [true, "Password is required"], 
    minlength: [7, "Password must be at least 7 characters long"], 
  },
  type: {
    type: String,
    enum: ["admin", "user"], 
    default: "user", 
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;