const slugify = require('slugify');
const prisma = require('../config/db');

// GET /api/v1/categories (with nested subcategories - for header/nav menu)
const getCategories = async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { subCategories: true },
    orderBy: { name: 'asc' },
  });
  res.json({ success: true, data: categories });
};

// POST /api/v1/categories (Admin)
const createCategory = async (req, res) => {
  const { name, image } = req.body;
  const slug = slugify(name, { lower: true, strict: true });
  const category = await prisma.category.create({ data: { name, slug, image } });
  res.status(201).json({ success: true, data: category });
};

// PUT /api/v1/categories/:id (Admin)
const updateCategory = async (req, res) => {
  const data = { ...req.body };
  if (data.name) data.slug = slugify(data.name, { lower: true, strict: true });
  const category = await prisma.category.update({ where: { id: req.params.id }, data });
  res.json({ success: true, data: category });
};

// DELETE /api/v1/categories/:id (Admin)
const deleteCategory = async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Category deleted' });
};

// POST /api/v1/categories/:categoryId/subcategories (Admin)
const createSubCategory = async (req, res) => {
  const { name, image } = req.body;
  const slug = slugify(name, { lower: true, strict: true });
  const subCategory = await prisma.subCategory.create({
    data: { name, slug, image, categoryId: req.params.categoryId },
  });
  res.status(201).json({ success: true, data: subCategory });
};

// DELETE /api/v1/subcategories/:id (Admin)
const deleteSubCategory = async (req, res) => {
  await prisma.subCategory.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'SubCategory deleted' });
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  deleteSubCategory,
};
