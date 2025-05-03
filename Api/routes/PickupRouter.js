import express from "express";
import {
  createPickup,
  getAllPickups,
} from "../controllers/PickupController.js";

const router = express.Router();

// POST - Schedule a pickup
router.post("/", createPickup);

// GET - Fetch all scheduled pickups
router.get("/", getAllPickups);

export default router;
