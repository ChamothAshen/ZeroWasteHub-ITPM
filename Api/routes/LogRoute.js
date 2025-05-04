import express from "express";
import {
  getLogs,
  addLog,
  updateLog,
  deleteLog,
  approveLog,
  rejectLog,
} from "../controllers/LogController.js";

const router = express.Router();

router.get("/", getLogs);
router.post("/", addLog);
router.put("/:id", updateLog);
router.delete("/:id", deleteLog);
router.put("/:id/approve", approveLog);
router.put("/:id/reject", rejectLog);

export default router;
