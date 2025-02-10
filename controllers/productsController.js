const Product = require("../models/Product");
const productResource = require("../recourses/productResource")

// Get all products (with filters and sorting)
exports.getProducts = async (req, res, next) => {
  try {
    const filters = {};

    // Filter by category
    if (req.query.category) {
      filters.category = req.query.category;
    }

    // Filter by name (case-insensitive search)
    if (req.query.name) {
      filters.name = { $regex: `.*${req.query.name}.*`, $options: "i" };
    }

    // Sorting
    const sort = {};
    if (req.query.sortBy && req.query.sortDirection) {
      sort[req.query.sortBy] = parseInt(req.query.sortDirection);
    }

    // Fetch products with filters and sorting
    const products = await Product.find(filters).sort(sort);
    res.status(200).json(products.map((product) => productResource(product)));
  } catch (error) {
    next(error);
  }
};

// Get a product by ID
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(productResource(product));
  } catch (error) {
    next(error);
  }
};

// Add a new product
exports.createProduct = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(422).json({ message: "The image is required." });
    }

    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      image: req.file.path,
      description: req.body.description,
      stock: req.body.stock, 
      category: req.body.category,
      brand: req.body.brand,
      platforms: req.body.platforms,
    });

    res.status(201).json(productResource(product));
  } catch (error) {
    next(error);
  }
};

// Update a product by ID
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const updateData = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      stock: req.body.stock, 
      category: req.body.category,
      brand: req.body.brand,
      platforms: req.body.platforms,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } 
    );

    res.status(200).json(productResource(updatedProduct));
  } catch (error) {
    next(error);
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    next(error);
  }
};