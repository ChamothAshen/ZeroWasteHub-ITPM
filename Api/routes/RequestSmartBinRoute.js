// // routes/RequestSmartBinRoutes.js
// import express from 'express';
// import  {createSmartBinRequest}  from '../controllers/RequestSmartBinController.js';

// const router = express.Router();

// // Create a new smart bin request
// router.post('/', createSmartBinRequest);

// export default router;

// routes/RequestSmartBinRoutes.js
import express from 'express';
import  {createSmartBinRequest, getAllSmartBinRequests,getSmartBinRequestById}  from '../controllers/RequestSmartBinController.js';

const router = express.Router();

// Create a new smart bin request
router.post('/', createSmartBinRequest);
// Get all smart bin requests
router.get('/smartbins', getAllSmartBinRequests);
// Get smart bin request by ID
router.get('/smartbins/:id', getSmartBinRequestById);



export default router;