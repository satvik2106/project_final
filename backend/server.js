const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Import auth routes
const addAccountRoutes = require('./scripts/addacc'); // Import add-account routes
require('dotenv').config(); // Load environment variables

const app = express();
const allowedOrigins = ['http://localhost:3000', 'https://signare-g182.netlify.app'];

// Enable CORS for requests from the Netlify frontend
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the origin
    } else {
      callback(new Error('Not allowed by CORS')); // Reject other origins
    }
  },
  methods: 'GET,POST,PUT,DELETE',
  credentials: true, // Allow credentials (if needed)
}));

// Middleware to parse JSON requests and handle large payloads
app.use(express.json({ limit: '10mb' })); // Allow large payloads for Base64 images

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.log('Error connecting to MongoDB Atlas:', err));

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
