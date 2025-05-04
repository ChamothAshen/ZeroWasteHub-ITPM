import express from 'express';
import { getBinCountsByTypeAndSize, createOrUpdateBinStatusCount} from '../controllers/binRequestController.js'; // Adjust the import path as necessary

const router = express.Router();

router.post('/',createOrUpdateBinStatusCount); // Create or update bin status count
router.get('/bin-status-count/:binType/:binSize', getBinCountsByTypeAndSize);

export default router;
