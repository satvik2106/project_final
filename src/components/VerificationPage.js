import React, { useState } from 'react';
import './VerificationPage.css';
import Nav from './Nav';

const VerificationPage = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [isAccountValid, setIsAccountValid] = useState(false);
  const [image, setImage] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [similarity, setSimilarity] = useState(null);
  const [uploadedSignature, setUploadedSignature] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Function to verify account number
  const handleAccountVerification = async () => {
    setError(''); // Clear any previous errors

    // Validate account number format (e.g., 10-digit number)
    const accountNumberRegex = /^[0-9]{10}$/;
    if (!accountNumberRegex.test(accountNumber.trim())) {
      setError('Invalid account number. It must be a 10-digit number.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/check-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber }),
        body: JSON.stringify({ account_number: accountNumber }),
      });

      const result = await response.json();

      if (response.status === 200) {
        setIsAccountValid(true);
        setError(''); // Clear error on success
        alert(result.message); // Show success message
      } else {
        setIsAccountValid(false);
        setError(result.message || 'Account verification failed.');
      }
    } catch (err) {
      console.error('Error verifying account:', err);
      setError('An error occurred while verifying the account. Please try again later.');
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setUploadedSignature(file); // Save uploaded signature for display
  };

  // Handle signature verification
  const handleVerify = async () => {
    const formData = new FormData();
    formData.append('account_number', accountNumber);
    formData.append('verifying_signature', image);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/signature/verify', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // Log the data received from the backend
      console.log(data);

      // Update verification status, similarity, and reference signature
      setVerificationStatus(data.result === 'Verified' ? 'Verified' : 'Forged');
      setSimilarity(data.similarity || null);
      setShowModal(true); // Open modal to display results
     } catch (error) {
      console.log('Error verifying signature:', error);
    }
  };
  return (
    <div>
      <Nav />
      <div className="verification-container">
        <div className="verification-box">
          <h1 className="verification-title">Signature Verification</h1>
          <p className="verification-message">
            Please enter your account details and upload your signature for verification.
          </p>

          {/* Account Number Input */}
          <label className="input-label" htmlFor="account-number">
            Account Number:
          </label>
          <input
            type="text"
            id="account-number"
            className="input-field"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <button
            className="verify-account-btn"
            onClick={handleAccountVerification}
            disabled={!accountNumber.trim()}
          >
            Verify Account
          </button>
          {error && <p className="error-message">{error}</p>}

          {/* Signature Upload */}
          <label className="input-label" htmlFor="signature-image">
            Upload Signature:
          </label>
          <input
            type="file"
            id="signature-image"
            className="input-field"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={!isAccountValid}
          />
          <button
            className="verify-signature-btn"
            onClick={handleVerify}
            disabled={!isAccountValid || !image}
          >
            Verify Signature
          </button>
        </div>
      </div>

      {/* Modal for Verification Result */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            {/* Display Verification Symbol */}
            <img
              src={
<<<<<<< HEAD
                similarity > 0.8
                  ? 'https://png.pngtree.com/png-clipart/20230524/original/pngtree-verified-stamp-png-image_9168723.png' // Genuine symbol URL
                  : 'https://pnghq.com/wp-content/uploads/fake-stamp-png-picture-350x269.png' // Forged symbol URL
=======
                similarity > 0.9
                  ? 'https://png.pngtree.com/png-clipart/20230524/original/pngtree-verified-stamp-png-image_9168723.png' // Verified symbol
                  : 'https://pnghq.com/wp-content/uploads/fake-stamp-png-picture-350x269.png' // Forged symbol
>>>>>>> 020aba70cd30a747a49f10d8dbfc94cf2ba00925
              }
              alt={verificationStatus}
              className="modal-image"
            />
            <div className="verification-result">
              <h3>Verification Result:</h3>
              <p>{similarity > 0.8 ? 'Signature is Genuine.' : 'Signature is Forged.'}</p>
              {similarity !== null && <p>Similarity: {Math.round(similarity * 100)}%</p>}
              <div className="images-container">
                <div className="image-box">
                  <h4>Uploaded Signature</h4>
                  {uploadedSignature ? (
                    <img
                      src={URL.createObjectURL(uploadedSignature)}
                      alt="Uploaded Signature"
                      className="signature-image"
                    />
                  ) : (
                    <p>No uploaded signature available.</p>
                  )}
                </div>
              </div>
            </div>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationPage;
