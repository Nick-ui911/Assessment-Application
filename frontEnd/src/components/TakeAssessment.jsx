import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axios";

const API = axiosInstance;

export default function TakeAssessment() {
  const { id } = useParams();

  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [current, setCurrent] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);

  const fetchAssessment = async () => {
    try {
      const res = await API.get("/assessments");
      const found = res.data.data.find((a) => a._id === id);
      setAssessment(found);
    } catch (err) {
      console.error("Failed to load assessment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const handleSelect = (questionId, selectedAnswer) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, selectedAnswer } : a
        );
      }
      return [...prev, { questionId, selectedAnswer }];
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await API.post(`/assessments/${id}/submit`, { answers });
      setResult(res.data.result);
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
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
          <p className="text-slate-400 text-sm">Loading assessment...</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-300 font-semibold">Assessment not found</p>
          <p className="text-slate-500 text-sm mt-1">This assessment may have been removed.</p>
        </div>
      </div>
    );
  }

  if (result) {
    const pct = result.percentage?.toFixed(2);
    const passed = parseFloat(pct) >= 50;

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6" style={bgStyle}>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center w-full max-w-md">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${passed ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
            {passed ? (
              <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Assessment Completed</h2>
          <p className="text-slate-400 text-sm mb-8">Here's how you did</p>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3 text-left mb-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Total Questions</span>
              <span className="text-white font-medium">{result.totalQuestions}</span>
            </div>
            <div className="w-full h-px bg-slate-700" />
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Total Marks</span>
              <span className="text-white font-medium">{result.totalMarks}</span>
            </div>
            <div className="w-full h-px bg-slate-700" />
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Your Score</span>
              <span className="text-white font-semibold">{result.score}</span>
            </div>
            <div className="w-full h-px bg-slate-700" />
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Percentage</span>
              <span className={`font-bold text-lg ${passed ? "text-emerald-400" : "text-red-400"}`}>{pct}%</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${passed ? "bg-emerald-500" : "bg-red-500"}`}
              style={{ width: `${Math.min(parseFloat(pct), 100)}%` }}
            />
          </div>
          <p className={`text-xs mt-2 font-medium ${passed ? "text-emerald-400" : "text-red-400"}`}>
            {passed ? "Well done! You passed." : "Keep practicing — you'll get there!"}
          </p>
        </div>
      </div>
    );
  }

  const questions = assessment.questions;
  const totalCount = questions.length;
  const answeredCount = answers.length;
  const allAnswered = answeredCount === totalCount;
  const q = questions[current];
  const currentAnswered = answers.find((a) => a.questionId === q._id);
  const isLast = current === totalCount - 1;

  const getQuestionStatus = (index) => {
    const answered = answers.find((a) => a.questionId === questions[index]._id);
    if (index === current) return "active";
    if (answered) return "answered";
    if (index < current) return "visited";
    return "unseen";
  };

  return (
    <div className="min-h-screen bg-slate-950" style={bgStyle}>

      {/* Sticky top bar */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm truncate">{assessment.title}</span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${totalCount > 0 ? (answeredCount / totalCount) * 100 : 0}%` }}
                />
              </div>
              <span className="text-slate-400 text-xs font-medium whitespace-nowrap">{answeredCount}/{totalCount}</span>
            </div>

            <button
              onClick={() => setPanelOpen(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="hidden sm:inline">Navigator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="max-w-2xl mx-auto px-6 py-10">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Question {current + 1} <span className="text-slate-700">/ {totalCount}</span>
            </span>
            {currentAnswered ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Answered
              </span>
            ) : (
              <span className="text-xs text-slate-600 font-medium bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full">
                Not answered
              </span>
            )}
          </div>

          <h4 className="text-white font-medium text-base leading-relaxed mb-6">{q.questionText}</h4>

          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              const selected = answers.find(
                (a) => a.questionId === q._id && a.selectedAnswer === opt
              );
              return (
                <label
                  key={i}
                  className={`flex items-center gap-3 cursor-pointer p-3.5 rounded-xl border transition-all duration-150
                    ${selected
                      ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-300"
                      : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
                    }`}
                >
                  <input
                    type="radio"
                    name={q._id}
                    value={opt}
                    onChange={() => handleSelect(q._id, opt)}
                    className="sr-only"
                  />
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected ? "border-indigo-400 bg-indigo-400" : "border-slate-600"}`}>
                    {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span className="text-xs font-bold text-slate-500 w-4">{String.fromCharCode(65 + i)}.</span>
                  <span className="text-sm">{opt}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrent((c) => c - 1)}
            disabled={current === 0}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          {!isLast ? (
            <button
              onClick={() => setCurrent((c) => c + 1)}
              disabled={!currentAnswered}
              title={!currentAnswered ? "Answer this question to proceed" : ""}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:border disabled:border-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 shadow-lg shadow-indigo-500/20 disabled:shadow-none"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-slate-800 disabled:border disabled:border-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 shadow-lg shadow-indigo-500/20 disabled:shadow-none"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {allAnswered ? "Submit Assessment" : `Answer all to submit (${answeredCount}/${totalCount})`}
                </>
              )}
            </button>
          )}
        </div>

        {!currentAnswered && !isLast && (
          <p className="text-center text-amber-500/70 text-xs mt-3">
            Answer this question to unlock the next one.
          </p>
        )}
      </div>

      {/* Question Navigator Panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setPanelOpen(false)}
          />

          <div className="w-72 bg-slate-900 border-l border-slate-800 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div>
                <h3 className="text-white font-semibold text-sm">Question Navigator</h3>
                <p className="text-slate-500 text-xs mt-0.5">{answeredCount} of {totalCount} answered</p>
              </div>
              <button
                onClick={() => setPanelOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Legend */}
            <div className="px-5 py-3 border-b border-slate-800 grid grid-cols-2 gap-y-1.5 gap-x-3">
              {[
                { cls: "bg-indigo-500", label: "Current" },
                { cls: "bg-emerald-500", label: "Answered" },
                { cls: "bg-slate-600", label: "Visited" },
                { cls: "bg-slate-800 border border-slate-700", label: "Not visited" },
              ].map(({ cls, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded-sm flex-shrink-0 ${cls}`} />
                  <span className="text-slate-400 text-xs">{label}</span>
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, i) => {
                  const status = getQuestionStatus(i);
                  const canJump = status === "answered" || status === "active" || status === "visited";

                  const styleMap = {
                    active: "bg-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-500/30 scale-110",
                    answered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30",
                    visited: "bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600",
                    unseen: "bg-slate-800 text-slate-600 border-slate-700 opacity-60 cursor-not-allowed",
                  };

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (canJump) {
                          setCurrent(i);
                          setPanelOpen(false);
                        }
                      }}
                      disabled={!canJump}
                      className={`aspect-square rounded-xl border text-xs font-bold flex items-center justify-center transition-all duration-150 ${styleMap[status]}`}
                    >
                      {status === "answered" ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-800">
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2">
                <div
                  className="h-1.5 bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalCount > 0 ? (answeredCount / totalCount) * 100 : 0}%` }}
                />
              </div>
              <p className="text-slate-500 text-xs text-center">
                {totalCount - answeredCount === 0 ? "All questions answered!" : `${totalCount - answeredCount} remaining`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}