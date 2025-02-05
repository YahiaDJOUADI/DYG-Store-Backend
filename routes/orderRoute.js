const express = require("express");
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddelware");
const validationMiddleware = require("../middlewares/validationMiddleware");
const { createOrderSchema } = require("../validations/orderValidation");

const router = express.Router();


// Get all orders (for admin only)
router.get("/orders", authMiddleware,adminMiddleware,validationMiddleware(createOrderSchema), orderController.getOrders);

// Create a new order (for both authenticated users and guests)
router.post("/orders", orderController.createOrder);

// Get orders for a specific user (authenticated or guest)
router.get("/orders/user", orderController.getUserOrders);

// Delete an order (for authenticated users only)
router.delete("/orders/:orderId", authMiddleware,adminMiddleware, orderController.deleteOrder);

// Update order status (for authenticated admin only)
router.patch("/orders/:orderId/status", authMiddleware,adminMiddleware, orderController.updateOrderStatus);


module.exports = router;