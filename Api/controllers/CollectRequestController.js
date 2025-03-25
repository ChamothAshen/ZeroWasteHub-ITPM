// controllers/CollectRequestController.js
import { v4 as uuidv4 } from 'uuid';
import CollectionRequest from '../models/CollectRequestModel.js';

export const createCollectionRequest = async (req, res) => {
  try {
    const {
      userId,
      scheduleDate,
      location,
      binType,
      quantity,
      description,
      contactNo,
      specialInstructions
    } = req.body;

    // Validate required fields
    if (!userId || !scheduleDate || !location || !binType || !description || !contactNo) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Generate a unique request ID
    const requestId = uuidv4();

    // Create new collection request
    const newRequest = new CollectionRequest({
      userId,
      scheduleDate,
      location,
      binType,
      quantity: quantity || 1,
      description,
      contactNo,
      specialInstructions,
      requestId,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Save to database
    const savedRequest = await newRequest.save();

    res.status(201).json({
      success: true,
      data: savedRequest,
      message: 'Collection request created successfully'
    });
  } catch (error) {
    console.error('Error creating collection request:', error);
    
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
      message: 'Server error while creating collection request'
    });
  }
};

export const getAllCollectionRequests = async (req, res) => {
  try {
    // Fetch all collection requests from database
    const collectionRequests = await CollectionRequest.find();
    
    res.status(200).json({
      success: true,
      count: collectionRequests.length,
      data: collectionRequests,
      message: 'Collection requests retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving collection requests:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving collection requests'
    });
  }
};

// Delete a collection request by ID
export const deleteCollectionRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Request ID is required'
      });
    }

    const deletedRequest = await CollectionRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({
        success: false,
        message: 'Collection request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: deletedRequest,
      message: 'Collection request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting collection request:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting collection request'
    });
  }
};

// Get collection requests by user ID
export const getUserCollectionRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const userRequests = await CollectionRequest.find({ userId });

    res.status(200).json({
      success: true,
      count: userRequests.length,
      data: userRequests,
      message: 'User collection requests retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving user collection requests:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving user collection requests'
    });
  }
};