const express = require('express');
const Signature = require('../models/Signature');

const router = express.Router();

// Example: Store signature
router.post('/store', async (req, res) => {
    const { accountNumber, signature } = req.body;
    try {
        const newSignature = new Signature({ accountNumber, signature });
        await newSignature.save();
        res.status(201).send({ message: 'Signature stored successfully' });
    } catch (err) {
        res.status(400).send({ message: 'Error storing signature', error: err.message });
    }
});

// Example: Verify signature
router.post('/verify', async (req, res) => {
    const { accountNumber, signature } = req.body;
    try {
        const storedSignature = await Signature.findOne({ accountNumber });
        if (!storedSignature) return res.status(404).send({ message: 'Account not found' });

        // Add your signature comparison logic here
        const isValid = storedSignature.signature === signature;
        res.status(200).send({ message: isValid ? 'Signature valid' : 'Signature invalid' });
    } catch (err) {
        res.status(500).send({ message: 'Error during verification', error: err.message });
    }
});

module.exports = router;
