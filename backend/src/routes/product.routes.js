const router = require('express').Router();
const {
  getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct,
} = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /products:
 *   get:
 *     summary: List products (supports category/subCategory/search/newArrivals filters)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: subCategory
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: newArrivals
 *         schema: { type: boolean }
 *     responses:
 *       200: { description: List of products }
 */
router.get('/', getProducts);

/**
 * @swagger
 * /products/{slug}:
 *   get:
 *     summary: Get single product by slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Product detail }
 *       404: { description: Not found }
 */
router.get('/:slug', getProductBySlug);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create product (Admin only)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Product created }
 */
router.post('/', protect, adminOnly, createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product (Admin only)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Product updated }
 */
router.put('/:id', protect, adminOnly, updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product (Admin only)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Product deleted }
 */
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
