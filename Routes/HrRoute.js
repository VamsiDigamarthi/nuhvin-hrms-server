import express from "express";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import {
  getEmployees,
  getLeaves,
  updatedLeave,
} from "../Controller/HrController.js";
const router = express.Router();

router.get("/leaves", authenticateToken, getLeaves);
router.patch("/leave-status/:id", authenticateToken, updatedLeave);
router.get("/employees", authenticateToken, getEmployees);

export default router;
