const router = require('express').Router();
const {
  getCategories, createCategory, updateCategory, deleteCategory,
  createSubCategory, deleteSubCategory,
} = require('../controllers/category.controller');
const { protect, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: List all categories with nested subcategories (for header/nav)
 *     tags: [Categories]
 *     responses:
 *       200: { description: List of categories }
 *   post:
 *     summary: Create category (Admin only)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Category created }
 */
router.get('/', getCategories);
router.post('/', protect, adminOnly, createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update category (Admin only)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Updated } }
 *   delete:
 *     summary: Delete category (Admin only)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Deleted } }
 */
router.put('/:id', protect, adminOnly, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

/**
 * @swagger
 * /categories/{categoryId}/subcategories:
 *   post:
 *     summary: Create subcategory under a category (Admin only)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 201: { description: SubCategory created } }
 */
router.post('/:categoryId/subcategories', protect, adminOnly, createSubCategory);

/**
 * @swagger
 * /categories/subcategories/{id}:
 *   delete:
 *     summary: Delete subcategory (Admin only)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Deleted } }
 */
router.delete('/subcategories/:id', protect, adminOnly, deleteSubCategory);

module.exports = router;
