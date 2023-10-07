const express = require('express');
const connectDB = require('./config/db');
const authRoute = require('./routes/authRoutes');
const eventRoute = require('./routes/eventRoutes');
const adminRoute = require('./routes/adminRoutes');
const profileRoute = require('./routes/profileRoutes');
const ticketRoute = require('./routes/ticketRoutes');
const cors = require('cors');
const app = express();
const PORT = 5000;
const MongoStore = require('connect-mongo');
const cron = require('node-cron');
require('dotenv').config();

// Enable CORS
app.use(cors());

// Connect to MongoDB
connectDB();

// Parse JSON bodies
app.use(express.json());


const cleanupTickets = require('./utils/cleanup');

const cleanupSchedule = '*/30 * * * *'; // Runs every 30 mins
cron.schedule(cleanupSchedule, cleanupTickets);

// Routes
app.use('/api', authRoute);
app.use('/api', eventRoute);
app.use('/api', adminRoute);
app.use('/api', profileRoute);
app.use('/api', ticketRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
