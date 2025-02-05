const Wishlist = require('../models/Wishlist');

// Add product to wishlist
const addToWishlist = async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    let wishlist = await Wishlist.findOne({ user: userId });

    // Create wishlist if it doesn't exist
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    // Check if product already exists in wishlist
    if (wishlist.items.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add product to wishlist
    wishlist.items.push(productId);
    await wishlist.save();

    res.status(201).json({ message: 'Product added to wishlist', wishlist });
  } catch (error) {
    next(error);
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Remove product from wishlist
    wishlist.items = wishlist.items.filter(item => item.toString() !== productId);
    await wishlist.save();

    res.status(200).json({ message: 'Product removed from wishlist', wishlist });
  } catch (error) {
    next(error);
  }
};

// Get user's wishlist
const getWishlist = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate('items');

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json({ wishlist });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};