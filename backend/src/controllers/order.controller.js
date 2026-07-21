const crypto = require('crypto');
const prisma = require('../config/db');
const razorpay = require('../config/razorpay');

// STEP 1 — POST /api/v1/orders/checkout
// Creates a PENDING order in our DB + a Razorpay order. Frontend uses the
// razorpayOrderId to open the Razorpay Checkout widget.
const checkout = async (req, res) => {
  const { shippingAddress } = req.body;
  const userId = req.user.id;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = item.product.discountPrice ?? item.product.price;
    return sum + Number(price) * item.quantity;
  }, 0);

  // Razorpay expects amount in the smallest currency unit (paise for INR)
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(totalAmount * 100),
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  });

  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      shippingAddress,
      razorpayOrderId: razorpayOrder.id,
      status: 'PENDING',
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          price: item.product.discountPrice ?? item.product.price,
        })),
      },
    },
    include: { items: true },
  });

  res.status(201).json({
    success: true,
    data: {
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // safe to expose - it's the public key
    },
  });
};

// STEP 2 — POST /api/v1/orders/verify-payment
// Called by frontend after Razorpay checkout succeeds, with the payment
// details returned by the Razorpay widget. We verify the HMAC signature
// server-side — never trust the client blindly.
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    await prisma.order.update({ where: { id: orderId }, data: { status: 'FAILED' } });
    return res.status(400).json({ success: false, message: 'Payment verification failed' });
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'PAID',
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    },
  });

  // Decrement stock for each item, then empty the cart
  const items = await prisma.orderItem.findMany({ where: { orderId } });
  await Promise.all(
    items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    )
  );
  await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });

  res.json({ success: true, message: 'Payment verified', data: order });
};

// GET /api/v1/orders  (logged-in user's own orders)
const getMyOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: orders });
};

// GET /api/v1/orders/:id
const getOrderById = async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: { include: { product: true } }, user: { select: { name: true, email: true } } },
  });
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, data: order });
};

// GET /api/v1/orders/admin/all (Admin - Order List page)
const getAllOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } }, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: orders });
};

// PUT /api/v1/orders/:id/status (Admin - update order status)
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { status } });
  res.json({ success: true, data: order });
};

module.exports = {
  checkout,
  verifyPayment,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
