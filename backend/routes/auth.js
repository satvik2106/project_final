const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const User = require('../models/User'); // Import the User model
const Account = require('../models/Account'); // Import the Account model (for checking account numbers)
const mongoose = require('mongoose'); // Import mongoose for accessing the connection details
const router = express.Router();

// POST route to handle signup
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists. Please choose another.' });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const newUser = new User({
      firstName,
      lastName,
      username,
      password: hashedPassword, // Save the hashed password
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'An error occurred while creating the user. Please try again later.' });
  }
});

// POST route to handle login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }

    // Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    // If login is successful, send success message
    res.status(200).json({ message: 'Login successful!', user: { username: user.username } });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'An error occurred during login. Please try again later.' });
  }
});

// POST route to check if the account number exists in the 'Account' model
router.post('/check-account', async (req, res) => {
  try {
    const { accountNumber } = req.body;

    console.log('Received account number:', accountNumber); // Log the received account number

    // Validate the account number
    if (!accountNumber) {
      return res.status(400).json({ message: 'Account number is required.' });
    }

    // Ensure the accountNumber is a string
    const accountNumberStr = accountNumber.toString();

    console.log('Account number (as string):', accountNumberStr); // Log the account number as a string

    // Get the database and collection details
    const dbName = mongoose.connection.name; // Get the database name from the connection
    const collectionName = Account.collection.name; // Get the collection name for the 'Account' model
    
    console.log(`Querying database: ${dbName}`);
    console.log(`Querying collection: ${collectionName}`);
    
    // Query the Account collection to find the account by account number
    const account = await Account.findOne({ accountNumber: accountNumberStr });

    if (!account) {
      console.log('Account not found in database:', accountNumberStr);
      return res.status(400).json({ message: 'Invalid account number.' });
    }

    console.log('Account verified successfully:', account);
    res.status(200).json({ message: 'Account verified successfully!' });
  } catch (error) {
    console.error('Error verifying account:', error);
    res.status(500).json({ message: 'An error occurred while verifying the account. Please try again later.' });
  }
});

module.exports = router;
