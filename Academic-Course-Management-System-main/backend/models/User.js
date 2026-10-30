/**
 * @file User.js
 * @description Mongoose schema for the system Users. Tracks names, credentials,
 * and system access control roles.
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Full name of the user
  name: { type: String, required: true },
  // Unique email address used for login and identity mapping
  email: { type: String, required: true, unique: true },
  // Securely hashed password string
  password: { type: String, required: true },
  // Role-based Access Control (RBAC) definitions
  role: { type: String, enum: ['Admin', 'Faculty', 'Student'], default: 'Student' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
