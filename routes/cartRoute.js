const express = require("express");
const cartController = require("../controllers/cartController");
const cartMiddleware = require("../middlewares/cartMiddleware");

const router = express.Router();

// Define routes for cart - now accessible to both guest and authenticated users
router.get("/cart", cartMiddleware, cartController.getCart);
router.post("/cart/add", cartMiddleware, cartController.addToCart);
router.post("/cart/remove", cartMiddleware, cartController.removeFromCart);
router.post(
  "/cart/update",
  cartMiddleware,
  cartController.updateCartItemQuantity
);
router.delete("/cart", cartMiddleware, cartController.clearCart);

module.exports = router;
