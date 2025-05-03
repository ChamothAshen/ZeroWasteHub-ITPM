import { v4 as uuidv4 } from 'uuid';
import CardPayment from '../models/CardPaymentModel.js';

// Process card payment
export const processCardPayment = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'User ID and amount are required',
      });
    }

    const transactionId = uuidv4();

    const newPayment = new CardPayment({
      transactionId,
      userId,
      amount,
      status: 'success',
    });

    const savedPayment = await newPayment.save();

    res.status(201).json({
      success: true,
      data: savedPayment,
      message: 'Payment processed successfully',
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing payment',
    });
  }
};

// Get a payment by transaction ID
export const getPaymentDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const payment = await CardPayment.findOne({ transactionId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
      message: 'Payment retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving payment',
    });
  }
};

// Get all payments by user ID
export const getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;

    const payments = await CardPayment.find({ userId });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
      message: 'User payments retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving user payments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving user payments',
    });
  }
};

// Process a refund by transaction ID
export const processRefund = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const payment = await CardPayment.findOne({ transactionId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    if (payment.status === 'refunded') {
      return res.status(400).json({
        success: false,
        message: 'Payment already refunded',
      });
    }

    payment.status = 'refunded';
    payment.refundDate = new Date();

    const updatedPayment = await payment.save();

    res.status(200).json({
      success: true,
      data: updatedPayment,
      message: 'Refund processed successfully',
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing refund',
    });
  }
};
