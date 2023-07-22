const express = require('express');
const connectDB = require('./config/db');
const authRoute = require('./routes/authRoutes');
const cors = require('cors');
const app = express();
const PORT = 5000;
require('dotenv').config();

// Enable CORS
app.use(cors());

// Connect to MongoDB
connectDB();

// Parse JSON bodies
app.use(express.json());

// Routes
app.use('/', authRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
