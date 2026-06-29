const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean up in reverse dependency order
  await prisma.productView.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);

  await prisma.user.createMany({
    data: [
      {
        name: 'Admin',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: customerPassword,
        role: 'CUSTOMER',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: customerPassword,
        role: 'CUSTOMER',
      },
    ],
  });
  console.log('  Seeded 3 users');

  // Categories
  await prisma.category.createMany({
    data: [
      { name: 'Electronics', slug: 'electronics' },
      { name: 'Clothing', slug: 'clothing' },
      { name: 'Books', slug: 'books' },
      { name: 'Home & Kitchen', slug: 'home-kitchen' },
      { name: 'Sports', slug: 'sports' },
    ],
  });

  const categories = await prisma.category.findMany();
  const cat = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
  console.log('  Seeded 5 categories');

  // Products
  await prisma.product.createMany({
    data: [
      // Electronics
      {
        categoryId: cat['electronics'],
        name: 'iPhone 15',
        description:
          'Apple iPhone 15 with 6.1-inch Super Retina XDR display, A16 Bionic chip, and 48MP camera system.',
        price: 799.99,
        originalPrice: 899.99,
        images: ['https://placehold.co/400x400?text=iPhone+15'],
        tags: ['apple', 'smartphone', 'ios'],
        stockQty: 50,
      },
      {
        categoryId: cat['electronics'],
        name: 'Samsung 55" 4K Smart TV',
        description:
          'Samsung Crystal UHD 4K Smart TV with built-in Alexa, HDR, and 120Hz refresh rate.',
        price: 549.99,
        originalPrice: 699.99,
        images: ['https://placehold.co/400x400?text=Samsung+TV'],
        tags: ['samsung', 'tv', '4k', 'smart-tv'],
        stockQty: 20,
      },
      {
        categoryId: cat['electronics'],
        name: 'Sony WH-1000XM5 Headphones',
        description:
          'Industry-leading noise cancelling headphones with up to 30-hour battery life and multipoint connection.',
        price: 279.99,
        originalPrice: 349.99,
        images: ['https://placehold.co/400x400?text=Sony+Headphones'],
        tags: ['sony', 'headphones', 'noise-cancelling', 'wireless'],
        stockQty: 75,
      },

      // Clothing
      {
        categoryId: cat['clothing'],
        name: "Men's Classic Hoodie",
        description:
          'Soft cotton blend pullover hoodie with kangaroo pocket and drawstring hood. Available in multiple colors.',
        price: 39.99,
        originalPrice: 59.99,
        images: ['https://placehold.co/400x400?text=Mens+Hoodie'],
        tags: ['men', 'hoodie', 'casual', 'cotton'],
        stockQty: 120,
      },
      {
        categoryId: cat['clothing'],
        name: "Women's Puffer Jacket",
        description:
          'Lightweight and warm puffer jacket with water-resistant shell and zip pockets.',
        price: 89.99,
        originalPrice: 129.99,
        images: ['https://placehold.co/400x400?text=Womens+Jacket'],
        tags: ['women', 'jacket', 'winter', 'puffer'],
        stockQty: 60,
      },
      {
        categoryId: cat['clothing'],
        name: 'Running Sneakers',
        description:
          'Lightweight mesh running shoes with responsive foam cushioning and breathable upper.',
        price: 64.99,
        originalPrice: 89.99,
        images: ['https://placehold.co/400x400?text=Sneakers'],
        tags: ['shoes', 'running', 'unisex', 'athletic'],
        stockQty: 90,
      },

      // Books
      {
        categoryId: cat['books'],
        name: 'Clean Code',
        description:
          'A handbook of agile software craftsmanship by Robert C. Martin. Learn to write clean, maintainable code.',
        price: 34.99,
        originalPrice: 44.99,
        images: ['https://placehold.co/400x400?text=Clean+Code'],
        tags: ['programming', 'software-engineering', 'best-practices'],
        stockQty: 200,
      },
      {
        categoryId: cat['books'],
        name: 'The Pragmatic Programmer',
        description:
          'Your journey to mastery — timeless lessons for software developers by David Thomas and Andrew Hunt.',
        price: 39.99,
        originalPrice: 49.99,
        images: ['https://placehold.co/400x400?text=Pragmatic+Programmer'],
        tags: ['programming', 'career', 'software-engineering'],
        stockQty: 150,
      },
      {
        categoryId: cat['books'],
        name: 'Atomic Habits',
        description:
          'An easy and proven way to build good habits and break bad ones by James Clear.',
        price: 16.99,
        originalPrice: 24.99,
        images: ['https://placehold.co/400x400?text=Atomic+Habits'],
        tags: ['self-help', 'habits', 'productivity'],
        stockQty: 300,
      },

      // Home & Kitchen
      {
        categoryId: cat['home-kitchen'],
        name: 'Instant Vortex Air Fryer 6QT',
        description:
          'Large capacity air fryer with 6 one-touch programs. Fries, roasts, broils, and dehydrates.',
        price: 79.99,
        originalPrice: 99.99,
        images: ['https://placehold.co/400x400?text=Air+Fryer'],
        tags: ['kitchen', 'cooking', 'air-fryer', 'healthy'],
        stockQty: 45,
      },
      {
        categoryId: cat['home-kitchen'],
        name: 'Breville Coffee Maker',
        description:
          'Programmable 12-cup coffee maker with thermal carafe, brew-strength control, and keep-warm function.',
        price: 129.99,
        originalPrice: 179.99,
        images: ['https://placehold.co/400x400?text=Coffee+Maker'],
        tags: ['kitchen', 'coffee', 'breville', 'appliance'],
        stockQty: 35,
      },
      {
        categoryId: cat['home-kitchen'],
        name: 'Ninja Professional Blender',
        description:
          '1000-watt blender with XL 72oz pitcher, crush ice technology, and dishwasher-safe parts.',
        price: 69.99,
        originalPrice: 89.99,
        images: ['https://placehold.co/400x400?text=Blender'],
        tags: ['kitchen', 'blender', 'ninja', 'smoothies'],
        stockQty: 55,
      },

      // Sports
      {
        categoryId: cat['sports'],
        name: 'Premium Yoga Mat',
        description:
          'Extra thick 6mm non-slip yoga mat with alignment lines. Ideal for yoga, Pilates, and floor workouts.',
        price: 29.99,
        originalPrice: 39.99,
        images: ['https://placehold.co/400x400?text=Yoga+Mat'],
        tags: ['yoga', 'fitness', 'mat', 'exercise'],
        stockQty: 100,
      },
      {
        categoryId: cat['sports'],
        name: 'Adjustable Dumbbell Set (5–52 lbs)',
        description:
          'Space-saving adjustable dumbbells that replace 15 sets of weights. Quick-change dial from 5 to 52 lbs.',
        price: 299.99,
        originalPrice: 399.99,
        images: ['https://placehold.co/400x400?text=Dumbbells'],
        tags: ['weights', 'fitness', 'strength', 'home-gym'],
        stockQty: 30,
      },
      {
        categoryId: cat['sports'],
        name: 'Jump Rope — Speed Cable',
        description:
          'Professional speed jump rope with ball-bearing handles and adjustable steel cable. Perfect for cardio.',
        price: 14.99,
        originalPrice: 19.99,
        images: ['https://placehold.co/400x400?text=Jump+Rope'],
        tags: ['cardio', 'jump-rope', 'fitness', 'portable'],
        stockQty: 200,
      },
    ],
  });
  console.log('  Seeded 15 products');

  // ProductViews — link john@example.com to 3 Electronics products
  const john = await prisma.user.findUnique({ where: { email: 'john@example.com' } });
  const electronicsProducts = await prisma.product.findMany({
    where: { category: { slug: 'electronics' } },
    take: 3,
  });

  await prisma.productView.createMany({
    data: electronicsProducts.map((p) => ({
      userId: john.id,
      productId: p.id,
    })),
  });
  console.log('  Seeded 3 product views');

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
