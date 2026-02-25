const express = require("express");
const router = express.Router();
const {
  getUsers,
  deleteUser,
  getUserResultsByAdmin,
} = require("../controllers/adminController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

router.get("/users", authMiddleware, isAdmin, getUsers);

router.delete("/users/:id", authMiddleware, isAdmin, deleteUser);
router.get(
  "/users/:id/results",
  authMiddleware,
  isAdmin,
  getUserResultsByAdmin,
);

module.exports = router;
