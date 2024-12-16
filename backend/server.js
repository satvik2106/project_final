const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Import auth routes
const addAccountRoutes = require('./scripts/addacc'); // Import add-account routes
const app = express();

// Enable CORS for requests from the frontend
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend on port 3000
}));

// Middleware to parse JSON requests and handle large payloads
app.use(express.json({ limit: '10mb' })); // Allow large payloads for Base64 images

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/yourdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Define the root route for handling requests to '/'
app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

// Define the API routes
app.use('/api/auth', authRoutes); // Mount auth routes on /api/auth path
app.use('/api/account', addAccountRoutes); // Mount add-account routes on /api/account path

// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
