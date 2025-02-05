const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); 
const wishlistController = require('../controllers/wishlistController');

// Add product to wishlist
router.post('/wishlist/add', authMiddleware, wishlistController.addToWishlist);

// Remove product from wishlist
router.delete('/wishlist/remove/:productId', authMiddleware, wishlistController.removeFromWishlist);

// Get user's wishlist
router.get('/wishlist', authMiddleware, wishlistController.getWishlist);

module.exports = router;