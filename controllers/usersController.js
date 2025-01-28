const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { addUserSchema, updateUserSchema, loginSchema } = require("../validations/userValidation");
const validationMiddleware = require("../middlewares/validationMiddleware");

const JWT_SECRET = "fheuifheiuhinvqpngatfvegfd";

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get one user by ID
exports.getUser = async (req, res) => {
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
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Add a new user
exports.addUser = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = addUserSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({ error: error.details.map((err) => err.message) });
    }

    const { userName, email, phone, password } = value;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
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
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
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
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Validate request body
    const { error, value } = updateUserSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({ error: error.details.map((err) => err.message) });
    }

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
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Login function
exports.login = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({ error: error.details.map((err) => err.message) });
    }

    const { email, password } = value;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get the authenticated user's details
exports.myAccount = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        phone: user.phone,
        type: user.type,
      },
    });
  } catch (error) {
    console.error("Error fetching user account:", error);
    res.status(500).json({ error: "Failed to fetch user account" });
  }
};

// Promote a user to admin
exports.promoteToAdmin = async (req, res) => {
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
    console.error(error);
    return res.status(500).json({ message: "Failed to update user type" });
  }
};