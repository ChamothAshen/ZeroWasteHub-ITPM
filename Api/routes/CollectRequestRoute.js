// routes/CollectRequestRoutes.js
import express from 'express';
import { createCollectionRequest, deleteCollectionRequest, getAllCollectionRequests, getUserCollectionRequests } from '../controllers/CollectRequestController.js';

const router = express.Router();

// Create a new collection request
router.post('/', createCollectionRequest);
router.get('/', getAllCollectionRequests);

// Get collection requests by user ID
router.get('/user/:userId', getUserCollectionRequests);

// Delete a collection request by ID
router.delete('/:id', deleteCollectionRequest);
export default router;