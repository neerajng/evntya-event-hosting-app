const express = require('express');
const connectDB = require('./config/db');
const authRoute = require('./routes/authRoutes');
const eventRoute = require('./routes/eventRoutes');
const adminRoute = require('./routes/adminRoutes');
const cors = require('cors');
const app = express();
const PORT = 5000;
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

// Enable CORS
app.use(cors());

// Connect to MongoDB
connectDB();

// Parse JSON bodies
app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI, ttl: 24 * 60 * 60 }),
  })
);

// Routes
app.use('/', authRoute);
app.use('/', eventRoute);
app.use('/', adminRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
