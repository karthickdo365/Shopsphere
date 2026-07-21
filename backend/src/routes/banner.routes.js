const router = require('express').Router();
const {
  getBanners, getAllBanners, createBanner, updateBanner, deleteBanner,
} = require('../controllers/banner.controller');
const { protect, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /banners:
 *   get:
 *     summary: Get active banners for homepage
 *     tags: [Banners]
 *     responses: { 200: { description: List of active banners } }
 *   post:
 *     summary: Create banner (Admin only)
 *     tags: [Banners]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 201: { description: Banner created } }
 */
router.get('/', getBanners);
router.post('/', protect, adminOnly, createBanner);

/**
 * @swagger
 * /banners/all:
 *   get:
 *     summary: Get all banners including inactive (Admin only)
 *     tags: [Banners]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: All banners } }
 */
router.get('/all', protect, adminOnly, getAllBanners);

/**
 * @swagger
 * /banners/{id}:
 *   put:
 *     summary: Update banner (Admin only)
 *     tags: [Banners]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Updated } }
 *   delete:
 *     summary: Delete banner (Admin only)
 *     tags: [Banners]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Deleted } }
 */
router.put('/:id', protect, adminOnly, updateBanner);
router.delete('/:id', protect, adminOnly, deleteBanner);

module.exports = router;
