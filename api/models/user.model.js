// models/user.model.js
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Basic auth fields
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String
  },
  
  // Personal information
  fullName: {
    type: String,
    trim: true
  },
  dob: {
    type: Date
  },
  
  // User type
  userType: {
    type: String,
    enum: ["Internal Student", "External Student", "Teacher"]
  },
  
  // Academic information
  district: {
    type: String,
    trim: true
  },
  zone: {
    type: String,
    trim: true
  },
  grade: {
    type: String,
    trim: true
  },
  school: {
    type: String,
    trim: true
  },
  medium: {
    type: String,
    enum: ["Sinhala", "Tamil", "English"]
  },
  institution: {
    type: String,
    trim: true
  },
  
  // Verification & Admin fields
  isVerified: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  },
  verifytoken: {
    type: String
  }
}, {
  timestamps: true
});

// REMOVE the pre-save password hashing middleware entirely
// Keep only the password comparison method
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcryptjs.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;