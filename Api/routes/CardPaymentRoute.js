const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/PaymentController');
const authMiddleware = require('../middleware/auth');

// Middleware to protect routes
router.use(authMiddleware);

// Create a new payment
router.post('/', paymentController.createPayment);

// Get payment by ID
router.get('/:paymentId', paymentController.getPaymentById);

// Get payment by transaction ID
router.get('/transaction/:transactionId', paymentController.getPaymentByTransactionId);

// Get payment receipt by transaction ID
router.get('/receipt/:transactionId', paymentController.getPaymentReceipt);

// Get all payments for a user
router.get('/user/:userId?', paymentController.getUserPayments);

// Update payment status (for refunds, disputes, etc.)
router.patch('/:paymentId', paymentController.updatePayment);

// Delete payment (admin only, soft delete)
router.delete('/:paymentId', paymentController.deletePayment);

module.exports = router;