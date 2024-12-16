const mongoose = require('mongoose');

const SignatureSchema = new mongoose.Schema({
    accountNumber: { type: String, required: true },
    signature: { type: String, required: true }, // Path or Base64 of the signature
});

module.exports = mongoose.model('Signature', SignatureSchema);
