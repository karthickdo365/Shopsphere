const router = require('express').Router();
const {
  getWishlist, addToWishlist, removeFromWishlist,
} = require('../controllers/wishlist.controller');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get logged-in user's wishlist (liked products)
 *     tags: [Wishlist]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Wishlist items } }
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Wishlist]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 201: { description: Added to wishlist } }
 */
router.get('/', protect, getWishlist);
router.post('/', protect, addToWishlist);

/**
 * @swagger
 * /wishlist/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Wishlist]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Removed } }
 */
router.delete('/:productId', protect, removeFromWishlist);

module.exports = router;
