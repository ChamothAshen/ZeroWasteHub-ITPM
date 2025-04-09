// routes/RequestSmartBinRoutes.js
import express from 'express';
import  {createSmartBinRequest}  from '../controllers/RequestSmartBinController.js';

const router = express.Router();

// Create a new smart bin request
router.post('/', createSmartBinRequest);

export default router;