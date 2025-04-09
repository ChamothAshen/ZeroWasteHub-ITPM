import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import collectRequestRoutes from './routes/CollectRequestRoute.js';
import createSmartBinRequest from './routes/RequestSmartBinRoute.js';
import inventoryRoutes from './routes/inventoryRoutes.js'; // Ensure this route is defined

import cors from 'cors';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGOUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// ✅ Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Change this to match your frontend URL
  credentials: true, // Allow cookies & authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/collection-requests', collectRequestRoutes);
app.use('/api/BinRequest', createSmartBinRequest);
app.use('/api/Inventory', inventoryRoutes); // Ensure this route is defined

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
