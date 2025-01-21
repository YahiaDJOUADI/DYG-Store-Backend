const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Optional for guest orders
  },
  sessionId: {
    type: String,
    required: false, // For guest orders
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true, // Price per product at the time of order
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  // Customer Details
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  // Algerian Address Details
  wilaya: {
    type: String,
    required: true, // Wilaya is required
  },
  address: {
    type: String,
    required: true, // Full address for delivery
  },
  // Order Status
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  // Order Dates
  orderDate: {
    type: Date,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
    required: false, // Will be updated once the order is shipped
  },
  // Cash on Delivery (COD) Specific
  isPaid: {
    type: Boolean,
    default: false, // Will be updated to true once payment is received on delivery
  },
});

module.exports = mongoose.model("Order", orderSchema);