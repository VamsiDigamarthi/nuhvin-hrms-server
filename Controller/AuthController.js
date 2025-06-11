import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModal from "../Modals/UserModal.js";
import logger from "../Utils/logger.js";
import { sendResponse } from "../Utils/sendResponse.js";

export const login = async (req, res) => {
  logger.info("LOGIN API HIT");
  const { empId, password } = req.body;
  try {
    const user = await UserModal.findOne({ empId });

    if (!user) return sendResponse(res, 404, "User not found");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return sendResponse(res, 404, "Invalid credentials");

    const token = jwt.sign(
      { userId: user._id, empId: user.empId },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" }
    );

    return sendResponse(res, 201, "Login successful", null, {
      token,
      role: user.role,
    });
  } catch (error) {
    logger.error(`Login Failed ${error?.message}`);
    return sendResponse(res, 404, "Login Failed", error);
  }
};

export const signup = async (req, res) => {
  logger.info("SIGNUP API HIT");
  const { name, empId, password } = req.body;
  try {
    const existingUser = await UserModal.findOne({ empId });

    if (existingUser)
      return sendResponse(res, 400, "Employee ID already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModal({
      name,
      empId,
      password: hashedPassword,
    });

    await newUser.save();

    return sendResponse(res, 201, "User registered successfully");
  } catch (error) {
    logger.error(`Signup Failed: ${error?.message}`);
    return sendResponse(res, 404, "Signup Failed", error);
  }
};
