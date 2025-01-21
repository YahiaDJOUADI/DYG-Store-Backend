const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];

    // If no token is provided, return an error
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, "fheuifheiuhinvqpngatfvegfd"); // Replace with your secret key

    // Check if the token is valid
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Find the user by ID from the token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;

    next(); // Proceed to the next middleware/route
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = authMiddleware;