// routes/account.js
const express = require('express');
const fs = require('fs');
const Account = require('../models/Account'); // Import the Mongoose model
const router = express.Router();

// Add route logic here (e.g., storing images as Base64)
router.post('/add-accounts', async (req, res) => {
    try {
        const { applicationNumber, username, email, imagePath } = req.body;

        const base64Image = fs.readFileSync(imagePath).toString('base64');

        const newAccount = new Account({
            applicationNumber,
            username,
            email,
            image: base64Image,
        });

        await newAccount.save();
        res.status(201).json({ message: 'Account added successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add account' });
    }
});

module.exports = router;
