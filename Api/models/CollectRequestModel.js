// models/CollectRequestModel.js
import mongoose from 'mongoose';

const CollectionRequestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  scheduleDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  binType: {
    type: String,
    required: true,
    enum: ['general', 'recycling', 'compost', 'paper', 'electronics', 'hazardous']
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  description: {
    type: String,
    required: true
  },
  contactNo: {
    type: String,
    required: true
  },
  specialInstructions: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: {
    type: String
  },
  requestId: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('CollectionRequest', CollectionRequestSchema);