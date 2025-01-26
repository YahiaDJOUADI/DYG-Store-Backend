const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
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
          min: 1, // Ensure quantity is at least 1
        },
        price: {
          type: Number,
          required: true, // Price per product at the time of order
          min: 0, // Ensure price is non-negative
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0, // Ensure total price is non-negative
    },
    // Customer Details
    name: {
      type: String,
      required: true,
      trim: true, // Remove unnecessary whitespace
    },
    phone: {
      type: String,
      required: true,
      trim: true, // Remove unnecessary whitespace
    },
    // Algerian Address Details
    wilaya: {
      type: String,
      required: true, // Wilaya is required
      trim: true, // Remove unnecessary whitespace
    },
    address: {
      type: String,
      required: true, // Full address for delivery
      trim: true, // Remove unnecessary whitespace
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
    // Payment Status
    isPaid: {
      type: Boolean,
      default: false, // Will be updated to true once payment is received on delivery
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("Order", orderSchema);