import express from "express";
import {
  createInventory,
  getInventory,
  updateInventory,
  deleteInventory,
  getInventoryById,
  getTodayWeight,
  deleteEntry,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/addInv", createInventory);
router.get("/getInv", getInventory);
router.put("/editInv/:id", updateInventory);
router.delete("/deleteInv/:id", deleteInventory);
router.delete("/deleteEntry/:companyId/:entryId", deleteEntry);
router.get("/getInv/:id", getInventoryById);
router.get("/getTodayWeight", getTodayWeight);

export default router;
