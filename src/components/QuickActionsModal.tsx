import React, { useState } from "react";
import { X, Clock, User, AlertTriangle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: string;
  title: string;
  data?: any;
}

const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  isOpen,
  onClose,
  actionType,
  title,
  data,
}) => {
  const [isLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;
  const renderContent = () => {
    switch (actionType) {
      case "recent-users":
      case "list-users":
        return (
          <div className="space-y-4">
            <div className="text-sm text-secondary-600 mb-4">
              {data?.users?.length || 0} users found
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {data?.users?.map((user: any, index: number) => (
                <div key={user._id || index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-medium text-secondary-900">{user.fullName}</div>
                      <div className="text-xs text-secondary-500">{user.email}</div>
                      <div className="text-xs text-secondary-500">@{user.username}</div>
                    </div>
                  </div>
                  <div className="text-xs text-secondary-500">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "pending-reports":
        return (
          <div className="space-y-4">
            <div className="text-sm text-secondary-600 mb-4">
              {data?.totalPending || 0} pending reports
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {data?.reports?.map((report: any, index: number) => (
                <div key={report._id || index} className="flex items-center justify-between p-3 bg-warning-50 rounded-lg border border-warning-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-warning-600" />
                    </div>
                    <div>
                      <div className="font-medium text-secondary-900">
                        {report.reason?.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className="text-xs text-secondary-500">
                        By: {report.reporterId?.fullName || 'Unknown User'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-secondary-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                    <button 
                      onClick={() => {
                        navigate('/admin/reports');
                        onClose();
                      }}
                      className="text-xs text-primary-600 hover:text-primary-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {data?.summary && data.summary.length > 0 && (
              <div className="mt-4 pt-4 border-t border-secondary-200">
                <h4 className="text-sm font-medium text-secondary-900 mb-2">Report Types:</h4>
                <div className="space-y-1">
                  {data.summary.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="text-secondary-600">{item._id?.replace('_', ' ')}</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>            )}
          </div>        );

      case "system-health":
        return (
          <div className="space-y-4">
            <div className="text-sm text-secondary-600 mb-4">
              System Health Check Results
            </div>
            
            {data?.healthIndicators && (
              <div className="bg-secondary-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-secondary-900 mb-3">Health Indicators</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-secondary-500">User Growth Rate</div>
                    <div className="font-medium text-secondary-900">{data.healthIndicators.userGrowthRate}%</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-secondary-500">Report Rate</div>
                    <div className="font-medium text-secondary-900">{data.healthIndicators.reportRate}%</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-secondary-500">Pending Reports</div>
                    <div className="font-medium text-secondary-900">{data.healthIndicators.pendingReportRate}%</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-secondary-500">System Status</div>
                    <div className={`font-medium flex items-center ${
                      data.healthIndicators.systemStatus === 'healthy' 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                    }`}>
                      {data.healthIndicators.systemStatus === 'healthy' ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 mr-1" />
                      )}
                      {data.healthIndicators.systemStatus}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {data?.metrics && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-secondary-900 mb-3">System Metrics</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Total Users:</span>
                    <span className="font-medium">{data.metrics.totalUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Total Posts:</span>
                    <span className="font-medium">{data.metrics.totalPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">New Users Today:</span>
                    <span className="font-medium">{data.metrics.newUsersToday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">New Posts Today:</span>
                    <span className="font-medium">{data.metrics.newPostsToday}</span>
                  </div>
                </div>
              </div>
            )}

            {data?.recommendations && data.recommendations.length > 0 && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-medium text-secondary-900 mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {data.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="text-sm text-secondary-700 flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      default:
        return <div className="text-secondary-600">Loading...</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            renderContent()
          )}
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-secondary-200">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>          {actionType === "pending-reports" && (
            <button
              onClick={() => {
                navigate('/admin/reports');
                onClose();
              }}
              className="btn-primary"
            >
              Manage Reports
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickActionsModal;
