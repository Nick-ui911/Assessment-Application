const User = require('../models/User');
const AssessmentResult = require("../models/AssessmentResult");

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword || "";

    const skip = (page - 1) * limit;

    // 🔎 Search filter
    const searchFilter = keyword
      ? {
          $or: [
            { firstName: { $regex: keyword, $options: "i" } },
            { lastName: { $regex: keyword, $options: "i" } },
            { email: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};



    const filter = { ...searchFilter };
    const totalUsers = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select("-password") // never send password
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      users,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      hasNextPage: page < Math.ceil(totalUsers / limit),
      hasPrevPage: page > 1,
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 1️⃣ Delete all assessment results of this user
    await AssessmentResult.deleteMany({ user: userId });

    // 2️⃣ Delete user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User and all related results deleted successfully",
    });

  } catch (error) {
    console.error("Delete User Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getUserResultsByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1️⃣ Check if user exists
    const user = await User.findById(userId).select(
      "firstName lastName email role"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Get all results of this user
    const results = await AssessmentResult.find({
      user: userId,
    })
      .populate("assessment", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      totalAttempts: results.length,
      results,
    });

  } catch (error) {
    console.error("Admin Get User Results Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
module.exports = {
  getUsers,
  deleteUser,
  getUserResultsByAdmin,

};