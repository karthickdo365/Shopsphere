const prisma = require('../config/db');

// GET /api/v1/cart
const getCart = async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: items });
};

// POST /api/v1/cart  { productId, quantity, size }
const addToCart = async (req, res) => {
  const { productId, quantity = 1, size } = req.body;

  const item = await prisma.cartItem.upsert({
    where: { userId_productId_size: { userId: req.user.id, productId, size: size ?? null } },
    update: { quantity: { increment: quantity } },
    create: { userId: req.user.id, productId, quantity, size },
  });

  res.status(201).json({ success: true, data: item });
};

// PUT /api/v1/cart/:id  { quantity }
const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const item = await prisma.cartItem.update({
    where: { id: req.params.id },
    data: { quantity },
  });
  res.json({ success: true, data: item });
};

// DELETE /api/v1/cart/:id
const removeCartItem = async (req, res) => {
  await prisma.cartItem.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Removed from cart' });
};

// DELETE /api/v1/cart  (clear cart, used after order placed)
const clearCart = async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
  res.json({ success: true, message: 'Cart cleared' });
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
