const router = require('express').Router();
const multer = require('multer');
const upload = require('../config/upload');
const { uploadImage, uploadImages } = require('../controllers/upload.controller');
const { protect, adminOnly } = require('../middleware/auth');

// Wraps multer so file-type/size errors come back as normal JSON, not a stack trace
const handleUpload = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a single image (Admin only) - used for product/category/banner images
 *     tags: [Upload]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201: { description: Returns the public URL of the uploaded image }
 */
router.post('/', protect, adminOnly, handleUpload(upload.single('image')), uploadImage);

/**
 * @swagger
 * /upload/multiple:
 *   post:
 *     summary: Upload multiple images at once (Admin only) - used for product galleries
 *     tags: [Upload]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items: { type: string, format: binary }
 *     responses:
 *       201: { description: Returns an array of public URLs }
 */
router.post('/multiple', protect, adminOnly, handleUpload(upload.array('images', 6)), uploadImages);

module.exports = router;
