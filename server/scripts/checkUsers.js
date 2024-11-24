require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      const users = await User.find({});
      console.log('All users in database:');
      users.forEach(user => {
        console.log(`\nEmail: ${user.email}`);
        console.log(`Name: ${user.name}`);
        console.log(`Verified: ${user.isVerified}`);
        console.log('------------------------');
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));
