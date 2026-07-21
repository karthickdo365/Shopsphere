const router = require('express').Router();
const {
  checkout, verifyPayment, getMyOrders, getOrderById, getAllOrders, updateOrderStatus,
} = require('../controllers/order.controller');
const { protect, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /orders/checkout:
 *   post:
 *     summary: Create order + Razorpay order from current cart
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shippingAddress: { type: object }
 *     responses: { 201: { description: Razorpay order created } }
 */
router.post('/checkout', protect, checkout);

/**
 * @swagger
 * /orders/verify-payment:
 *   post:
 *     summary: Verify Razorpay payment signature and mark order as PAID
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razorpay_order_id: { type: string }
 *               razorpay_payment_id: { type: string }
 *               razorpay_signature: { type: string }
 *               orderId: { type: string }
 *     responses: { 200: { description: Payment verified } }
 */
router.post('/verify-payment', protect, verifyPayment);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get logged-in user's own orders
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: User's orders } }
 */
router.get('/', protect, getMyOrders);

/**
 * @swagger
 * /orders/admin/all:
 *   get:
 *     summary: Get all orders (Admin - Order List page)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: All orders } }
 */
router.get('/admin/all', protect, adminOnly, getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get single order detail
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Order detail } }
 */
router.get('/:id', protect, getOrderById);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, FAILED] }
 *     responses: { 200: { description: Order status updated } }
 */
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
