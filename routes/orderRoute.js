const express = require("express");
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Define routes for orders

// Get all orders (for authenticated users only)
router.get("/orders", authMiddleware, orderController.getOrders);

// Create a new order (for both authenticated users and guests)
router.post("/orders", orderController.createOrder);

// Get orders for a specific user (authenticated or guest)
router.get("/orders/user", orderController.getUserOrders);

// Delete an order (for authenticated users only)
router.delete("/orders/:orderId", authMiddleware, orderController.deleteOrder);

// Update order status (for authenticated users only)
router.patch("/orders/:orderId/status", authMiddleware, orderController.updateOrderStatus);

// Update payment status (for authenticated users only)
router.patch("/orders/:orderId/payment-status", authMiddleware, orderController.updatePaymentStatus);

module.exports = router;