import dotenv from "dotenv";
import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';
import { seedDatabase } from './seed.js';


dotenv.config(
  {
    path:'./.env.example'
  }
)



const required = ['MONGO_URI', 'JWT_SECRET'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  // Auto-seed ONLY when the menu is empty (never wipes data, keeps the connection open)
  try {
    await seedDatabase();
  } catch (err) {
    console.error('Auto-seed failed:', err.message);
  }

  const server = app.listen(PORT, () => console.log(`API listening on port ${PORT} (${process.env.NODE_ENV})`));

  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
