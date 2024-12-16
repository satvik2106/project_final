const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to yourdb MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));
