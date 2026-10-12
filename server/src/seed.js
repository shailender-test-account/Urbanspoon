import 'dotenv/config';
import { pathToFileURL } from 'url';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User, { ROLES } from './models/User.js';
import MenuItem from './models/MenuItem.js';

const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=80`;

export const menu = [
  { name: 'Cheesy Beef Burger', description: 'Double patty, cheddar, house sauce', category: 'chicken', price: 8.99, image: U('photo-1568901346375-23c9450c58cd'), portion: 'regular', dietary: ['spicy'], rating: 4.7, reviews: 86, popularity: 90, prepTime: '12-15 min', badge: 'NEW' },
  { name: 'Pepperoni Supreme', description: 'Loaded pepperoni, mozzarella, basil', category: 'pizza', price: 12.49, image: U('photo-1590947132387-155cc02f3212'), portion: 'large', dietary: ['spicy'], rating: 4.8, reviews: 64, popularity: 95, prepTime: '18-22 min', badge: 'NEW' },
  { name: 'Crispy Wing Box', description: '8pc spicy buffalo wings, ranch dip', category: 'chicken', price: 9.99, image: U('photo-1562967914-608f82629710'), portion: 'family', dietary: ['spicy'], rating: 4.6, reviews: 102, popularity: 88, prepTime: '15-18 min' },
  { name: 'Cold Brew Cooler', description: 'Iced cold brew, vanilla foam', category: 'drinks', price: 4.49, image: U('photo-1461023058943-07fcbe16d735'), portion: 'regular', dietary: ['vegan'], rating: 4.9, reviews: 41, popularity: 92, prepTime: '5-8 min' },
  { name: 'Classic Cheeseburger', description: 'Beef patty, cheddar, pickles', category: 'chicken', price: 7.49, image: U('photo-1550547660-d9450f859349'), portion: 'regular', dietary: ['gluten-free'], rating: 4.8, reviews: 412, popularity: 99, prepTime: '12-15 min', badge: 'BESTSELLER' },
  { name: 'Margherita Pizza', description: 'San Marzano tomato, fresh mozzarella', category: 'pizza', price: 11.99, image: U('photo-1574071318508-1cdbab80d002'), portion: 'large', dietary: ['vegetarian'], rating: 4.7, reviews: 289, popularity: 85, prepTime: '20-25 min' },
  { name: 'Loaded Fries', description: 'Cheese sauce, bacon bits, jalapeños', category: 'sides', price: 6.49, image: U('photo-1573080496219-bb080dd4f877'), portion: 'family', dietary: ['spicy'], rating: 4.6, reviews: 198, popularity: 80, prepTime: '10-12 min' },
  { name: 'Chocolate Shake', description: 'Rich chocolate, whipped cream', category: 'desserts', price: 5.49, image: U('photo-1572490122747-3968b75cc699'), portion: 'regular', dietary: ['vegetarian'], rating: 4.9, reviews: 156, popularity: 87, prepTime: '5-8 min' },
  { name: 'Crispy Chicken Sandwich', description: 'Fried chicken, lettuce, mayo', category: 'chicken', price: 8.99, image: U('photo-1606755962773-d324e0a13086'), portion: 'regular', dietary: ['spicy'], rating: 4.7, reviews: 220, popularity: 83, prepTime: '12-15 min' },
  { name: 'Club Sandwich', description: 'Triple decker, turkey, bacon, egg', category: 'sides', price: 7.99, image: U('photo-1528735602780-2552fd46c7af'), portion: 'regular', dietary: ['vegetarian'], rating: 4.5, reviews: 188, popularity: 75, prepTime: '10-12 min' },
  { name: 'Garlic Breadsticks', description: 'Buttery garlic, parmesan, herbs', category: 'sides', price: 4.99, image: U('photo-1541745537411-b8046dc6d66c'), portion: 'family', dietary: ['vegetarian'], rating: 4.8, reviews: 145, popularity: 78, prepTime: '8-10 min', badge: 'TRENDING' },
  { name: 'Mango Smoothie', description: 'Fresh mango, yogurt, honey', category: 'drinks', price: 5.99, image: U('photo-1546173159-315724a31696'), portion: 'regular', dietary: ['vegan'], rating: 4.9, reviews: 132, popularity: 85, prepTime: '5-8 min' },
];

/**
 * Inserts menu + admin. Assumes mongoose is ALREADY connected and
 * NEVER closes the connection, so it is safe to call from server.js.
 * @param {{ reset?: boolean }} opts reset=true wipes and re-inserts the menu
 */
export const seedDatabase = async ({ reset = false } = {}) => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('seedDatabase() called before MongoDB is connected');
  }

  const count = await MenuItem.countDocuments();
  if (reset || count === 0) {
    if (reset) await MenuItem.deleteMany({});
    await MenuItem.insertMany(menu);
    console.log(`Seeded ${menu.length} menu items`);
  } else {
    console.log(`Menu already has ${count} items, skipping`);
  }

  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@urbanspoon.com').toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin ${email} already exists`);
  } else {
    await User.create({
      name: 'Admin',
      email,
      password: process.env.SEED_ADMIN_PASSWORD || 'Admin@12345',
      role: ROLES.ADMIN,
    });
    console.log(`Admin created: ${email}`);
  }
};

// Standalone mode: `npm run seed` -> connect, wipe + seed, then close.
const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  connectDB()
    .then(() => seedDatabase({ reset: true }))
    .then(() => mongoose.connection.close())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
