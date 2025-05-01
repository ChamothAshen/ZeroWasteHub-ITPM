// controllers/SmartBinRequestController.js
import { v4 as uuidv4 } from 'uuid';
import SmartBinRequest from '../models/RequestSmartBinModel.js';

export const createSmartBinRequest = async (req, res) => {
  try {
    const requestData = req.body;
    
    // Validate required fields
    const {
      userId,
      personalInfo,
      address,
      binRequest,
      schedule
    } = requestData;
    
    if (!userId || !personalInfo || !address || !binRequest || !schedule) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // Generate a unique request ID
    const requestId = `SBR-${uuidv4().slice(0, 8).toUpperCase()}`;
    
    // Create a new SmartBinRequest document
    const newRequest = new SmartBinRequest({
      ...requestData,
      requestId,
      status: 'pending',
      payment: {
        ...requestData.payment,
        paymentStatus: 'pending'
      }
    });
    
    // Save to database
    const savedRequest = await newRequest.save();
    
    return res.status(201).json({
      success: true,
      data: savedRequest,
      message: 'Smart bin request created successfully'
    });
  } catch (error) {
    console.error('Error creating smart bin request:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error while creating smart bin request'
    });
  }
};

// Get all smart bin requests
export const getAllSmartBinRequests = async (req, res) => {
  try {
    const requests = await SmartBinRequest.find();
    return res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching smart bin requests:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching smart bin requests'
    });
  }
};

// Get smart bin request by id
export const getSmartBinRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await SmartBinRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Smart bin request not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error fetching smart bin request:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching smart bin request'
    });
  }
};

// Update smart bin request
export const updateSmartBinRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Find request and ensure it exists
    const existingRequest = await SmartBinRequest.findById(id);
    
    if (!existingRequest) {
      return res.status(404).json({
        success: false,
        message: 'Smart bin request not found'
      });
    }
    
    // Check if user has permission to update
    // This is a basic check. You might want to implement more sophisticated auth checks
    if (updateData.userId && existingRequest.userId !== updateData.userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this request'
      });
    }
    
    // Prevent modification of request ID and creation date
    delete updateData.requestId;
    delete updateData.createdAt;
    
    // Update the request with new data
    // { new: true } returns the updated document instead of the original
    // { runValidators: true } runs the schema validators on update
    const updatedRequest = await SmartBinRequest.findByIdAndUpdate(
      id, 
      { 
        $set: updateData,
        updatedAt: new Date() // Update the timestamp
      }, 
      { new: true, runValidators: true }
    );
    
    return res.status(200).json({
      success: true,
      data: updatedRequest,
      message: 'Smart bin request updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating smart bin request:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    // Handle cast errors (invalid ID format)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error while updating smart bin request'
    });
  }
};

// Delete smart bin request by ID
export const deleteSmartBinRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Request ID is required'
      });
    }

    const deletedRequest = await SmartBinRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({
        success: false,
        message: 'Smart bin request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: deletedRequest,
      message: 'Smart bin request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting smart bin request:', error);
    
    // Handle cast errors (invalid ID format)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting smart bin request'
    });
  }
};

// Update smart bin request status
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'approved', 'in_progress', 'completed', 'cancelled', 'rejected'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    // Find and update the request status
    const updatedRequest = await SmartBinRequest.findByIdAndUpdate(
      id,
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: 'Smart bin request not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: updatedRequest,
      message: `Smart bin request status updated to ${status}`
    });
    
  } catch (error) {
    console.error('Error updating request status:', error);
    
    // Handle cast errors (invalid ID format)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error while updating request status'
    });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentMethod, transactionId } = req.body;
    
    // Validate payment status
    const validPaymentStatuses = ['pending', 'processing', 'completed', 'failed', 'refunded'];
    
    if (!paymentStatus || !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Payment status must be one of: ${validPaymentStatuses.join(', ')}`
      });
    }
    
    // Prepare update object
    const paymentUpdate = {
      'payment.paymentStatus': paymentStatus,
      updatedAt: new Date()
    };
    
    // Add optional fields if provided
    if (paymentMethod) {
      paymentUpdate['payment.paymentMethod'] = paymentMethod;
    }
    
    if (transactionId) {
      paymentUpdate['payment.transactionId'] = transactionId;
    }
    
    // Find and update the request
    const updatedRequest = await SmartBinRequest.findByIdAndUpdate(
      id,
      { $set: paymentUpdate },
      { new: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: 'Smart bin request not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: updatedRequest,
      message: `Payment status updated to ${paymentStatus}`
    });
    
  } catch (error) {
    console.error('Error updating payment status:', error);
    
    // Handle cast errors (invalid ID format)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error while updating payment status'
    });
  }
};

// Get all bin requests for a specific user
export const getRequestsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const requests = await SmartBinRequest.find({ userId });
    
    return res.status(200).json({
      success: true,
      data: requests,
      count: requests.length
    });
    
  } catch (error) {
    console.error('Error fetching user bin requests:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching user requests'
    });
  }
};