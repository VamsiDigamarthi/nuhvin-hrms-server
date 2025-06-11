// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  empId: { type: String, required: true, unique: true },
  password: { type: String, default: null },
  profilePic: { type: String, default: null },
  email: { type: String, default: null },
  mobile: { type: String, default: null },
  gender: { type: String, default: null },
  marriageStatus: {
    type: String,
    enum: ["Married", "Un-Married"],
    default: "Un-Married",
  },
  role: {
    type: String,
    enum: ["Employee", "Hr"],
    default: "Employee",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  jobTitle: { type: String, default: null },
  department: { type: String, default: null },
  shiftTimmings: {
    startTime: { type: String, default: null },
    endTime: { type: String, default: null },
  },
  dob: { type: String, default: null },
  nationality: { type: String, default: null },
  insurance: { type: String, default: null },
  taxId: { type: String, default: null },
  socialInsurance: { type: String, default: null },
  address: {
    primaryAddress: { type: String, default: null },
    country: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    postCode: { type: String, default: null },
  },
  emergencyContact: {
    fullName: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    email: { type: String, default: null },
    gender: { type: String, default: null },
    address: { type: String, default: null },
  },
});

const UserModal = mongoose.model("User", userSchema);
export default UserModal;
