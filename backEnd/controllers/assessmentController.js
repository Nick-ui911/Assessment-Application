const Assessment = require("../models/Assessment");
const AssessmentResult = require("../models/AssessmentResult");
const assessmentResult = require("../models/AssessmentResult");

const createAssessment = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title and at least one question are required"
      });
    }

    const totalMarks = questions.reduce(
      (sum, q) => sum + (q.marks || 1),
      0
    );

    const assessment = await Assessment.create({
      title,
      description,
      questions,
      totalMarks,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



const updateAssessment = async (req, res) => {
  try {
    const { title, description } = req.body;

    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    assessment.title = title || assessment.title;
    assessment.description = description || assessment.description;

    await assessment.save();

    res.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    await assessment.deleteOne();

    res.json({
      success: true,
      message: "Assessment deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addQuestion = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    assessment.questions.push(req.body);

    // recalc total marks
    assessment.totalMarks = assessment.questions.reduce(
      (sum, q) => sum + (q.marks || 1),
      0
    );

    await assessment.save();

    res.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const deleteQuestion = async (req, res) => {
  try {
    const { assessmentId, questionId } = req.params;

    const assessment = await Assessment.findById(assessmentId);

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    const question = assessment.questions.id(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.deleteOne();

    // recalc total marks
    assessment.totalMarks = assessment.questions.reduce(
      (sum, q) => sum + (q.marks || 1),
      0
    );

    await assessment.save();

    res.json({
      success: true,
      message: "Question deleted successfully",
      data: assessment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    // If user is NOT admin → hide correctAnswer
    if (req.user.role !== "admin") {
      const filteredAssessments = assessments.map((assessment) => {
        const obj = assessment.toObject();

        obj.questions = obj.questions.map((q) => {
          delete q.correctAnswer;
          return q;
        });

        return obj;
      });

      return res.status(200).json({
        success: true,
        count: filteredAssessments.length,
        data: filteredAssessments
      });
    }

    // Admin gets full data
    res.status(200).json({
      success: true,
      count: assessments.length,
      data: assessments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const submitAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    // 1️⃣ Check assessment
    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    // 2️⃣ Prevent multiple attempts (optional)
    // const existingAttempt = await AssessmentResult.findOne({
    //   user: req.user._id,
    //   assessment: id,
    // });

    // if (existingAttempt) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "You have already attempted this assessment",
    //   });
    // }

    let score = 0;
    let totalMarks = 0;

    // 3️⃣ Convert answers array into Map (faster lookup)
    const answerMap = new Map(
      answers.map((a) => [a.questionId, a.selectedAnswer])
    );

    assessment.questions.forEach((question) => {
      const marks = question.marks || 1;
      totalMarks += marks;

      if (
        answerMap.get(question._id.toString()) ===
        question.correctAnswer
      ) {
        score += marks;
      }
    });

    const totalQuestions = assessment.questions.length;

    const percentage =
      totalMarks > 0 ? (score / totalMarks) * 100 : 0;

    // 4️⃣ Save result in DB
    const result = await assessmentResult.create({
      user: req.user._id,
      assessment: id,
      score,
      totalMarks,
      percentage: Number(percentage.toFixed(2)),
      answers,
    });

    // 5️⃣ Send response
    res.status(200).json({
      success: true,
      message: "Assessment submitted successfully",
      result: {
        totalQuestions,
        totalMarks,
        score,
        percentage: Number(percentage.toFixed(2)),
        attemptId: result._id,
      },
    });
  } catch (error) {
    console.error("Submit Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Submission failed",
    });
  }
};
const getUserResults = async (req, res) => {
  try {
    const userId = req.user._id;

    const results = await AssessmentResult.find({ user: userId })
      .populate("assessment", "title description") // only fetch needed fields
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });

  } catch (error) {
    console.error("Get User Results Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch results",
    });
  }
};
module.exports = {
  createAssessment,
  updateAssessment,
  deleteAssessment,
  addQuestion,
  deleteQuestion,
  getAllAssessments,
  submitAssessment,
  getUserResults,


};