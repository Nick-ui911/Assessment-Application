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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading results...
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">
            No Results Found
          </h2>
          <p className="text-gray-600">
            You haven’t attempted any assessments yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">
          My Assessment Results
        </h2>

        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result._id}
              className="bg-white p-6 rounded-2xl shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">
                  {result.assessment?.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Attempted on{" "}
                  {new Date(result.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  Score: {result.score} / {result.totalMarks}
                </p>
                <p
                  className={`font-bold ${
                    result.percentage >= 50
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {result.percentage.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}