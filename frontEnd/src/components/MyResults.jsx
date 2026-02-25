import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";

const API = axiosInstance;

export default function MyResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      const res = await API.get("/assessments/results");
      setResults(res.data.results);
    } catch (err) {
      console.error("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const bgStyle = {
    backgroundImage:
      "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 50%)",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950" style={bgStyle}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm">Loading results...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6" style={bgStyle}>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-14 text-center max-w-sm w-full">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-5">
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-white font-semibold text-lg mb-1">No Results Yet</h2>
          <p className="text-slate-400 text-sm">You haven't attempted any assessments yet.</p>
        </div>
      </div>
    );
  }

  const passed = results.filter((r) => r.percentage >= 50).length;
  const avgPct = (results.reduce((a, r) => a + r.percentage, 0) / results.length).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12" style={bgStyle}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase">Assessment Builder</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">My Results</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {results.length} assessment{results.length !== 1 ? "s" : ""} attempted
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{results.length}</p>
            <p className="text-slate-500 text-xs mt-1">Total Taken</p>
          </div>
          <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{passed}</p>
            <p className="text-slate-500 text-xs mt-1">Passed</p>
          </div>
          <div className="bg-slate-900 border border-indigo-500/20 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-indigo-400">{avgPct}%</p>
            <p className="text-slate-500 text-xs mt-1">Avg. Score</p>
          </div>
        </div>

        {/* Results list */}
        <div className="space-y-3">
          {results.map((result, index) => {
            const pct = result.percentage.toFixed(2);
            const pass = result.percentage >= 50;

            return (
              <div
                key={result._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left */}
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-white font-semibold text-sm truncate">{result.assessment?.title}</h3>
                      <p className="text-slate-500 text-xs mt-0.5">
                        Attempted on {new Date(result.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-white text-sm font-semibold">
                      {result.score} <span className="text-slate-600 font-normal">/ {result.totalMarks}</span>
                    </p>
                    <p className={`text-lg font-bold ${pass ? "text-emerald-400" : "text-red-400"}`}>
                      {pct}%
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${pass ? "bg-emerald-500" : "bg-red-500"}`}
                      style={{ width: `${Math.min(result.percentage, 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium flex-shrink-0 ${pass ? "text-emerald-400" : "text-red-400"}`}>
                    {pass ? "Passed" : "Failed"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}