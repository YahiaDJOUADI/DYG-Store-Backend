const express = require("express");
const multer = require("multer");
const productsController = require("../controllers/productsController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const upload = multer({ dest: "./public/uploads" });

// Define routes for products
router.get("/products", productsController.getProducts); // Get all products
router.post(
  "/products",
  authMiddleware,
  upload.single("image"), 
  productsController.addProduct // Add a new product
);
router.get("/products/:id", productsController.getProduct); // Get a single product by ID
router.put(
  "/products/:id",
  authMiddleware, 
  upload.single("image"), 
  productsController.updateProduct // Update product details
);
router.delete(
  "/products/:id",
  authMiddleware, 
  productsController.deleteProduct // Delete a product
);

module.exports = router;
