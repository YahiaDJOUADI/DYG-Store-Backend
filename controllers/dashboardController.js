const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Message = require('../models/Message');

// Get counts of all data
exports.getAllDataCounts = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const messageCount = await Message.countDocuments();

    res.status(200).json({
      userCount,
      productCount,
      orderCount,
      messageCount
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data counts" });
  }
};