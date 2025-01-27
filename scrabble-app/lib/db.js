// lib/db.js
import mongoose from 'mongoose';

let isConnected = false; // Чтобы избежать повторных подключений

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('Success connection to MongoDB');
  } catch (error) {
    console.error('Error connection to MongoDB:', error);
  }
}
