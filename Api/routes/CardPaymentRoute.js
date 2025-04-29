// routes/CardPaymentRoutes.js
import express from 'express';
import { 
  processCardPayment, 
  getPaymentByTransactionId, 
  getUserPayments, 
  getRequestPayment,
  getPaymentReceipt
} from '../controllers/CardPaymentController.js';

const router = express.Router();

// Process a new card payment
router.post('/', processCardPayment);

// Get payment details by transaction ID
router.get('/transaction/:transactionId', getPaymentByTransactionId);

// Get all payments for a user
router.get('/user/:userId', getUserPayments);

// Get payment for a specific collection request
router.get('/request/:requestId', getRequestPayment);

// Get payment receipt
router.get('/receipt/:transactionId', getPaymentReceipt);

export default router;