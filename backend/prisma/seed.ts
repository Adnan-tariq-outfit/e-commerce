import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
  console.log('Admin user:', adminUser.email);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: { name: 'Electronics', slug: 'electronics' },
    }),
    prisma.category.upsert({
      where: { slug: 'clothing' },
      update: {},
      create: { name: 'Clothing', slug: 'clothing' },
    }),
    prisma.category.upsert({
      where: { slug: 'home-kitchen' },
      update: {},
      create: { name: 'Home & Kitchen', slug: 'home-kitchen' },
    }),
    prisma.category.upsert({
      where: { slug: 'sports-outdoors' },
      update: {},
      create: { name: 'Sports & Outdoors', slug: 'sports-outdoors' },
    }),
    prisma.category.upsert({
      where: { slug: 'books' },
      update: {},
      create: { name: 'Books', slug: 'books' },
    }),
  ]);

  const [electronics, clothing, homeKitchen, sports, books] = categories;
  console.log('Categories created:', categories.map((c) => c.name).join(', '));

  // Products
  const products = [
    // Electronics
    {
      categoryId: electronics.id,
      name: 'Wireless Noise-Cancelling Headphones',
      description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and Hi-Res Audio support.',
      price: 79.99,
      originalPrice: 129.99,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
      tags: ['audio', 'wireless', 'noise-cancelling'],
      stockQty: 45,
    },
    {
      categoryId: electronics.id,
      name: 'Mechanical Gaming Keyboard',
      description: 'Compact TKL mechanical keyboard with RGB backlight, tactile brown switches, and USB-C connectivity.',
      price: 59.99,
      originalPrice: 89.99,
      images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600'],
      tags: ['gaming', 'keyboard', 'rgb', 'mechanical'],
      stockQty: 30,
    },
    {
      categoryId: electronics.id,
      name: '4K Portable Monitor',
      description: '15.6" 4K USB-C portable monitor with HDR support and built-in stand.',
      price: 249.99,
      originalPrice: 329.99,
      images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600'],
      tags: ['monitor', '4k', 'portable'],
      stockQty: 18,
    },
    {
      categoryId: electronics.id,
      name: 'Smart Watch Series 5',
      description: 'Fitness tracking, heart rate monitor, GPS, and 7-day battery. Water resistant to 50m.',
      price: 149.99,
      originalPrice: 199.99,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
      tags: ['smartwatch', 'fitness', 'gps'],
      stockQty: 60,
    },
    {
      categoryId: electronics.id,
      name: 'True Wireless Earbuds',
      description: 'In-ear earbuds with 6-hour playtime, charging case for 24 hours total, IPX4 water resistance.',
      price: 39.99,
      originalPrice: 59.99,
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600'],
      tags: ['earbuds', 'wireless', 'audio'],
      stockQty: 75,
    },
    // Clothing
    {
      categoryId: clothing.id,
      name: 'Classic Fit Oxford Shirt',
      description: '100% cotton Oxford weave shirt. Relaxed classic fit, button-down collar, single chest pocket.',
      price: 34.99,
      originalPrice: null,
      images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600'],
      tags: ['shirt', 'cotton', 'formal'],
      stockQty: 100,
    },
    {
      categoryId: clothing.id,
      name: 'Slim Fit Chino Trousers',
      description: 'Stretch chino trousers in slim fit. Versatile style for work or weekend.',
      price: 44.99,
      originalPrice: 59.99,
      images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600'],
      tags: ['trousers', 'chino', 'slim-fit'],
      stockQty: 80,
    },
    {
      categoryId: clothing.id,
      name: 'Merino Wool Crew Neck Jumper',
      description: 'Lightweight 100% merino wool jumper. Temperature regulating, naturally odour resistant.',
      price: 69.99,
      originalPrice: 89.99,
      images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'],
      tags: ['jumper', 'wool', 'merino'],
      stockQty: 55,
    },
    // Home & Kitchen
    {
      categoryId: homeKitchen.id,
      name: 'Pour-Over Coffee Maker Set',
      description: 'Borosilicate glass pour-over dripper with gooseneck kettle and 40 paper filters included.',
      price: 42.99,
      originalPrice: 54.99,
      images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600'],
      tags: ['coffee', 'kitchen', 'brewing'],
      stockQty: 40,
    },
    {
      categoryId: homeKitchen.id,
      name: 'Stainless Steel Cookware Set (5pc)',
      description: 'Tri-ply stainless steel set: 20cm saucepan, 24cm frying pan, 28cm sauté pan with lids.',
      price: 119.99,
      originalPrice: 179.99,
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'],
      tags: ['cookware', 'stainless-steel', 'kitchen'],
      stockQty: 25,
    },
    {
      categoryId: homeKitchen.id,
      name: 'Bamboo Cutting Board Set (3pc)',
      description: 'Eco-friendly bamboo cutting boards in three sizes. Juice groove and non-slip feet.',
      price: 24.99,
      originalPrice: null,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
      tags: ['cutting-board', 'bamboo', 'kitchen'],
      stockQty: 90,
    },
    // Sports & Outdoors
    {
      categoryId: sports.id,
      name: 'Adjustable Dumbbell Set (2-24kg)',
      description: 'Space-saving adjustable dumbbells. Dial selector adjusts weight in 2kg increments up to 24kg each.',
      price: 189.99,
      originalPrice: 249.99,
      images: ['https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600'],
      tags: ['dumbbells', 'weights', 'fitness'],
      stockQty: 20,
    },
    {
      categoryId: sports.id,
      name: 'Foam Yoga Mat (6mm)',
      description: 'Thick 6mm non-slip yoga mat with alignment lines. Includes carrying strap.',
      price: 29.99,
      originalPrice: 39.99,
      images: ['https://images.unsplash.com/photo-1601925228108-67d8dfc6c61c?w=600'],
      tags: ['yoga', 'fitness', 'mat'],
      stockQty: 120,
    },
    {
      categoryId: sports.id,
      name: 'Trail Running Shoes',
      description: 'Lightweight trail running shoes with Vibram outsole. Waterproof GTX membrane.',
      price: 89.99,
      originalPrice: 119.99,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
      tags: ['shoes', 'running', 'trail'],
      stockQty: 35,
    },
    // Books
    {
      categoryId: books.id,
      name: 'Clean Code by Robert C. Martin',
      description: 'A handbook of agile software craftsmanship. Essential reading for every developer.',
      price: 29.99,
      originalPrice: null,
      images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'],
      tags: ['programming', 'software', 'best-seller'],
      stockQty: 50,
    },
    {
      categoryId: books.id,
      name: 'Designing Data-Intensive Applications',
      description: 'The big ideas behind reliable, scalable, and maintainable systems. By Martin Kleppmann.',
      price: 39.99,
      originalPrice: 49.99,
      images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'],
      tags: ['databases', 'systems', 'engineering'],
      stockQty: 40,
    },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p as any });
  }

  console.log(`${products.length} products created.`);
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
