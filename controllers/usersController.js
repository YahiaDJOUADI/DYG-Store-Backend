const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Order = require("../models/Order");
const orderResource = require("../recourses/orderResource");

const JWT_SECRET = process.env.JWT_SECRET;

// Get all users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Get one user by ID
exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Add a new user
exports.addUser = async (req, res, next) => {
  try {
    const { userName, email, phone, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      userName,
      email,
      phone,
      password: hashedPassword,
      type: "user",
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET);

    res.status(201).json({
      token,
      user: {
        userName: newUser.userName,
        email: newUser.email,
        phone: newUser.phone,
        type: newUser.type,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    next(error);
  }
};

// Update a user by ID
exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const value = req.body;

    // Hash the password if it's being updated
    if (value.password) {
      const salt = await bcrypt.genSalt(10);
      value.password = await bcrypt.hash(value.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, value, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Login function
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res.json({
      token,
      user: {
        userName: user.userName,
        email: user.email,
        phone: user.phone,
        type: user.type,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get the authenticated user's details
exports.account = async(req, res, next) => {
  return res.json(req.user)
}

// Promote a user to admin
exports.promoteToAdmin = async (req, res, next) => {
  const { id } = req.params;
  const { type } = req.body;

  if (req.user.email !== "yahia@gmail.com") {
    return res.status(403).json({ message: "Not authorized to promote users" });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.type = type;
    await user.save();

    return res.status(200).json({ message: "User type updated successfully" });
  } catch (error) {
    next(error);
  }
};

// Reset Password 
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email, old password, and new password are required." });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Verify the old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Old password is incorrect." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    next(error);
  }
};
exports.getUserDetails = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const orders = await Order.find({ user: id }).populate('products.productId');
    
    res.status(200).json({
      user,
      orders: orders.map(order => orderResource(order))
    });
  } catch (error) {
    next(error);
  }
};