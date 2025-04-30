// routes/CollectRequestRoutes.js
import express from 'express';
import { 
  createCollectionRequest, 
  deleteCollectionRequest, 
  getAllCollectionRequests, 
  getUserCollectionRequests,
  updateCollectionRequest 
} from '../controllers/CollectRequestController.js';

const router = express.Router();

// Create a new collection request
router.post('/', createCollectionRequest);

// Get all collection requests
router.get('/', getAllCollectionRequests);

// Get collection requests by user ID
router.get('/user/:userId', getUserCollectionRequests);

// Update a collection request by ID
router.put('/:id', updateCollectionRequest);

// Delete a collection request by ID
router.delete('/:id', deleteCollectionRequest);

export default router;