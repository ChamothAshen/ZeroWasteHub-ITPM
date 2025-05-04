
// controllers/SmartBinRequestController.js
import { v4 as uuidv4 } from 'uuid';
import SmartBinRequest from '../models/RequestSmartBinModel.js';
import BinStatusCount from '../models/BinStatusCount.js'; // Assuming this is the model for bin status counts

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

// Update Request
export const updateSmartBinRequest = async (req, res) => {
  try {
    const updatedRequest = await SmartBinRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedRequest) return res.status(404).json({ success: false, message: 'Request not found' });
    res.status(200).json({ success: true, data: updatedRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while updating request' });
  }
};

// Delete Request
export const deleteSmartBinRequest = async (req, res) => {
  try {
    const deletedRequest = await SmartBinRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) return res.status(404).json({ success: false, message: 'Request not found' });
    res.status(200).json({ success: true, message: 'Smart bin request deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while deleting request' });
  }
};


//dishan changes to stotre pending status of bin request
// Controller: updateBinStatus


export const updateBinStatus = async (req, res) => {
  const { requestId, binId } = req.params;
  const { status } = req.body;

  try {
    // Step 1: Update the bin status in the request
    const updatedRequest = await SmartBinRequest.findOneAndUpdate(
      { _id: requestId, 'binRequest._id': binId },
      { $set: { 'binRequest.$.status': status } },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request or bin not found' });
    }

    // Step 2: If the status is "approved", count the bins per binType and binSize
    if (status === 'approved') {
      // Loop through each binRequest to count bins based on binType and binSize
      const binCounts = updatedRequest.binRequest.reduce((counts, bin) => {
        if (bin.status === 'approved') {
          const key = `${bin.binType}-${bin.binSize}`;
          counts[key] = (counts[key] || 0) + bin.quantity;
        }
        return counts;
      }, {});

      // Step 3: Store the counts in the BinStatusCount collection
      for (const [binKey, count] of Object.entries(binCounts)) {
        const [binType, binSize] = binKey.split('-');

        // Find if a record already exists for this binType and binSize
        const existingBinStatus = await BinStatusCount.findOne({ binType, binSize });

        if (existingBinStatus) {
          // If it exists, update the count
          existingBinStatus.approvedCount += count;
          await existingBinStatus.save();
        } else {
          // If it doesn't exist, create a new record
          const newBinStatus = new BinStatusCount({
            binType,
            binSize,
            approvedCount: count,
          });
          await newBinStatus.save();
        }
      }
    }

    res.status(200).json({
      message: 'Bin status updated successfully',
      updatedRequest,
    });
  } catch (error) {
    console.error('Error updating bin status:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

