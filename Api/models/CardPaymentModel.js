import mongoose from 'mongoose';

const CardPaymentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'refunded'],
    default: 'success',
  },
  paymentMethod: {
    type: String,
    default: 'card',
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  refundDate: {
    type: Date,
  },
});

export default mongoose.model('CardPayment', CardPaymentSchema);
