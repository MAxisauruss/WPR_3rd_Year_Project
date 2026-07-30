require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

async function run() {
  const uri = process.env.MONGO_URL ? process.env.MONGO_URL : process.env.MONGODB_URI;
  await mongoose.connect(uri);
  const missing = await Event.find({ $or: [{ price: { $exists: false } }, { price: null }] });
  console.log('missing count', missing.length);
  missing.forEach(e => console.log(`${e._id} ${e.title} ${e.price}`));
  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});