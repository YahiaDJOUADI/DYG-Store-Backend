const express = require("express");
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddelware");
const validationMiddleware = require("../middlewares/validationMiddleware");
const { createOrderSchema } = require("../validations/orderValidation");

const router = express.Router();

// Get all orders (for admin only)
router.get("/orders", authMiddleware, adminMiddleware, orderController.getOrders);

// Create a new order for authenticated users
router.post(
  "/orders/user",
  authMiddleware,
  validationMiddleware(createOrderSchema),
  orderController.createOrderForUser
);

// Create a new order for guest users
router.post(
  "/orders/guest",
  validationMiddleware(createOrderSchema),
  orderController.createOrderForGuest
);

// Get orders for a specific user (authenticated or guest)
router.get("/orders/user", orderController.getUserOrders);

// Get a single order by ID
router.get("/orders/:id", orderController.getOrder);

// Delete an order (for authenticated users only)
router.delete("/orders/:orderId", authMiddleware, adminMiddleware, orderController.deleteOrder);

// Update order status (for authenticated admin only)
router.patch("/orders/:orderId/status", authMiddleware, adminMiddleware, orderController.updateOrderStatus);

module.exports = router;