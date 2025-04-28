// // controllers/SmartBinRequestController.js
// import { v4 as uuidv4 } from 'uuid';
// import SmartBinRequest from '../models/RequestSmartBinModel.js';

// export const createSmartBinRequest = async (req, res) => {
//   try {
//     const requestData = req.body;
    
//     // Validate required fields
//     const {
//       userId,
//       personalInfo,
//       address,
//       binRequest,
//       schedule
//     } = requestData;
    
//     if (!userId || !personalInfo || !address || !binRequest || !schedule) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide all required fields'
//       });
//     }
    
//     // Generate a unique request ID
//     const requestId = `SBR-${uuidv4().slice(0, 8).toUpperCase()}`;
    
//     // Create a new SmartBinRequest document
//     const newRequest = new SmartBinRequest({
//       ...requestData,
//       requestId,
//       status: 'pending',
//       payment: {
//         ...requestData.payment,
//         paymentStatus: 'pending'
//       }
//     });
    
//     // Save to database
//     const savedRequest = await newRequest.save();
    
//     return res.status(201).json({
//       success: true,
//       data: savedRequest,
//       message: 'Smart bin request created successfully'
//     });
//   } catch (error) {
//     console.error('Error creating smart bin request:', error);
    
//     // Handle MongoDB validation errors
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(val => val.message);
//       return res.status(400).json({
//         success: false,
//         message: messages.join(', ')
//       });
//     }
    
//     return res.status(500).json({
//       success: false,
//       message: 'Server error while creating smart bin request'
//     });
//   }
// };

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

//get all smart bin requests
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
//get smart bin request by id
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



