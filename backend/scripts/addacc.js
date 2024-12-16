const express = require('express');
const router = express.Router();
const Account = require('../models/Account'); // Adjust path to Account schema

router.post('/add-account', async (req, res) => {
  try {
    const { accountNumber, userName, email, image } = req.body;

    // Check if all fields are present
    if (!accountNumber || !userName || !email || !image) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Remove the prefix if it exists
    const base64Image = image.startsWith('data:image') 
      ? image.split(',')[1] 
      : image;

    // Save the account to the database
    const newAccount = new Account({
      accountNumber,
      userName,
      email,
      image: base64Image, // Save only the Base64 part
    });

    await newAccount.save();
    res.status(201).json({ message: 'Account added successfully!' });
  } catch (error) {
    console.error('Error saving account:', error);
    res.status(500).json({ message: 'Error saving account.' });
  }
});

module.exports = router;
