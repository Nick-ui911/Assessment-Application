const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const assessmentController = require("../controllers/assessmentController");

// Create
router.post(
  "/",
  authMiddleware,
  isAdmin,
  assessmentController.createAssessment,
);

// Update assessment info
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  assessmentController.updateAssessment,
);

// Delete assessment
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  assessmentController.deleteAssessment,
);

// Add question
router.put(
  "/:id/questions",
  authMiddleware,
  isAdmin,
  assessmentController.addQuestion,
);

// Delete question
router.delete(
  "/:assessmentId/questions/:questionId",
  authMiddleware,
  isAdmin,
  assessmentController.deleteQuestion,
);

// Get all assessments
router.get("/", authMiddleware, assessmentController.getAllAssessments);

// user submit 
router.post(
  "/:id/submit",
  authMiddleware,
  assessmentController.submitAssessment
);

router.get("/results", authMiddleware, assessmentController.getUserResults);
module.exports = router;
