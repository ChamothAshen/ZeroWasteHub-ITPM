// routes/CollectRequestRoutes.js
import express from 'express';
import { createCollectionRequest } from '../controllers/CollectRequestController.js';

const router = express.Router();

// Create a new collection request
router.post('/', createCollectionRequest);

export default router;