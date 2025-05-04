
import express from 'express';
import  {createSmartBinRequest, getAllSmartBinRequests,getSmartBinRequestById,updateSmartBinRequest,deleteSmartBinRequest,updateBinStatus}  from '../controllers/RequestSmartBinController.js';

const router = express.Router();

// Create a new smart bin request
router.post('/', createSmartBinRequest);
// Get all smart bin requests
router.get('/smartbins', getAllSmartBinRequests);
// Get smart bin request by ID
router.get('/smartbins/:id', getSmartBinRequestById);
//update
router.put('/smartbins/:id', updateSmartBinRequest);
// Delete smart bin request by ID
router.delete('/smartbins/:id', deleteSmartBinRequest);
//dishan changes
router.patch('/update-bin-status/:requestId/:binId', updateBinStatus);






export default router;