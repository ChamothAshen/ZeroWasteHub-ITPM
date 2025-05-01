const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    default: null
  },
  cardInfo: {
    cardNumber: {
      type: String,  // Masked card number for display
      required: true
    },
    cardHolder: {
      type: String,
      required: true
    },
    expiryDate: {
      type: String,
      required: true
    },
    last4Digits: {
      type: String,
      required: true
    }
  },
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
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  transaction: {
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'disputed', 'cancelled'],
      default: 'pending'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  refund: {
    amount: {
      type: Number,
      default: null
    },
    reason: {
      type: String,
      default: null
    },
    timestamp: {
      type: Date,
      default: null
    }
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for common queries
PaymentSchema.index({ 'transaction.transactionId': 1 });
PaymentSchema.index({ 'transaction.timestamp': -1 });
PaymentSchema.index({ 'transaction.status': 1 });
PaymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', PaymentSchema);