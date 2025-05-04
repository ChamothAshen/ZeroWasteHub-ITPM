import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import CardPayment from '../models/CardPaymentModel.js';

const generateReceiptPDF = (payment) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const receiptDir = path.resolve('receipts');
    const filePath = path.join(receiptDir, `${payment.transactionId}.pdf`);

    if (!fs.existsSync(receiptDir)) fs.mkdirSync(receiptDir);

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text('Payment Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Transaction ID: ${payment.transactionId}`);
    doc.text(`User ID: ${payment.userId}`);
    doc.text(`Amount: LKR ${payment.amount.toFixed(2)}`);
    doc.text(`Status: ${payment.status}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);
    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};

export const processCardPayment = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ success: false, message: 'User ID and amount are required' });
    }

    const transactionId = uuidv4();
    const newPayment = new CardPayment({ transactionId, userId, amount, status: 'success' });
    const savedPayment = await newPayment.save();

    await generateReceiptPDF(savedPayment);

    res.status(201).json({
      success: true,
      data: savedPayment,
      receiptUrl: `http://localhost:3000/api/card-payment/receipt/${transactionId}`,
      message: 'Payment processed and receipt generated successfully',
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const downloadReceipt = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const filePath = path.resolve('receipts', `${transactionId}.pdf`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }

    res.download(filePath, `${transactionId}_receipt.pdf`);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error downloading receipt' });
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
