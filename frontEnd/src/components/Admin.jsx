import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Admin = () => {
  const user = useSelector((store) => store.user.user);
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [userResults, setUserResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);

  const [userAverages, setUserAverages] = useState({});
  const [sortOrder, setSortOrder] = useState("none");

  // Track which user IDs are generating a PDF right now
  const [downloadingIds, setDownloadingIds] = useState(new Set());

  //  Data Fetching
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/admin/users?page=${page}&limit=${limit}&keyword=${search}`
      );
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotalUsers(data.totalUsers);
      setError(null);
      fetchAllUserAverages(data.users);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUserAverages = async (userList) => {
    const entries = await Promise.all(
      userList.map(async (u) => {
        try {
          const { data } = await axiosInstance.get(`/admin/users/${u._id}/results`);
          const results = data.results || [];
          if (results.length === 0) return [u._id, null];
          const avg = results.reduce((sum, r) => sum + r.percentage, 0) / results.length;
          return [u._id, { avg, count: results.length }];
        } catch {
          return [u._id, null];
        }
      })
    );
    setUserAverages(Object.fromEntries(entries));
  };

  useEffect(() => {
    if (user?.role !== "admin") return;
    const delay = setTimeout(() => fetchUsers(), 400);
    return () => clearTimeout(delay);
  }, [page, search, limit]);

  useEffect(() => {
    setPage(1);
  }, [limit]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    const previousUsers = users;
    setUsers(users.filter((u) => u._id !== userId));
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch {
      setUsers(previousUsers);
      setError("Delete failed.");
    }
  };

  const fetchUserResults = async (userId) => {
    try {
      setResultsLoading(true);
      const { data } = await axiosInstance.get(`/admin/users/${userId}/results`);
      setSelectedUser(data.user);
      setUserResults(data.results);
    } catch {
      alert("Failed to fetch results");
    } finally {
      setResultsLoading(false);
    }
  };

  // PDF Download 
  const handleDownloadPDF = async (u) => {
    setDownloadingIds((prev) => new Set(prev).add(u._id));
    try {
      const { data } = await axiosInstance.get(`/admin/users/${u._id}/results`);
      const results = data.results || [];

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 18;

      // ── Header bar ──────────────────────────────────────────────
      doc.setFillColor(67, 56, 202);
      doc.rect(0, 0, pageW, 28, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text("Assessment Result Report", margin, 13);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageW - margin, 13, { align: "right" });

      // ── User info card ───────────────────────────────────────────
      doc.setFillColor(241, 242, 255);
      doc.roundedRect(margin, 34, pageW - margin * 2, 28, 3, 3, "F");
      doc.setTextColor(30, 30, 60);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(`${u.firstName} ${u.lastName}`, margin + 6, 44);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 120);
      doc.text(`Email: ${u.email}`, margin + 6, 51);
      doc.text(`Role: ${u.role}`, margin + 6, 57);
      doc.text(`Member since: ${new Date(u.createdAt).toLocaleDateString()}`, margin + 90, 51);

      // ── Summary stat boxes ───────────────────────────────────────
      const avg =
        results.length > 0
          ? results.reduce((s, r) => s + r.percentage, 0) / results.length
          : null;
      const passed = results.filter((r) => r.percentage >= 50).length;
      const failed = results.length - passed;

      const boxY = 68;
      const boxH = 20;
      const boxW = (pageW - margin * 2 - 8) / 3;

      [
        { label: "Total Assessments", value: results.length, color: [224, 231, 255], textColor: [67, 56, 202] },
        { label: "Passed", value: passed, color: [209, 250, 229], textColor: [6, 120, 70] },
        { label: "Failed", value: failed, color: [254, 226, 226], textColor: [185, 28, 28] },
      ].forEach((box, i) => {
        const bx = margin + i * (boxW + 4);
        doc.setFillColor(...box.color);
        doc.roundedRect(bx, boxY, boxW, boxH, 3, 3, "F");
        doc.setTextColor(...box.textColor);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(String(box.value), bx + boxW / 2, boxY + 10, { align: "center" });
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text(box.label, bx + boxW / 2, boxY + 16, { align: "center" });
      });

      // Average score pill
      if (avg !== null) {
        const avgColor = avg >= 75 ? [6, 120, 70] : avg >= 50 ? [161, 98, 7] : [185, 28, 28];
        const avgBg = avg >= 75 ? [209, 250, 229] : avg >= 50 ? [254, 243, 199] : [254, 226, 226];
        doc.setFillColor(...avgBg);
        doc.roundedRect(pageW - margin - 38, boxY, 38, boxH, 3, 3, "F");
        doc.setTextColor(...avgColor);
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.text(`${avg.toFixed(1)}%`, pageW - margin - 19, boxY + 10, { align: "center" });
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text("Average Score", pageW - margin - 19, boxY + 16, { align: "center" });
      }

      // ── Section title ────────────────────────────────────────────
      doc.setTextColor(30, 30, 60);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Assessment Breakdown", margin, 97);

      if (results.length === 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text("No assessments attempted yet.", margin, 108);
      } else {
        autoTable(doc, {
          startY: 101,
          head: [["#", "Assessment Title", "Score", "Percentage", "Status", "Date"]],
          body: results.map((r, idx) => [
            idx + 1,
            r.assessment?.title || "—",
            `${r.score} / ${r.totalMarks}`,
            `${r.percentage.toFixed(2)}%`,
            r.percentage >= 50 ? "Pass" : "Fail",
            new Date(r.createdAt).toLocaleDateString(),
          ]),
          margin: { left: margin, right: margin },
          styles: {
            fontSize: 9,
            cellPadding: 4,
            font: "helvetica",
            textColor: [30, 30, 60],
          },
          headStyles: {
            fillColor: [67, 56, 202],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 8,
          },
          alternateRowStyles: { fillColor: [246, 247, 255] },
          columnStyles: {
            0: { cellWidth: 10, halign: "center" },
            2: { cellWidth: 24, halign: "center" },
            3: { cellWidth: 24, halign: "center" },
            4: { cellWidth: 18, halign: "center", fontStyle: "bold" },
            5: { cellWidth: 26, halign: "center" },
          },
          didDrawCell: (cellData) => {
            if (cellData.column.index === 4 && cellData.section === "body") {
              const val = cellData.cell.raw;
              doc.setTextColor(...(val === "Pass" ? [6, 120, 70] : [185, 28, 28]));
              doc.setFont("helvetica", "bold");
              doc.text(
                val,
                cellData.cell.x + cellData.cell.width / 2,
                cellData.cell.y + cellData.cell.height / 2 + 1,
                { align: "center" }
              );
            }
          },
        });
      }

      // ── Footer ───────────────────────────────────────────────────
      doc.setFillColor(240, 240, 255);
      doc.rect(0, pageH - 12, pageW, 12, "F");
      doc.setTextColor(120, 120, 160);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("Assessment Builder — Admin Report", margin, pageH - 4);
      doc.text("Page 1", pageW - margin, pageH - 4, { align: "right" });

      const fileName = `${u.firstName}_${u.lastName}_results.pdf`
        .replace(/\s+/g, "_")
        .toLowerCase();
      doc.save(fileName);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF.");
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(u._id);
        return next;
      });
    }
  };
 

  if (!isAuthenticated || !user) return <Navigate to="/auth" replace />;
  if (user.role !== "admin") return <Navigate to="/profile" replace />;

  const sortedUsers = [...users].sort((a, b) => {
    if (sortOrder === "none") return 0;
    const avgA = userAverages[a._id]?.avg ?? null;
    const avgB = userAverages[b._id]?.avg ?? null;
    if (avgA === null && avgB === null) return 0;
    if (avgA === null) return 1;
    if (avgB === null) return -1;
    return sortOrder === "asc" ? avgA - avgB : avgB - avgA;
  });

  const bgStyle = {
    backgroundImage:
      "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 50%)",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12" style={bgStyle}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase">Assessment Builder</span>
          </div>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Admin Dashboard</h1>
              <p className="text-slate-400 mt-1 text-sm">
                Managing <span className="text-white font-semibold">{totalUsers}</span> registered user{totalUsers !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition appearance-none cursor-pointer pr-8"
          >
            <option value="none">Sort by Avg Score</option>
            <option value="desc">Avg Score: High → Low</option>
            <option value="asc">Avg Score: Low → High</option>
          </select>

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition appearance-none cursor-pointer pr-8"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        {/* Table Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <p className="text-slate-400 text-sm">Loading users...</p>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-400 p-6 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-slate-500">#</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-slate-500">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-slate-500">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-slate-500">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-slate-500">Avg Score</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-slate-500">Joined</th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {sortedUsers.map((u, index) => {
                      const avgData = userAverages[u._id];
                      const hasResults = avgData !== null && avgData !== undefined;
                      const isDownloading = downloadingIds.has(u._id);

                      return (
                        <tr key={u._id} className="hover:bg-slate-800/40 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <span className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 text-slate-500 text-xs font-bold flex items-center justify-center">
                              {(page - 1) * limit + index + 1}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold flex-shrink-0">
                                {u.firstName?.[0]?.toUpperCase()}{u.lastName?.[0]?.toUpperCase()}
                              </div>
                              <span className="text-white text-sm font-medium">{u.firstName} {u.lastName}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-slate-400 text-sm">{u.email}</td>

                          <td className="px-6 py-4">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                              u.role === "admin"
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                : "bg-slate-800 text-slate-400 border border-slate-700"
                            }`}>
                              {u.role}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            {userAverages[u._id] === undefined ? (
                              <div className="w-4 h-4 rounded-full border border-slate-600 border-t-indigo-500 animate-spin" />
                            ) : !hasResults ? (
                              <span className="text-slate-600 text-xs">—</span>
                            ) : (
                              <div className="flex flex-col gap-1 min-w-[90px]">
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm font-bold ${
                                    avgData.avg >= 75 ? "text-emerald-400" : avgData.avg >= 50 ? "text-yellow-400" : "text-red-400"
                                  }`}>
                                    {avgData.avg.toFixed(1)}%
                                  </span>
                                  <span className="text-slate-500 text-xs ml-2">({avgData.count})</span>
                                </div>
                                <div className="w-full h-1 rounded-full bg-slate-700 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      avgData.avg >= 75 ? "bg-emerald-500" : avgData.avg >= 50 ? "bg-yellow-500" : "bg-red-500"
                                    }`}
                                    style={{ width: `${Math.min(avgData.avg, 100)}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-4 text-slate-400 text-sm">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {/* Results modal */}
                              <button
                                onClick={() => fetchUserResults(u._id)}
                                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Results
                              </button>

                              {/* Download PDF */}
                              <button
                                onClick={() => handleDownloadPDF(u)}
                                disabled={isDownloading}
                                title="Download results as PDF"
                                className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                                  isDownloading
                                    ? "bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed"
                                    : "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400"
                                }`}
                              >
                                {isDownloading ? (
                                  <>
                                    <div className="w-3 h-3 rounded-full border border-slate-500 border-t-emerald-400 animate-spin" />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    </svg>
                                    Action
                                  </>
                                )}
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(u._id)}
                                className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
                <p className="text-slate-500 text-xs">
                  Page <span className="text-slate-300 font-medium">{page}</span> of <span className="text-slate-300 font-medium">{totalPages}</span>
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-150 ${
                        page === i + 1
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                          : "bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Results Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl relative">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-sm font-bold">
                  {selectedUser.firstName?.[0]?.toUpperCase()}{selectedUser.lastName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-white font-semibold text-base">{selectedUser.firstName} {selectedUser.lastName}</h2>
                  <p className="text-slate-400 text-xs">Assessment Results</p>
                </div>
              </div>
              {userResults.length > 0 && (
                <div className="mr-4 text-right hidden sm:block">
                  <p className="text-slate-500 text-xs">Overall Average</p>
                  <p className={`text-lg font-bold ${
                    (userResults.reduce((s, r) => s + r.percentage, 0) / userResults.length) >= 75
                      ? "text-emerald-400"
                      : (userResults.reduce((s, r) => s + r.percentage, 0) / userResults.length) >= 50
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}>
                    {(userResults.reduce((s, r) => s + r.percentage, 0) / userResults.length).toFixed(2)}%
                  </p>
                </div>
              )}
              <button
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-150"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {resultsLoading ? (
                <div className="flex flex-col items-center gap-4 py-10">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                  <p className="text-slate-400 text-sm">Loading results...</p>
                </div>
              ) : userResults.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-500 text-sm">No assessments attempted yet.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {userResults.map((r) => {
                    const passed = r.percentage >= 50;
                    return (
                      <div key={r._id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">{r.assessment?.title}</h4>
                          <p className="text-slate-500 text-xs mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-slate-300 text-sm font-medium">{r.score} / {r.totalMarks}</p>
                          <p className={`text-sm font-bold ${passed ? "text-emerald-400" : "text-red-400"}`}>
                            {r.percentage.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;