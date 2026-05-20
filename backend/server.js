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

// Define the root route to return JSON
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend server!' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Node.js Backend' });
});

// Mount API routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/account', addAccountRoutes); // Account routes

// Proxy route for signature verification using transparent stream pipe
const http = require('http');
const https = require('https');
app.post('/api/signature/verify', (req, res) => {
  const pythonUrl = process.env.PYTHON_ML_URL || 'http://127.0.0.1:5001';
  
  let targetUrl;
  try {
    targetUrl = new URL('/predict', pythonUrl);
  } catch (err) {
    console.error('Invalid PYTHON_ML_URL:', err);
    return res.status(500).json({ error: 'Configuration Error', details: 'Invalid ML service URL' });
  }

  const requestModule = targetUrl.protocol === 'https:' ? https : http;

  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
    path: targetUrl.pathname + targetUrl.search,
    method: 'POST',
    headers: { ...req.headers, host: targetUrl.host } // Pass headers but override host
  };

  const proxyReq = requestModule.request(options, (proxyRes) => {
    const contentType = proxyRes.headers['content-type'] || '';
    
    // DEFENSIVE PROXY: Never pipe HTML to the frontend!
    if (contentType.includes('text/html')) {
      proxyRes.resume(); // Consume stream
      console.error('Proxy Error: ML Service returned HTML instead of JSON');
      return res.status(502).json({ 
        error: 'ML Service Error', 
        details: 'The Python ML service returned an HTML error page. Please check ML service logs or ensure the ML URL is correct.'
      });
    }

    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  req.pipe(proxyReq);

  proxyReq.on('error', (err) => {
    console.error('Proxy network error:', err);
    res.status(500).json({ error: 'Proxy network error', details: err.message });
  });
});

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// // Function to start the Python script (verify_signature.py)
// const startPythonScript = () => {
//   const pythonScriptPath = './deeplearning/Model/verify_signature.py';  // Ensure this path is correct

//   // Spawn the Python process
//   const pythonProcess = spawn('python', [pythonScriptPath]);

//   // Log the output from Python script
//   pythonProcess.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
//   });

//   // Log any errors from the Python script
//   pythonProcess.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//   });

//   // Log when the Python script exits
//   pythonProcess.on('close', (code) => {
//     console.log(`Python script exited with code ${code}`);
//   });
// };

// // Call the function to start the Python script
// startPythonScript();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
