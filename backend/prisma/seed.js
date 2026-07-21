require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // --- Admin user ---
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@shopsphere.com' },
    update: {},
    create: {
      name: 'ShopSphere Admin',
      email: 'admin@shopsphere.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // --- Category + SubCategory: Men > Pants ---
  const menCategory = await prisma.category.upsert({
    where: { slug: 'men' },
    update: {},
    create: { name: 'Men', slug: 'men', image: 'https://placehold.co/400x300?text=Men' },
  });

  const pantsSubCategory = await prisma.subCategory.upsert({
    where: { slug: 'pants' },
    update: {},
    create: {
      name: 'Pants',
      slug: 'pants',
      image: 'https://placehold.co/400x300?text=Pants',
      categoryId: menCategory.id,
    },
  });

  // --- Sample products under Pants ---
  await prisma.product.upsert({
    where: { slug: 'slim-fit-chino-pants' },
    update: {},
    create: {
      name: 'Slim Fit Chino Pants',
      slug: 'slim-fit-chino-pants',
      description: 'Comfortable slim-fit chino pants, perfect for casual and semi-formal wear.',
      price: 1499,
      discountPrice: 1199,
      stock: 50,
      brand: 'ShopSphere Basics',
      images: ['https://placehold.co/600x800?text=Chino+Pants'],
      categoryId: menCategory.id,
      subCategoryId: pantsSubCategory.id,
      isNewArrival: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'classic-denim-jeans' },
    update: {},
    create: {
      name: 'Classic Denim Jeans',
      slug: 'classic-denim-jeans',
      description: 'Durable classic-fit denim jeans with a timeless look.',
      price: 1999,
      stock: 30,
      brand: 'ShopSphere Denim',
      images: ['https://placehold.co/600x800?text=Denim+Jeans'],
      categoryId: menCategory.id,
      subCategoryId: pantsSubCategory.id,
      isNewArrival: true,
    },
  });

  // --- Banner ---
  await prisma.banner.create({
    data: {
      title: 'New Arrivals - Up to 30% Off',
      image: 'https://placehold.co/1600x500?text=ShopSphere+New+Arrivals',
      link: '/products?newArrivals=true',
      position: 1,
      isActive: true,
    },
  });

  console.log('✅ Seed complete. Admin login: admin@shopsphere.com / Admin@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
