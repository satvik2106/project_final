const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Import auth routes
const addAccountRoutes = require('./scripts/addacc'); // Import add-account routes
const { spawn } = require('child_process'); // Import child_process to run Python script
require('dotenv').config(); // Load environment variables

const app = express();

// List of allowed origins
const allowedOrigins = [
  'http://localhost:3000',              // Local development frontend
  'https://signare-g182.vercel.app',    // Deployed Vercel frontend
];

// Enable CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the origin
    } else {
      console.error(`CORS error: Origin ${origin} not allowed`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE',
  credentials: true, // Allow credentials (e.g., cookies, authorization headers)
}));

// Middleware to parse JSON requests and handle large payloads
app.use(express.json({ limit: '10mb' })); // Allow large payloads for Base64 images

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Define the root route
app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

// Mount API routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/account', addAccountRoutes); // Account routes

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Function to start the Python script (verify_signature.py)
const startPythonScript = () => {
  const pythonScriptPath = './deeplearning/Model/verify_signature.py';  // Ensure this path is correct

  // Spawn the Python process
  const pythonProcess = spawn('python', [pythonScriptPath]);

  // Log the output from Python script
  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  // Log any errors from the Python script
  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Log when the Python script exits
  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
  });
};

// Call the function to start the Python script
startPythonScript();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
