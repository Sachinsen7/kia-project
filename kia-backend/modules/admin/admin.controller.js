const Admin = require("../admin/admin.model");
const User = require("../users/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );


    res.status(200).json({
      success: true,
      role: "admin",
      message: "Login successful",
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
// Approve user
const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User approved", user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Decline user
const declineUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User declined", user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = { getAllUsers, loginAdmin, approveUser, declineUser };
