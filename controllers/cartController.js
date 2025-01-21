const Cart = require("../models/Cart");
const GuestCart = require("../models/GuestCart");

// Helper function to get the appropriate cart
const getCartByType = async (req) => {
  if (req.cartType === "user") {
    return Cart.findOne({ user: req.user._id });
  } else {
    return GuestCart.findOne({ sessionId: req.guestCartId });
  }
};

// Helper function to create a new cart
const createNewCart = (req) => {
  if (req.cartType === "user") {
    return new Cart({ user: req.user._id, products: [] });
  } else {
    return new GuestCart({ sessionId: req.guestCartId, products: [] });
  }
};

// Fetch the cart
const getCart = async (req, res) => {
  try {
    const cart = await getCartByType(req);
    if (cart) {
      await cart.populate("products.product");
    }
    res.json(cart || { products: [] });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// Add or update a product in the cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid product or quantity" });
  }

  try {
    let cart = await getCartByType(req);
    if (!cart) {
      cart = createNewCart(req);
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex >= 0) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate("products.product");
    res.status(200).json(cart);
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Failed to add product to cart" });
  }
};

// Remove a product from the cart
const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const cart = await getCartByType(req);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );
    await cart.save();
    await cart.populate("products.product");
    res.status(200).json(cart);
  } catch (err) {
    console.error("Error removing product from cart:", err);
    res.status(500).json({ message: "Failed to remove product from cart" });
  }
};

// Update the quantity of a specific product in the cart
const updateCartItemQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined || quantity < 0) {
    return res.status(400).json({ message: "Invalid product or quantity" });
  }

  try {
    const cart = await getCartByType(req);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex >= 0) {
      if (quantity === 0) {
        cart.products.splice(productIndex, 1);
      } else {
        cart.products[productIndex].quantity = quantity;
      }
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    await cart.save();
    await cart.populate("products.product");
    res.status(200).json(cart);
  } catch (err) {
    console.error("Error updating cart item quantity:", err);
    res.status(500).json({ message: "Failed to update cart item quantity" });
  }
};

// Clear the cart
const clearCart = async (req, res) => {
  try {
    if (req.cartType === "user") {
      await Cart.findOneAndDelete({ user: req.user._id });
    } else {
      await GuestCart.findOneAndDelete({ sessionId: req.guestCartId });
    }
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
};
