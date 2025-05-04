import BinStatusCount from '../models/BinStatusCount.js';
/* 
export const updateBinStatus = async (req, res) => {
  const { requestId, binId } = req.params;
  const { status } = req.body;

  try {
    const request = await SmartBinRequest.findOne({ _id: requestId });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const binIndex = request.binRequest.findIndex(bin => bin._id.toString() === binId);

    if (binIndex === -1) {
      return res.status(404).json({ message: 'Bin not found in request' });
    }

    const previousStatus = request.binRequest[binIndex].status;
    request.binRequest[binIndex].status = status;

    await request.save();

    // ✅ If changing status to "approved" and wasn't already approved, update stats
    if (status === "approved" && previousStatus !== "approved") {
      const bin = request.binRequest[binIndex];

      await BinStats.findOneAndUpdate(
        { binType: bin.binType, binSize: bin.binSize },
        { $inc: { approvedCount: 1 } },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: 'Bin status updated', request });

  } catch (error) {
    console.error('Error updating bin status:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getBinStats = async (req, res) => {
    try {
      const stats = await BinStats.find();
      res.status(200).json(stats);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch bin stats' });
    }
  }; */

  export const createOrUpdateBinStatusCount = async (req, res) => {
    try {
      const { binType, binSize, approvedCount } = req.body;
  
      // Validate input
      if (!binType || !binSize || typeof approvedCount !== 'number') {
        return res.status(400).json({ message: 'Missing or invalid input fields' });
      }
  
      // Find and update if exists, else create
      const updatedCount = await BinStatusCount.findOneAndUpdate(
        { binType, binSize },
        { $set: { approvedCount } },
        { upsert: true, new: true }
      );
  
      res.status(200).json(updatedCount);
    } catch (error) {
      console.error('Error creating/updating bin status count:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  export const getBinCountsByTypeAndSize = async (req, res) => {
    try {
      const { binType, binSize } = req.params;
  
      // Find matching bin counts
      const binCounts = await BinStatusCount.find({ binType, binSize });
  
      // If no matching documents, return default response with approvedCount = 0
      if (binCounts.length === 0) {
        return res.status(200).json([{ approvedCount: 0 }]);
      }
  
      res.status(200).json(binCounts);
    } catch (error) {
      console.error('Error fetching bin counts by type and size:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
