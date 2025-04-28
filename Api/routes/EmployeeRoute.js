import express from "express";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../controllers/EmployeeController.js";

const router = express.Router();

router.get("/", getEmployees);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
