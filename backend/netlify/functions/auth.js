const mongoose = require('mongoose');
const User = require('../models/User'); // Assuming you have a User model

module.exports.handler = async (event, context) => {
  try {
    // Check the HTTP method (POST)
    if (event.httpMethod === 'POST') {
      const { username, password } = JSON.parse(event.body);
      
      // Authenticate the user (This can vary based on your authentication logic)
      const user = await User.findOne({ username });

      if (user && user.password === password) {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Authenticated!', user }),
        };
      } else {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: 'Authentication failed!' }),
        };
      }
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
