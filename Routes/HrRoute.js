import express from "express";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import {
  addNewEmployee,
  getEmployees,
  getLeaves,
  updatedLeave,
} from "../Controller/HrController.js";
import { sendEmail } from "../Utils/sendMail.js";
const router = express.Router();

router.get("/leaves", authenticateToken, getLeaves);
router.patch("/leave-status/:id", authenticateToken, updatedLeave);
router.get("/employees", authenticateToken, getEmployees);
router.post("/employees", authenticateToken, addNewEmployee);

export default router;
