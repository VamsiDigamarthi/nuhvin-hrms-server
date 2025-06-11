import LeavesModal from "../Modals/LeavesModal.js";
import UserModal from "../Modals/UserModal.js";
import { sendEmail } from "../Utils/sendMail.js";

export const getLeaves = async (req, res) => {
  const { page = 1, limit = 10, status, leaveType } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  try {
    const query = {};

    if (status) {
      query.status = status;
    }

    if (leaveType) {
      query.leaveType = leaveType;
    }

    const leaves = await LeavesModal.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .populate("user", "name email profilePic");

    const total = await LeavesModal.countDocuments(query);

    return res.status(200).json({
      leaves,
      totalPages: Math.ceil(total / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching leaves:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//   const { page = 1, limit = 10, search = "" } = req.query;
//   const pageNumber = parseInt(page);
//   const limitNumber = parseInt(limit);
//   const searchQuery = search.trim().toLowerCase();

//   try {
//     // Build search query on relevant fields
//     const query = searchQuery
//       ? {
//           $or: [
//             { eventName: { $regex: searchQuery, $options: "i" } },
//             { description: { $regex: searchQuery, $options: "i" } },
//             { eventType: { $regex: searchQuery, $options: "i" } },
//             { location: { $regex: searchQuery, $options: "i" } },
//           ],
//         }
//       : {};

//     // Count total matching documents
//     const total = await EventModal.countDocuments(query);

//     // Fetch

export const updatedLeave = async (req, res) => {
  const { id } = req.params;
  const { status, hrNote } = req.body;

  try {
    await LeavesModal.findByIdAndUpdate(id, { status, hrNote }, { new: true });
    return res.status(200).json({
      message: "Leave status updated successfully",
    });
  } catch (error) {
    console.error("Error updating leave status:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getEmployees = async (req, res) => {
  const { page = 1, limit = 10, search, department, status } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { empId: { $regex: search, $options: "i" } },
    ];
  }
  if (department) {
    query.department = department;
  }
  if (status) {
    query.status = status;
  }

  try {
    const employees = await UserModal.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await UserModal.countDocuments(query);

    return res.status(200).json({
      employees,
      totalPages: Math.ceil(total / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error get employees", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const addNewEmployee = async (req, res) => {
  try {
    const {
      name,
      empId,
      email,
      mobile,
      department,
      jobTitle,
      dob,
      seatNumber,
    } = req.body;

    // Validate required fields manually if needed
    if (
      !name ||
      !empId ||
      !email ||
      !mobile ||
      !department ||
      !jobTitle ||
      !dob
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // Check if empId or email already exists
    const existingEmp = await UserModal.findOne({
      $or: [{ empId }, { email }],
    });
    if (existingEmp) {
      return res
        .status(409)
        .json({ message: "Employee with same ID or Email already exists" });
    }

    // Create new employee
    const newEmployee = new UserModal({
      name,
      empId,
      email,
      mobile,
      department,
      jobTitle,
      dob,
      seatNumber,
    });

    await newEmployee.save();

    try {
      const url = `http://localhost:5173/signup/${empId}/${email}/${jobTitle}`;
      sendEmail(
        "Welcome Onboarding",
        ` 
         <h1>Welcome Onboarding</h1>
          <p>Supraj will tell the mater later</p>
          <a href=${url}>Setup Your Password</a>
        `,
        newEmployee.email
      );
    } catch (err) {
      console.log("Error Sending Mail", err);
    }

    return res.status(201).json({
      message: "Employee created successfully",
    });
  } catch (error) {
    console.error("Add Employee Error:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

export const updateEmployeeProfile = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  try {
    const updatedEmployee = await UserModal.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
