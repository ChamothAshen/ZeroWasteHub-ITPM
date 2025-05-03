import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Route imports
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import collectRequestRoutes from './routes/CollectRequestRoute.js';
import createSmartBinRequest from './routes/RequestSmartBinRoute.js';
import EmployeeRoute from './routes/EmployeeRoute.js';
import cardPaymentRoutes from './routes/CardPaymentRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGOUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(' MongoDB connection error:', err));

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/collection-requests', collectRequestRoutes);
app.use('/api/BinRequest', createSmartBinRequest);
app.use('/api/employee', EmployeeRoute);
app.use('/api/card-payment', cardPaymentRoutes);

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Start server
app.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`);
});
