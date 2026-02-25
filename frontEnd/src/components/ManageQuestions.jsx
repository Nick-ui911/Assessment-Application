import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axios";

const API = axiosInstance;

export default function ManageQuestions() {
  const { id } = useParams();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  const fetchAssessment = async () => {
    try {
      const res = await API.get("/assessments");
      const found = res.data.data.find((a) => a._id === id);

      if (!found) {
        setError("Assessment not found");
        return;
      }

      setAssessment(found);
    } catch (err) {
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessment();
  }, []);

  const handleAddQuestion = async () => {
    try {
      await API.put(`/assessments/${id}/questions`, newQuestion);
      setNewQuestion({
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      });
      fetchAssessment();
    } catch (err) {
      alert("Failed to add question");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await API.delete(`/assessments/${id}/questions/${questionId}`);
      fetchAssessment();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const bgStyle = {
    backgroundImage:
      "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 50%)",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950" style={bgStyle}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950" style={bgStyle}>
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-300 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12" style={bgStyle}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase">Assessment Builder</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Manage Questions</h1>
          <p className="text-slate-400 mt-1 text-sm">
            <span className="text-indigo-400 font-medium">{assessment.title}</span>
            {" · "}
            {assessment.questions?.length || 0} question{(assessment.questions?.length || 0) !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Existing Questions */}
        <div className="space-y-4 mb-8">
          {assessment.questions?.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
              <p className="text-slate-500 text-sm">No questions yet. Add your first one below.</p>
            </div>
          )}

          {assessment.questions?.map((q, index) => (
            <div key={q._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors duration-200">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <h4 className="text-white font-medium leading-relaxed pt-0.5">{q.questionText}</h4>
                </div>

                <button
                  onClick={() => handleDeleteQuestion(q._id)}
                  className="flex-shrink-0 flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pl-10">
                {q.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm ${
                      opt === q.correctAnswer
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    <span className="text-xs font-bold opacity-50">{String.fromCharCode(65 + i)}</span>
                    <span className="truncate">{opt}</span>
                    {opt === q.correctAnswer && (
                      <svg className="w-3.5 h-3.5 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add Question */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Add New Question</h3>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter your question here..."
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              value={newQuestion.questionText}
              onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-2">
              {newQuestion.options.map((opt, index) => (
                <div key={index} className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 pl-7 pr-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                    value={opt}
                    onChange={(e) => {
                      const updatedOptions = [...newQuestion.options];
                      updatedOptions[index] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: updatedOptions });
                    }}
                  />
                </div>
              ))}
            </div>

            <input
              type="text"
              placeholder="Correct answer (must match one of the options above)"
              className="w-full bg-slate-800 border border-slate-700 text-emerald-400 placeholder-slate-600 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              value={newQuestion.correctAnswer}
              onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
            />

            <button
              onClick={handleAddQuestion}
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-150 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 mt-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Question
            </button>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6 pb-10">
          Changes are saved immediately when you add or delete questions.
        </p>
      </div>
    </div>
  );
}