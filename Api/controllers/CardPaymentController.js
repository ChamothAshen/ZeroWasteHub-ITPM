const PaymentModel = require('../models/Payment');
const RequestModel = require('../models/Request');
const { v4: uuidv4 } = require('uuid');

class PaymentController {
  /**
   * Create a new payment
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createPayment(req, res) {
    try {
      const { 
        userId, 
        requestId, 
        cardNumber, 
        cardHolder, 
        expiryDate, 
        amount, 
        currency, 
        billingAddress 
      } = req.body;

      // Basic validation
      if (!userId || !requestId || !cardNumber || !cardHolder || !expiryDate || !amount) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required payment information' 
        });
      }

      // Check if the request exists (skip for demo mode)
      if (requestId !== 'demo-request-id') {
        const request = await RequestModel.findById(requestId);
        if (!request) {
          return res.status(404).json({ 
            success: false, 
            message: 'Request not found' 
          });
        }
        
        // Check if this request has already been paid
        const existingPayment = await PaymentModel.findOne({ requestId });
        if (existingPayment) {
          return res.status(400).json({ 
            success: false, 
            message: 'This request has already been paid for' 
          });
        }
      }

      // In a real-world app: Process payment through a payment gateway
      // This would involve validating the card, checking for fraud, etc.
      
      // For demo purposes, we'll just create a transaction record
      const transaction = {
        transactionId: uuidv4(),
        status: 'completed',
        timestamp: new Date(),
        amount,
        currency
      };

      // Mask the card number for storage - only keep last 4 digits
      const last4Digits = cardNumber.slice(-4);
      const maskedCardNumber = '*'.repeat(12) + last4Digits;

      // Create payment record
      const newPayment = await PaymentModel.create({
        userId,
        requestId,
        cardInfo: {
          cardNumber: maskedCardNumber,
          cardHolder,
          expiryDate,
          last4Digits
        },
        billingAddress,
        amount,
        currency,
        transaction
      });

      // If not demo mode, update the request status to paid
      if (requestId !== 'demo-request-id') {
        await RequestModel.findByIdAndUpdate(requestId, { 
          paymentStatus: 'paid',
          transactionId: transaction.transactionId
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          transactionId: transaction.transactionId,
          amount,
          currency,
          status: transaction.status,
          timestamp: transaction.timestamp
        }
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to process payment',
        error: error.message
      });
    }
  }

  /**
   * Get payment by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPaymentById(req, res) {
    try {
      const { paymentId } = req.params;

      const payment = await PaymentModel.findById(paymentId);
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      // Check authorization - only allow users to view their own payments
      // In a real app, you might also want to allow admins to view any payment
      if (payment.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to view this payment'
        });
      }

      return res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      console.error('Error fetching payment:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch payment',
        error: error.message
      });
    }
  }

  /**
   * Get payment by transaction ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPaymentByTransactionId(req, res) {
    try {
      const { transactionId } = req.params;

      const payment = await PaymentModel.findOne({ 'transaction.transactionId': transactionId });
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      // Check authorization - only allow users to view their own payments
      if (payment.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to view this payment'
        });
      }

      return res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      console.error('Error fetching payment:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch payment',
        error: error.message
      });
    }
  }

  /**
   * Get all payments for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserPayments(req, res) {
    try {
      const userId = req.params.userId || req.user.id;

      // Check authorization - only allow users to view their own payments
      if (userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to view these payments'
        });
      }

      const payments = await PaymentModel.find({ userId })
        .sort({ 'transaction.timestamp': -1 }); // Sort by most recent first
      
      return res.status(200).json({
        success: true,
        count: payments.length,
        data: payments
      });
    } catch (error) {
      console.error('Error fetching user payments:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user payments',
        error: error.message
      });
    }
  }

  /**
   * Update payment (for refunds, disputes, etc.)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePayment(req, res) {
    try {
      const { paymentId } = req.params;
      const { status, refundAmount, refundReason } = req.body;

      // Only admins can update payments
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to update payments'
        });
      }

      const payment = await PaymentModel.findById(paymentId);
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      // Handle different update scenarios
      if (status === 'refunded') {
        // In a real app, you would process the refund through your payment gateway
        
        // Update the payment record
        payment.transaction.status = 'refunded';
        payment.refund = {
          amount: refundAmount || payment.amount,
          reason: refundReason || 'Customer request',
          timestamp: new Date()
        };

        // If this payment is associated with a request, update it too
        if (payment.requestId && payment.requestId !== 'demo-request-id') {
          await RequestModel.findByIdAndUpdate(payment.requestId, { 
            paymentStatus: 'refunded' 
          });
        }
      } else if (status) {
        // Update the status
        payment.transaction.status = status;
        
        // If this payment is associated with a request, update it too
        if (payment.requestId && payment.requestId !== 'demo-request-id') {
          await RequestModel.findByIdAndUpdate(payment.requestId, { 
            paymentStatus: status 
          });
        }
      }

      // Save the updates
      await payment.save();

      return res.status(200).json({
        success: true,
        message: 'Payment updated successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update payment',
        error: error.message
      });
    }
  }

  /**
   * Delete payment (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deletePayment(req, res) {
    try {
      const { paymentId } = req.params;

      // Only admins can delete payments
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to delete payments'
        });
      }

      const payment = await PaymentModel.findById(paymentId);
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      // In a real app, you would likely only mark the payment as deleted in the database
      // rather than actually removing it, for audit and compliance reasons
      payment.isDeleted = true;
      await payment.save();

      // Or if you really want to delete it (not recommended for payment records):
      // await PaymentModel.findByIdAndDelete(paymentId);

      return res.status(200).json({
        success: true,
        message: 'Payment deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting payment:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete payment',
        error: error.message
      });
    }
  }

  /**
   * Get payment receipt
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPaymentReceipt(req, res) {
    try {
      const { transactionId } = req.params;

      const payment = await PaymentModel.findOne({ 'transaction.transactionId': transactionId })
        .populate('requestId', 'binType quantity scheduleDate address');
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      // Check authorization - only allow users to view their own receipts
      if (payment.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to view this receipt'
        });
      }

      // Format the receipt data
      const receiptData = {
        transactionId: payment.transaction.transactionId,
        date: payment.transaction.timestamp,
        status: payment.transaction.status,
        amount: payment.amount,
        currency: payment.currency,
        cardInfo: {
          cardType: this.getCardType(payment.cardInfo.cardNumber),
          last4Digits: payment.cardInfo.last4Digits
        },
        service: payment.requestId ? {
          binType: payment.requestId.binType,
          quantity: payment.requestId.quantity,
          scheduleDate: payment.requestId.scheduleDate,
          address: payment.requestId.address
        } : {
          type: 'Standard collection service'
        },
        billingAddress: payment.billingAddress,
        customerInfo: {
          userId: payment.userId
        }
      };

      return res.status(200).json({
        success: true,
        data: receiptData
      });
    } catch (error) {
      console.error('Error generating receipt:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate receipt',
        error: error.message
      });
    }
  }

  /**
   * Helper method to determine card type based on card number
   * @param {String} cardNumber - The credit card number
   * @returns {String} - The card type
   */
  getCardType(cardNumber) {
    // Basic card detection logic
    const firstDigit = cardNumber.charAt(0);
    const first4Digits = cardNumber.substring(0, 4);
    
    if (firstDigit === '4') {
      return 'Visa';
    } else if (['51', '52', '53', '54', '55'].includes(first4Digits.substring(0, 2))) {
      return 'MasterCard';
    } else if (['34', '37'].includes(first4Digits.substring(0, 2))) {
      return 'American Express';
    } else if (['6011'].includes(first4Digits)) {
      return 'Discover';
    } else {
      return 'Unknown';
    }
  }
}

module.exports = new PaymentController();