const Order = require("../models/Order");
const Product = require("../models/Product");

// Create a new order
const createOrder = async (req, res, next) => {
  const { wilaya, products, totalPrice, name, phone, address } = req.body;

  try {
    // Check product stock and update quantities
    for (const product of products) {
      const foundProduct = await Product.findById(product.productId);
      if (!foundProduct) {
        return res.status(404).json({ message: `Product not found: ${product.productId}.` });
      }
      if (foundProduct.stock < product.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.productId}.` });
      }
      foundProduct.stock -= product.quantity;
      await foundProduct.save();
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
      user: req.user ? req.user._id : null, 
    });

    await order.save();

    // Return success response
    res.status(201).json({
      message: "Order created successfully!",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders (for both authenticated and guest users)
const getOrders = async (req, res, next) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Get orders for a specific user (authenticated or guest)
const getUserOrders = async (req, res, next) => {
  try {
    const { userId } = req.query;

    // Fetch orders based on user ID
    const orders = await Order.find({
      user: userId,
    });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Delete an order
const deleteOrder = async (req, res, next) => {
  const { orderId } = req.params;

  try {
    // Find the order by ID
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Delete the order
    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: "Order deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

// Update order status
const updateOrderStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  // Validate status
  const allowedStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }

  try {
    // Update the order status
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
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getUserOrders,
  deleteOrder,
  updateOrderStatus,
};