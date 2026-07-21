const router = require('express').Router();
const {
  getCart, addToCart, updateCartItem, removeCartItem, clearCart,
} = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get logged-in user's cart
 *     tags: [Cart]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Cart items } }
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 201: { description: Item added } }
 *   delete:
 *     summary: Clear entire cart
 *     tags: [Cart]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Cart cleared } }
 */
router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.delete('/', protect, clearCart);

/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Updated } }
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Removed } }
 */
router.put('/:id', protect, updateCartItem);
router.delete('/:id', protect, removeCartItem);

module.exports = router;
