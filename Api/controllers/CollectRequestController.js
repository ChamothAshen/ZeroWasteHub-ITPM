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