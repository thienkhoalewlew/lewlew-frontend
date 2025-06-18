import React, { useState, useEffect } from "react";
import { Trash2, CheckCircle, XCircle, Bot, Filter } from "lucide-react";
import type { ReportedPost } from "../types/admin";
import adminApi from "../services/adminApi";

const ReportsManagement: React.FC = () => {
  const [reports, setReports] = useState<ReportedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    reason: "",
    aiProcessed: "", // 'ai_resolved', 'not_ai_resolved', 'all'
  });

  const limit = 10;
  useEffect(() => {
    console.log("ReportsManagement component mounted");
    console.log("Admin token:", localStorage.getItem("adminToken") ? "EXISTS" : "MISSING");
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  const fetchReports = async () => {
    console.log("fetchReports called with:", { currentPage, limit, filters });
    setLoading(true);
    setError(null);

    try {
      console.log("Making API call to getReports...");
      const response = await adminApi.getReports(
        currentPage,
        limit,
        filters.status,
        filters.reason,
      );
      
      console.log("API Response:", response);
      
      if (response.error) {
        console.error("API Error:", response.error);
        setError(response.error);
      } else if (
        response.data &&
        typeof response.data === "object" &&
        "reports" in response.data
      ) {
        const responseData = response.data as {
          reports: ReportedPost[];
          pagination: { count: number };
        };
        console.log("Raw reports data:", responseData);
        
        const filteredReports = filterByAiStatus(responseData.reports);
        console.log("Filtered reports:", filteredReports);
        
        setReports(filteredReports);
        setTotalPages(Math.ceil(responseData.pagination.count / limit));
      } else {
        console.error("Unexpected response format:", response);
        setError("Unexpected response format from server");
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setError("Failed to fetch reports: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const filterByAiStatus = (reports: ReportedPost[]): ReportedPost[] => {
    if (filters.aiProcessed === "ai_resolved") {
      return reports.filter((report) => report.autoResolved === true);
    } else if (filters.aiProcessed === "not_ai_resolved") {
      return reports.filter((report) => report.autoResolved !== true);
    }
    return reports;
  };

  const handleStatusUpdate = async (
    reportId: string,
    status: string,
    comment?: string,
  ) => {
    try {
      const response = await adminApi.updateReportStatus(
        reportId,
        status,
        comment,
      );
      if (response.error) {
        setError(response.error);
      } else {
        await fetchReports(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to update report status:", error);
      setError("Failed to update report status");
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!postId) {
      setError("Post ID is missing or invalid");
      return;
    }

    const confirmMessage = 
      "⚠️ PERMANENT DELETION WARNING ⚠️\n\n" +
      "This action will PERMANENTLY DELETE the post and ALL related data:\n" +
      "• The post itself\n" +
      "• All comments on this post\n" +
      "• All reports related to this post\n" +
      "• All upload records for this post\n\n" +
      "This action CANNOT be undone!\n\n" +
      "Are you absolutely sure you want to proceed?";

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      console.log("Attempting to permanently delete post with ID:", postId);
      console.log("Current admin token:", localStorage.getItem("adminToken") ? "Token exists" : "No token");
      
      // Show loading state
      setLoading(true);
      setError(null);
      
      const response = await adminApi.deletePost(postId);
      console.log("Delete post response:", response);
      
      if (response.error) {
        console.error("Delete post error:", response.error);
        setError(`Failed to permanently delete post: ${response.error}`);
      } else {
        console.log("Post permanently deleted successfully, refreshing reports...");
        
        // Show success message
        alert("✅ Post and all related data have been permanently deleted successfully!");
        
        // Refresh the list to remove the deleted post's reports
        await fetchReports();
        setError(null); // Clear any previous errors
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      setError(`Failed to permanently delete post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-orange-600 bg-orange-100";
      case "resolved":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log("ReportsManagement render - loading:", loading, "error:", error, "reports:", reports.length);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">

      <div className="flex justify-between items-center flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-900">Reports Management</h2>
        <div className="text-sm text-gray-600">
          Total Reports: {reports.length}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex space-x-4 flex-1">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={filters.reason}
              onChange={(e) =>
                setFilters({ ...filters, reason: e.target.value })
              }
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="">All Reasons</option>
              <option value="spam">Spam</option>
              <option value="harassment">Harassment</option>
              <option value="inappropriate_content">
                Inappropriate Content
              </option>
              <option value="violence">Violence</option>
              <option value="other">Other</option>
            </select>

            <select
              value={filters.aiProcessed}
              onChange={(e) =>
                setFilters({ ...filters, aiProcessed: e.target.value })
              }
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="">All Reports</option>
              <option value="ai_resolved">AI Auto-Resolved</option>
              <option value="not_ai_resolved">Pending Manual Review</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex-shrink-0">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Reports List */}
      <div className="flex-1 bg-white shadow-sm rounded-lg border overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {reports.map((report) => {
              // Debug log for each report
              console.log("Rendering report:", report);
              
              // Safety checks
              if (!report || !report.id) {
                console.warn("Invalid report object:", report);
                return null;
              }

              return (
            <div key={report.id} className="p-6">
              <div className="flex items-start space-x-4">
                {/* Post Image */}
                <div className="flex-shrink-0">
                  {report.postId?.imageUrl ? (
                    <img
                      src={report.postId.imageUrl}
                      alt="Reported post"
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>

                {/* Report Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}
                      >
                        {report.status}
                      </span>
                      {report.autoResolved && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-purple-600 bg-purple-100">
                          <Bot className="h-3 w-3 mr-1" />
                          AI Resolved
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(report.createdAt)}
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900">
                      Reason:{" "}
                      <span className="capitalize">
                        {report.reason.replace("_", " ")}
                      </span>
                    </p>
                    {report.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {report.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    <p>
                      <strong>Post Caption:</strong>{" "}
                      {report.postId?.caption || "No caption"}
                    </p>
                    <p>
                      <strong>Reported by:</strong> {report.reporterId?.fullName || "Unknown"}{" "}
                      ({report.reporterId?.email || "Unknown email"})
                    </p>
                  </div>

                  {report.aiConfidenceScore && (
                    <div className="mt-2">
                      <p className="text-sm text-purple-600">
                        <Bot className="h-4 w-4 inline mr-1" />
                        AI Confidence:{" "}
                        {(report.aiConfidenceScore * 100).toFixed(1)}%
                        {report.aiPrediction && ` - ${report.aiPrediction}`}
                      </p>
                    </div>
                  )}

                  {report.reviewComment && (
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700">
                        <strong>Review Comment:</strong> {report.reviewComment}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  <div className="flex space-x-2">
                    {report.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              report.id,
                              "resolved",
                              "Report approved and handled",
                            )
                          }
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              report.id,
                              "rejected",
                              "Report rejected after review",
                            )
                          }
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        console.log("Delete button clicked for report:", report);
                        console.log("PostId object:", report.postId);
                        console.log("PostId.id:", report.postId?.id);
                        if (report.postId?.id) {
                          handleDeletePost(report.postId.id);
                        } else {
                          setError("Post ID is missing for this report");
                        }
                      }}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-800"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
            );
          })}

          {reports.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No reports found matching your filters.
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;
