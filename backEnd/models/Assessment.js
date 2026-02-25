const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["mcq", "text"],
    default: "mcq"
  },
  options: [
    {
      type: String
    }
  ],
  correctAnswer: {
    type: String
  },
  marks: {
    type: Number,
    default: 1
  }
});

const assessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    totalMarks: {
      type: Number,
      default: 0
    },
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", assessmentSchema);