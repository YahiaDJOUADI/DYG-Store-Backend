const Order = require("../models/Order");
const Cart = require("../models/Cart");
const GuestCart = require("../models/GuestCart");

// Create a new order
const createOrder = async (req, res) => {
  const { wilaya, products, totalPrice, name, phone, address } = req.body;

  try {
    // Validate required fields
    const requiredFields = { wilaya, products, totalPrice, name, phone, address };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({ message: `Missing required field: ${field}.` });
      }
    }

    // Validate products array
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products must be a non-empty array." });
    }

    // Validate each product
    const invalidProduct = products.find(
      (product) => !product.productId || !product.quantity || product.quantity < 1 || !product.price
    );
    if (invalidProduct) {
      return res.status(400).json({ message: "Invalid product data." });
    }

    // Create the order
    const order = new Order({
      products,
      totalPrice,
      wilaya,
      name,
      phone,
      address,
      status: "pending",
      orderDate: new Date(),
      isPaid: false,
      user: req.user?._id, // Add user ID if authenticated
      sessionId: req.guestCartId, // Add session ID for guests
    });

    await order.save();

    // Clear the cart
    if (req.user) {
      await Cart.findOneAndDelete({ user: req.user._id });
    } else {
      await GuestCart.findOneAndDelete({ sessionId: req.guestCartId });
    }

    // Return success response
    res.status(201).json({
      message: "Order created successfully!",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order." });
  }
};

// Get all orders (for both authenticated and guest users)
const getOrders = async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find the order by ID (remove the user filter if deletion is allowed for all users)
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Delete the order
    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: "Order deleted successfully!" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order." });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    // Validate status
    const allowedStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    // Update the order status directly
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Order status updated!", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status." });
  }
};

// Update payment status (isPaid)
const updatePaymentStatus = async (req, res) => {
  const { orderId } = req.params;
  const { isPaid } = req.body;

  try {
    // Validate isPaid
    if (typeof isPaid !== "boolean") {
      return res.status(400).json({ message: "Invalid payment status." });
    }

    // Update the payment status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { isPaid },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Payment status updated!", order: updatedOrder });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Failed to update payment status." });
  }
};

module.exports = {
  createOrder,
  getOrders,
  deleteOrder,
  updateOrderStatus,
  updatePaymentStatus,
};