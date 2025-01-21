const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    minlength: 7,
  },
 
  birthdate: {
    type: Date, 
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  type: {
    type: String,
    enum: ["admin", "user"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
