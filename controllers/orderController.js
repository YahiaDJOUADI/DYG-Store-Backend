const Order = require("../models/Order");
const Product = require("../models/Product");
const orderResource = require("../recourses/orderResource");

// Create a new order for authenticated users
const createOrderForUser = async (req, res, next) => {
  const { userId, wilaya, products, name, phone, address } = req.body;

  try {
    let totalPrice = 0;

    // Check product stock, update quantities, and calculate total price
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

      // Calculate total price
      totalPrice += foundProduct.price * product.quantity;
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
      user: userId,
    });

    await order.save();

    // Return success response
    res.status(201).json({
      message: "Order created successfully!",
      order: orderResource(order),
    });
  } catch (error) {
    next(error);
  }
};

// Create a new order for guest users
const createOrderForGuest = async (req, res, next) => {
  const { wilaya, products, name, phone, address } = req.body;

  try {
    let totalPrice = 0;

    // Check product stock, update quantities, and calculate total price
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

      // Calculate total price
      totalPrice += foundProduct.price * product.quantity;
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
      user: null, // No user ID for guest orders
    });

    await order.save();

    // Return success response
    res.status(201).json({
      message: "Order created successfully!",
      order: orderResource(order),
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders (for both authenticated and guest users)
const getOrders = async (req, res, next) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find({}).populate('products.productId');
    res.status(200).json(orders.map(order => orderResource(order)));
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
    }).populate('products.productId');

    res.status(200).json(orders.map(order => orderResource(order)));
  } catch (error) {
    next(error);
  }
};

// Get a single order by ID with product details populated
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.productId');
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.status(200).json(orderResource(order));
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
    ).populate('products.productId');

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Order status updated!", order: orderResource(updatedOrder) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrderForUser,
  createOrderForGuest,
  getOrders,
  getUserOrders,
  getOrder,
  deleteOrder,
  updateOrderStatus,
};