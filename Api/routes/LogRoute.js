import express from "express";
import {
  getLogs,
  addLog,
  updateLog,
  deleteLog,
} from "../controllers/LogController.js";

const router = express.Router();

router.get("/", getLogs);
router.post("/", addLog);
router.put("/:id", updateLog);
router.delete("/:id", deleteLog);

export default router;
