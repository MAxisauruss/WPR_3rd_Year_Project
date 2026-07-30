// Import the mongoose library, which allows us to interact with MongoDB using JavaScript
const mongoose = require('mongoose');

// Keep dotenv here so any entry point that imports this file gets env loaded.
require('dotenv').config();

const connectDB = async () => {
  const uri = process.env.MONGO_URL || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Missing MongoDB connection string. Set MONGO_URL or MONGODB_URI in your .env');
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
