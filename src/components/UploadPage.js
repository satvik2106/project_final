import React, { useState } from 'react';
import './UploadPage.css'; // Import the CSS for styling
import Nav from './Nav';

const UploadPage = () => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    userName: '',
    email: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0], // Store the actual file
    });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { accountNumber, userName, email, image } = formData;

    if (!image) {
      alert('Please upload an image');
      return;
    }

    try {
      const base64Image = await convertToBase64(image); // Convert image to Base64 string

      const response = await fetch('https://backend-new-misy.onrender.com/api/account/add-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountNumber,
          userName,
          email,
          image: base64Image, // Send Base64 string
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Account added successfully!');
        window.location.reload(); // Refresh the page after success
      } else {
        alert('Failed to add account: ' + result.message);
      }
    } catch (error) {
      console.error('Error uploading data:', error);
      alert('Error uploading data: ' + error.message);
    }
  };

  return (
    <div>
      <Nav/> {/* Include the Navbar */}
      <div className="upload-page">
        <div className="form-container">
          <div className='bc'>Upload Image and Details</div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="accountNumber">Account Number:</label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="userName">User Name:</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Upload Image:</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                required
              />
            </div>

            {formData.image && (
              <div className="image-preview">
                <img src={URL.createObjectURL(formData.image)} alt="Preview" />
              </div>
            )}

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
