import express from 'express';
import {
  processCardPayment,
  getPaymentDetails,
  getUserPayments,
  processRefund,
} from '../controllers/CardPaymentController.js';


const router = express.Router();

// Process payment
router.post('/processCardPayment',  processCardPayment);

// Get payment details
router.get('/transaction/:transactionId', getPaymentDetails);

// Get payments by user
router.get('/user/:userId', getUserPayments);

// Refund a payment
router.post('/refund/:transactionId', processRefund);

export default router;
