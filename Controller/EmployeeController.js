import dayjs from "dayjs";
import LeavesModal from "../Modals/LeavesModal.js";
import { sendResponse } from "../Utils/sendResponse.js";
import logger from "../Utils/logger.js";

export const applyLeaves = async (req, res) => {
  logger.info("LEAVSE API HIT");
  const { userId } = req;
  console.log(userId);
  const { leaveType, startDate, endDate, reason } = req.body;

  try {
    const numberOfDays = dayjs(endDate).diff(dayjs(startDate), "day") + 1;

    const leave = new LeavesModal({
      user: userId,
      leaveType,
      startDate,
      endDate,
      reason,
      numberOfDays,
      document: req.file ? req.file.filename : null,
    });

    await leave.save();
    return sendResponse(res, 200, "Leave request created successfully");
  } catch (error) {
    console.error("Leave request error:", error);
    return sendResponse(res, 500, "Failed to create leave request");
  }
};

export const getLeaves = async (req, res) => {
  const { date } = req.query;

  try {
    const query = {
      user: req.userId,
    };

    if (date) {
      query.startDate = { $lte: date };
      query.endDate = { $gte: date };
    }

    const leaves = await LeavesModal.find(query).sort({
      startDate: -1,
      status: -1,
    });

    return res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching leaves:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
