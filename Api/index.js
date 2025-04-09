import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import collectRequestRoutes from './routes/CollectRequestRoute.js';
import createSmartBinRequest from './routes/RequestSmartBinRoute.js';
import inventoryRoutes from './routes/inventoryRoutes.js';

import cors from 'cors';
dotenv.config();
mongoose.connect(
  process.env.MONGOUrl).then(() => {
  console.log('connected to mongodb');
}).catch((err) => {
  console.log(err);
})

const app = express();
app.use(express.json());
app.use(cookieParser());
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/collection-requests', collectRequestRoutes);
app.use('/api/BinRequest', createSmartBinRequest);
app.use('/api/inventory', inventoryRoutes);



app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});