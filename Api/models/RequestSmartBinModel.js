//models/SmartBinRequest.js
import mongoose from 'mongoose';

const SmartBinRequestSchema = new mongoose.Schema({
  // User identification
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  requestId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Personal Information
  personalInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    contactNo: {
      type: String,
      required: true,
      trim: true
    }
  },
  
  // Address Information
  address: {
    addressLine1: {
      type: String,
      required: true,
      trim: true
    },
    addressLine2: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    zipCode: {
      type: String,
      required: true,
      trim: true
    },
    propertyType: {
      type: String,
      enum: ['residential', 'commercial', 'industrial', 'institutional'],
      default: 'residential'
    },
    accessCode: {
      type: String,
      trim: true
    }
  },
  
  // Bin Request Details
  binRequest: [{
    binType: {
      type: String,
      required: true,
      enum: [
        'general', 'recycling', 'compost', 'paper', 'glass', 
        'plastic', 'metal', 'electronics', 'hazardous', 
        'construction', 'medical'
      ]
    },
    binSize: {
      type: String,
      required: true,
      enum: ['small', 'medium', 'large', 'xlarge', 'commercial'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 1
    }
  }],

  // Schedule Information
  schedule: {
    scheduleDate: {
      type: Date,
      required: true
    },
    collectionFrequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly', 'onetime'],
      default: 'weekly'
    },
    preferredDayOfWeek: {
      type: String,
      enum: ['', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      default: ''
    },
    preferredTimeOfDay: {
      type: String,
      enum: ['morning', 'afternoon', 'anytime'],
      default: 'morning'
    },
    immediate: {
      type: Boolean,
      default: false
    }
  },
  
  // Additional Information
  additionalInfo: {
    description: {
      type: String,
      trim: true
    },
    specialInstructions: {
      type: String,
      trim: true
    }
  },
  
  // Payment information
  payment: {
    paymentMethod: {
      type: String,
      enum: ['creditCard', 'debit', 'bankTransfer', 'other'],
      default: 'creditCard'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentId: {
      type: String
    },
    amount: {
      type: Number
    },
    paidAt: {
      type: Date
    }
  },
  
  // Request Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'processing', 'delivered', 'active', 'cancelled', 'completed'],
    default: 'pending'
  },
  
  // Consent/Terms
  termsAccepted: {
    type: Boolean,
    required: true,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Assigned to (internal use)
  assignedTo: {
    type: String
  },
  
  // Delivery details (added after processing)
  delivery: {
    scheduledDate: Date,
    actualDeliveryDate: Date,
    deliveryNotes: String,
    signedBy: String
  }
});

// Middleware to update the timestamp on save
SmartBinRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual property for full name
SmartBinRequestSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Virtual property for full address
SmartBinRequestSchema.virtual('fullAddress').get(function() {
  let address = this.address.addressLine1;
  if (this.address.addressLine2) address += `, ${this.address.addressLine2}`;
  address += `, ${this.address.city}, ${this.address.zipCode}`;
  return address;
});

// Fixed the export statement
export default mongoose.model('SmartBinRequest', SmartBinRequestSchema);