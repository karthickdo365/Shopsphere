const prisma = require('../config/db');

// GET /api/v1/wishlist
const getWishlist = async (req, res) => {
  const items = await prisma.wishlist.findMany({
    where: { userId: req.user.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: items });
};

// POST /api/v1/wishlist  { productId }
const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const item = await prisma.wishlist.upsert({
    where: { userId_productId: { userId: req.user.id, productId } },
    update: {},
    create: { userId: req.user.id, productId },
  });
  res.status(201).json({ success: true, data: item });
};

// DELETE /api/v1/wishlist/:productId
const removeFromWishlist = async (req, res) => {
  await prisma.wishlist.delete({
    where: { userId_productId: { userId: req.user.id, productId: req.params.productId } },
  });
  res.json({ success: true, message: 'Removed from wishlist' });
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
