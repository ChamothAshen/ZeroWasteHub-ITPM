
import express from 'express';
import  {createSmartBinRequest, deleteSmartBinRequest, getAllSmartBinRequests,getSmartBinRequestById, updateSmartBinRequest}  from '../controllers/RequestSmartBinController.js';

const router = express.Router();

// Create a new smart bin request
router.post('/', createSmartBinRequest);
// Get all smart bin requests
router.get('/smartbins', getAllSmartBinRequests);
// Get smart bin request by ID
router.get('/smartbins/:id', getSmartBinRequestById);

router.put('/:id',updateSmartBinRequest);

router.delete('/:id',deleteSmartBinRequest);



export default router;