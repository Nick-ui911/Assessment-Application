import { useState } from "react";
import axiosInstance from "../utils/axios";

const API = axiosInstance;

export default function CreateAssessment() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        type: "mcq",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: 1
      }
    ]);
  };

  const handleSubmit = async () => {
    try {
      await API.post("/assessments", {
        title,
        description,
        questions
      });

      alert("Assessment Created");
      setTitle("");
      setDescription("");
      setQuestions([]);
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12"
      style={{ backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 50%)" }}>
      
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase">Assessment Builder</span>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Create Assessment</h1>
        <p className="text-slate-400 mt-1 text-sm">Build structured quizzes and evaluations for your students.</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-5">

        {/* Meta Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Assessment Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Title</label>
              <input
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                placeholder="e.g. Midterm Exam — Chapter 4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
              <textarea
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
                placeholder="Briefly describe the scope or instructions for this assessment..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        {questions.map((q, index) => (
          <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Question</span>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${q.type === 'mcq' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                {q.type === 'mcq' ? 'Multiple Choice' : 'Text Response'}
              </span>
            </div>

            <div className="space-y-3">
              <input
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                placeholder="Enter your question here..."
                value={q.questionText}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].questionText = e.target.value;
                  setQuestions(updated);
                }}
              />

              <select
                className="w-full bg-slate-800 border border-slate-700 text-slate-300 p-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition appearance-none cursor-pointer"
                value={q.type}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index].type = e.target.value;
                  setQuestions(updated);
                }}
              >
                <option value="mcq">Multiple Choice (MCQ)</option>
                <option value="text">Text Response</option>
              </select>

              {q.type === "mcq" && (
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, i) => (
                    <div key={i} className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <input
                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 pl-7 pr-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[index].options[i] = e.target.value;
                          setQuestions(updated);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Correct Answer</label>
                  <input
                    className="w-full bg-slate-800 border border-slate-700 text-emerald-400 placeholder-slate-600 p-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    placeholder="e.g. A or the answer text"
                    value={q.correctAnswer}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[index].correctAnswer = e.target.value;
                      setQuestions(updated);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Marks</label>
                  <input
                    type="number"
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-600 p-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                    placeholder="1"
                    value={q.marks}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[index].marks = Number(e.target.value);
                      setQuestions(updated);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Question Button */}
        <button
          onClick={addQuestion}
          className="w-full border-2 border-dashed border-slate-700 hover:border-indigo-500 text-slate-500 hover:text-indigo-400 py-4 rounded-2xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Question
        </button>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <div className="text-slate-600 text-sm">
            {questions.length > 0 && (
              <span>{questions.length} question{questions.length !== 1 ? 's' : ''} · {questions.reduce((a, q) => a + (q.marks || 0), 0)} total marks</span>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-150 shadow-lg shadow-indigo-500/20 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Publish Assessment
          </button>
        </div>
      </div>
    </div>
  );
}