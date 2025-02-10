const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, 
  },
  stock: {
    type: Number,
    required: true,
    min: 0, 
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ["Video Games", "Gaming Gear", "Subscriptions"], // Ensure valid categories
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, 
    required: true,
  },
  platforms: {
    type: [String], 
    enum: ["PS5", "PS4", "Xbox Series X/S", "PC"],
    default: undefined, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to enforce platform selection only for video games
productSchema.pre("save", function (next) {
  if (this.category === "Video Games" && (!this.platforms || this.platforms.length === 0)) {
    return next(new Error("Platforms must be specified for Video Games"));
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
