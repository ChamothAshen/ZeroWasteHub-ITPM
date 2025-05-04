// controllers/CardPaymentController.js
import { v4 as uuidv4 } from 'uuid';
import CardPayment from '../models/CardPaymentModel.js';
import CollectionRequest from '../models/CollectRequestModel.js';

/**
 * Process a new card payment
 * Note: In a production environment, you would use a payment processor API
 * and only store the transaction results, not the actual card details
 */
export const processCardPayment = async (req, res) => {
  try {
    const {
      userId,
      requestId,
      cardNumber,
      cardHolder,
      expiryDate,
      cvv,
      amount,
      currency = 'USD',
      billingAddress
    } = req.body;

    // Validate required fields
    if (!userId || !requestId || !cardNumber || !cardHolder || !expiryDate || !cvv || !amount || !billingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if the collection request exists
    const request = await CollectionRequest.findOne({ requestId });
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Collection request not found'
      });
    }

    // In a real implementation, you would process the payment through a secure gateway
    // and receive a transaction ID. This is a simplified simulation.
    
    // Extract card info (in real app, this would be handled by payment processor)
    const lastFourDigits = cardNumber.slice(-4);
    const [expiryMonth, expiryYear] = expiryDate.split('/').map(part => parseInt(part.trim(), 10));
    
    // Determine card type based on first digit (simplified)
    let cardType = 'other';
    if (cardNumber.startsWith('4')) {
      cardType = 'visa';
    } else if (cardNumber.startsWith('5')) {
      cardType = 'mastercard';
    } else if (cardNumber.startsWith('3')) {
      cardType = 'amex';
    } else if (cardNumber.startsWith('6')) {
      cardType = 'discover';
    }

    // Generate a mock transaction ID (in real app, this would come from payment processor)
    const transactionId = `tx_${uuidv4()}`;
    
    // Create a new payment record
    const newPayment = new CardPayment({
      userId,
      requestId,
      lastFourDigits,
      cardHolder,
      cardType,
      expiryMonth,
      expiryYear,
      amount,
      currency,
      status: 'completed', // In a real app, might start as 'processing'
      transactionId,
      paymentProcessor: 'internal', // In a real app, this would be your actual processor
      billingAddress,
      metadata: {
        paymentMethod: 'card',
        deviceInfo: req.headers['user-agent'] || 'unknown'
      }
    });

    // Save payment to database
    const savedPayment = await newPayment.save();

    // Update the collection request payment status
    await CollectionRequest.findByIdAndUpdate(
      request._id,
      { 
        paymentStatus: 'completed',
        paymentId: savedPayment._id.toString()
      }
    );

    res.status(201).json({
      success: true,
      data: {
        transactionId: savedPayment.transactionId,
        amount: savedPayment.amount,
        currency: savedPayment.currency,
        status: savedPayment.status,
        lastFourDigits: savedPayment.lastFourDigits,
        paymentDate: savedPayment.createdAt
      },
      message: 'Payment processed successfully'
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while processing payment'
    });
  }
};

/**
 * Get payment details by transaction ID
 */
export const getPaymentByTransactionId = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID is required'
      });
    }

    const payment = await CardPayment.findOne({ transactionId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Return a sanitized version of the payment data
    const paymentData = {
      id: payment._id,
      transactionId: payment.transactionId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      lastFourDigits: payment.lastFourDigits,
      cardType: payment.cardType,
      cardHolder: payment.cardHolder,
      paymentDate: payment.createdAt,
      billingAddress: {
        city: payment.billingAddress.city,
        state: payment.billingAddress.state,
        country: payment.billingAddress.country
      }
    };

    res.status(200).json({
      success: true,
      data: paymentData,
      message: 'Payment details retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving payment:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving payment details'
    });
  }
};

/**
 * Get all payments for a user
 */
export const getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const payments = await CardPayment.findByUser(userId);

    // Sanitize the payment data
    const sanitizedPayments = payments.map(payment => ({
      id: payment._id,
      transactionId: payment.transactionId,
      requestId: payment.requestId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      lastFourDigits: payment.lastFourDigits,
      cardType: payment.cardType,
      paymentDate: payment.createdAt
    }));

    res.status(200).json({
      success: true,
      count: sanitizedPayments.length,
      data: sanitizedPayments,
      message: 'User payments retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving user payments:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving user payments'
    });
  }
};

/**
 * Get payment for a specific collection request
 */
export const getRequestPayment = async (req, res) => {
  try {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: 'Request ID is required'
      });
    }

    const payments = await CardPayment.findByRequest(requestId);

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No payments found for this request'
      });
    }

    // Usually there should be only one payment per request,
    // but we handle multiple payments just in case
    const sanitizedPayments = payments.map(payment => ({
      id: payment._id,
      transactionId: payment.transactionId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      lastFourDigits: payment.lastFourDigits,
      cardType: payment.cardType,
      paymentDate: payment.createdAt
    }));

    res.status(200).json({
      success: true,
      count: sanitizedPayments.length,
      data: sanitizedPayments,
      message: 'Request payments retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving request payments:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving request payments'
    });
  }
};

/**
 * Get payment receipt
 */
export const getPaymentReceipt = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID is required'
      });
    }

    const payment = await CardPayment.findOne({ transactionId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Find the collection request
    const request = await CollectionRequest.findOne({ requestId: payment.requestId });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Collection request not found'
      });
    }

    // Generate receipt data
    const receiptData = {
      receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
      transactionId: payment.transactionId,
      paymentDate: payment.createdAt,
      customerName: payment.cardHolder,
      paymentMethod: `${payment.cardType.toUpperCase()} **** **** **** ${payment.lastFourDigits}`,
      billingAddress: payment.billingAddress,
      
      serviceDetails: {
        serviceType: "Waste Collection",
        binType: request.binType,
        quantity: request.quantity,
        location: request.location,
        scheduleDate: request.scheduleDate
      },
      
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      
      businessDetails: {
        name: "EcoWaste Management Services",
        address: "123 Green Street, Eco City, EC 12345",
        contactEmail: "support@ecowastemanagement.com",
        contactPhone: "+1 (555) 123-4567",
        website: "www.ecowastemanagement.com"
      }
    };

    res.status(200).json({
      success: true,
      data: receiptData,
      message: 'Payment receipt generated successfully'
    });
  } catch (error) {
    console.error('Error generating receipt:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while generating receipt'
    });
  }
};