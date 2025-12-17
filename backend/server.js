require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// backend/server.js

// GOOD
require('dotenv').config(); // Load the secret tool
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected'))
  .catch(err => console.log('DB Connection Error:', err));

// Routes
const menuRouter = require('./routes/menu');
const ordersRouter = require('./routes/orders');

app.use('/api/menu', menuRouter);
app.use('/api/orders', ordersRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));