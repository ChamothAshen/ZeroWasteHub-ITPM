import express from "express";
import {
  createInventory,
  getInventory,
  updateInventory,
  deleteInventory,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/addInv", createInventory);
router.get("/getInv", getInventory);
router.put("editInv/:id", updateInventory);
router.delete("deleteInv/:id", deleteInventory);

export default router;
