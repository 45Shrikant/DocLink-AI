const mongoose = require('mongoose');
require('dotenv').config(); // Load the .env variables

// Use the link from .env, or fallback to local if it's missing
const dbConnect = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctorapp';

mongoose.connect(dbConnect, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(`✅ Connected to MongoDB: ${dbConnect.includes('127.0.0.1') ? 'Local' : 'Atlas Cloud'}`);
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});