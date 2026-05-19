const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Explicitly specify the collection name
const User = mongoose.model('User', userSchema, 'users');  // This will use the "users" collection in "your_db"

module.exports = User;
