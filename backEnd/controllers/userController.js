const User = require("../models/User");



const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log(req.user._id)

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};


const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.address = req.body.address || user.address;

  
  if (req.body.phoneNumbers) {
    user.phoneNumbers = req.body.phoneNumbers;
  }

 
  if (req.body.password) {
    user.password = req.body.password; 
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    address: updatedUser.address,
    phoneNumbers: updatedUser.phoneNumbers,
    role: updatedUser.role,
  });
};


module.exports = {
  getUserProfile,
  updateUserProfile,
};