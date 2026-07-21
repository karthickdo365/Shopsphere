const slugify = require('slugify');
const prisma = require('../config/db');

// GET /api/v1/products
// Supports: ?category=slug&subCategory=slug&search=&newArrivals=true&minPrice=&maxPrice=&page=&limit=
const getProducts = async (req, res) => {
  const {
    category,
    subCategory,
    search,
    newArrivals,
    featured,
    minPrice,
    maxPrice,
    page = 1,
    limit = 12,
  } = req.query;

  const where = {
    ...(category && { category: { slug: category } }),
    ...(subCategory && { subCategory: { slug: subCategory } }),
    ...(search && { name: { contains: search, mode: 'insensitive' } }),
    ...(newArrivals === 'true' && { isNewArrival: true }),
    ...(featured === 'true' && { isFeatured: true }),
    ...((minPrice || maxPrice) && {
      price: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      },
    }),
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, subCategory: true },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  });
};

// GET /api/v1/products/:slug
const getProductBySlug = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: {
      category: true,
      subCategory: true,
      reviews: { include: { user: { select: { name: true } } } },
    },
  });

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
};

// POST /api/v1/products (Admin)
const createProduct = async (req, res) => {
  const {
    name, description, price, discountPrice, stock, brand,
    images, categoryId, subCategoryId, isNewArrival, isFeatured,
  } = req.body;

  const slug = slugify(name, { lower: true, strict: true });

  const product = await prisma.product.create({
    data: {
      name, slug, description, price, discountPrice, stock, brand,
      images: images || [],
      categoryId, subCategoryId,
      isNewArrival: !!isNewArrival,
      isFeatured: !!isFeatured,
    },
  });

  res.status(201).json({ success: true, data: product });
};

// PUT /api/v1/products/:id (Admin)
const updateProduct = async (req, res) => {
  const data = { ...req.body };
  if (data.name) data.slug = slugify(data.name, { lower: true, strict: true });

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data,
  });
  res.json({ success: true, data: product });
};

// DELETE /api/v1/products/:id (Admin)
const deleteProduct = async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Product deleted' });
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
