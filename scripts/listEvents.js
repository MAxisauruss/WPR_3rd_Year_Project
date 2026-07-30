require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

async function run() {
  const uri = process.env.MONGO_URL ? process.env.MONGO_URL : process.env.MONGODB_URI;
  await mongoose.connect(uri);
  const all = await Event.find({});
  console.log('count', all.length);
  all.forEach(e => console.log(e._id + ' | ' + e.title + ' | price=' + e.price + ' | avail=' + e.availableTickets + ' | total=' + e.totalCapacity));
  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});