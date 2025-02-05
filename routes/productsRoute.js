const express = require("express");
const multer = require("multer");
const productController = require("../controllers/productsController");
const validationMiddleware = require("../middlewares/validationMiddleware");
const validObjectIdMiddleware = require("../middlewares/validObjectIdMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validations/productValidation");
const adminMiddleware = require("../middlewares/adminMiddelware");

const router = express.Router();
const upload = multer({ dest: "./public/uploads" });

router.get("/products", productController.getProducts);

router.post(
  "/products",
  authMiddleware,adminMiddleware,
  upload.single("image"),
  validationMiddleware(createProductSchema),
  productController.createProduct
);

router.get(
  "/products/:id",
  validObjectIdMiddleware,
  productController.getProduct
);

router.put(
  "/products/:id",
  authMiddleware,adminMiddleware,
  validObjectIdMiddleware,
  upload.single("image"),
  validationMiddleware(updateProductSchema),
  productController.updateProduct
);

router.delete(
  "/products/:id",
  authMiddleware,adminMiddleware,
  validObjectIdMiddleware,
  productController.deleteProduct
);

module.exports = router;
