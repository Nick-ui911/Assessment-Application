import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";

const API = axiosInstance;

export default function UserAssessments() {
  const [assessments, setAssessments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/assessments");
      setAssessments(res.data.data);
    };
    fetchData();
  }, []);

  return (
    <div
      className="min-h-screen bg-slate-950 p-6 md:p-12"
      style={{ backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 50%)" }}
    >
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
        <h1 className="text-4xl font-bold text-white tracking-tight">Available Assessments</h1>
        <p className="text-slate-400 mt-1 text-sm">
          {assessments.length > 0
            ? `${assessments.length} assessment${assessments.length !== 1 ? "s" : ""} ready to take`
            : "No assessments available right now."}
        </p>
      </div>

      {/* List */}
      <div className="max-w-2xl mx-auto space-y-4">
        {assessments.map((a, index) => (
          <div
            key={a._id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between gap-5 hover:border-slate-700 transition-colors duration-200"
          >
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>
              <div className="min-w-0">
                <h3 className="text-white font-semibold text-base truncate">{a.title}</h3>
                {a.description && (
                  <p className="text-slate-400 text-sm mt-0.5 line-clamp-2">{a.description}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => navigate(`/assessment/${a._id}`)}
              className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 shadow-lg shadow-indigo-500/20 flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}