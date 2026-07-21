const prisma = require('../config/db');

// GET /api/v1/banners (public - active banners only, ordered by position)
const getBanners = async (req, res) => {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { position: 'asc' },
  });
  res.json({ success: true, data: banners });
};

// GET /api/v1/banners/all (Admin - includes inactive)
const getAllBanners = async (req, res) => {
  const banners = await prisma.banner.findMany({ orderBy: { position: 'asc' } });
  res.json({ success: true, data: banners });
};

// POST /api/v1/banners (Admin)
const createBanner = async (req, res) => {
  const { title, image, link, position, isActive } = req.body;
  const banner = await prisma.banner.create({
    data: { title, image, link, position: position ?? 0, isActive: isActive ?? true },
  });
  res.status(201).json({ success: true, data: banner });
};

// PUT /api/v1/banners/:id (Admin)
const updateBanner = async (req, res) => {
  const banner = await prisma.banner.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: banner });
};

// DELETE /api/v1/banners/:id (Admin)
const deleteBanner = async (req, res) => {
  await prisma.banner.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Banner deleted' });
};

module.exports = { getBanners, getAllBanners, createBanner, updateBanner, deleteBanner };
