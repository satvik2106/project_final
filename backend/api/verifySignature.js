// backend/api/verifySignature.js
const axios = require('axios');
require('dotenv').config();  // For environment variables

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { signatureData } = JSON.parse(event.body);

    // Example of signature verification logic
    const verificationResult = await axios.post(process.env.SIGNATURE_VERIFY_API, { signatureData });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Signature verified successfully',
        result: verificationResult.data,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};
