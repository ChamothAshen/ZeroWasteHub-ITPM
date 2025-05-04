import express from 'express';
import {
  processCardPayment,
  getPaymentDetails,
  getUserPayments,
  processRefund,
  downloadReceipt,
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

router.get('/receipt/:transactionId', downloadReceipt);

export default router;
