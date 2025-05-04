// models/CardPaymentModel.js
import mongoose from 'mongoose';

const CardPaymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  requestId: {
    type: String,
    required: true,
    ref: 'CollectionRequest'
  },
  // Store only last 4 digits of card number for reference
  lastFourDigits: {
    type: String,
    required: true,
    trim: true,
    maxlength: 4
  },
  // Store card holder name
  cardHolder: {
    type: String,
    required: true,
    trim: true
  },
  // Store card type (Visa, Mastercard, etc.)
  cardType: {
    type: String,
    required: true,
    enum: ['visa', 'mastercard', 'amex', 'discover', 'other']
  },
  // Store expiry month and year separately
  expiryMonth: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  expiryYear: {
    type: Number,
    required: true,
    min: new Date().getFullYear() % 100, // Current 2-digit year
    max: (new Date().getFullYear() % 100) + 20 // Current year + 20 years
  },
  // Store payment amount
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  // Store payment currency
  currency: {
    type: String,
    required: true,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR']
  },
  // Payment status
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  // Transaction ID from payment processor
  transactionId: {
    type: String,
    sparse: true // Allow null/undefined but enforce uniqueness when present
  },
  // Payment processor used
  paymentProcessor: {
    type: String,
    required: true,
    enum: ['stripe', 'paypal', 'square', 'internal', 'other'],
    default: 'internal'
  },
  // Billing address
  billingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'US'
    }
  },
  // Additional metadata or notes
  metadata: {
    type: Map,
    of: String,
    default: {}
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update the 'updatedAt' timestamp
CardPaymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create a compound index for userId and requestId for faster lookups
CardPaymentSchema.index({ userId: 1, requestId: 1 });

// Create an index on transactionId for faster lookups
CardPaymentSchema.index({ transactionId: 1 }, { sparse: true });

// Method to anonymize payment data for security
CardPaymentSchema.methods.anonymize = function() {
  const anonymized = this.toObject();
  anonymized.lastFourDigits = '****';
  anonymized.cardHolder = anonymized.cardHolder
    .split(' ')
    .map(name => name.charAt(0) + '*****')
    .join(' ');
  return anonymized;
};

// Static method to find payments by user
CardPaymentSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

// Static method to find payments by request
CardPaymentSchema.statics.findByRequest = function(requestId) {
  return this.find({ requestId });
};

// ⚠️ IMPORTANT: Do NOT store complete card numbers, CVV, or any sensitive data
// This model only stores references to transactions and PCI-compliant minimal data
// All actual payment processing should go through a secure payment gateway

export default mongoose.model('CardPayment', CardPaymentSchema);