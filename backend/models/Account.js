const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    accountNumber: { type: String, required: true },
    userName: { type: String, required: true }, // Make sure the field name matches
    email: { type: String, required: true },
    image: { type: String, required: true }, // This field stores the Base64 image
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
