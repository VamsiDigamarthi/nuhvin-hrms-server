import express from "express";
import { applyLeaves, getLeaves } from "../Controller/EmployeeController.js";
import { handleMulterUpload } from "../Middlewares/handleMulterUpload.js";
import upload from "../Middlewares/fileUpload.js";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
const router = express.Router();

router.post(
  "/apply-leaves",
  authenticateToken,
  handleMulterUpload(upload.single("image")),
  applyLeaves
);

router.get("/apply-leaves", authenticateToken, getLeaves);
export default router;
