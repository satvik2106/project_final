const mongoose = require('mongoose');
const User = require('../models/User'); // Assuming you have a User model

module.exports.handler = async (event, context) => {
  try {
    // If HTTP method is POST, it will handle account creation or update
    if (event.httpMethod === 'POST') {
      const { username, password, email } = JSON.parse(event.body);

      // Create a new user (Account creation)
      const newUser = new User({
        username,
        password,
        email,
      });

      // Save user to the database
      await newUser.save();

      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Account created successfully!', user: newUser }),
      };
    } else {
      // If not POST, return method not allowed
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error }),
    };
  }
};
