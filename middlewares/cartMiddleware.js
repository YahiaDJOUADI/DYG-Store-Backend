const Cart = require("../models/Cart");
const GuestCart = require("../models/GuestCart");
const { v4: uuidv4 } = require("uuid");

const cartMiddleware = async (req, res, next) => {
  try {
    // For authenticated users
    if (req.user) {
      req.cartType = "user";
      return next();
    }

    // For guest users
    let sessionId = req.cookies.guestCartId;

    // If no session exists, create one
    if (!sessionId) {
      sessionId = uuidv4();
      res.cookie("guestCartId", sessionId, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }

    req.cartType = "guest";
    req.guestCartId = sessionId;
    next();
  } catch (error) {
    console.error("Cart middleware error:", error);
    next(error);
  }
};

module.exports = cartMiddleware;
