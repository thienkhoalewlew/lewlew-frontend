import React, { useEffect, useState } from "react";
import {
  Users,
  FileText,
  AlertTriangle,
  Eye,
  MessageSquare,
  Heart,
  Calendar,
  RefreshCw,
  BarChart3,
  Activity,
} from "lucide-react";
import useAdminDashboardStore from "../store/adminDashboardStore";
import QuickActionsModal from "./QuickActionsModal";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  className?: string;
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "indigo";
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  className = "",
  color = "blue",
}) => {
  const colorClasses = {
    blue: "from-primary-500 to-primary-600",
    green: "from-success-500 to-success-600",
    yellow: "from-warning-500 to-warning-600",
    red: "from-error-500 to-error-600",
    purple: "from-purple-500 to-purple-600",
    indigo: "from-indigo-500 to-indigo-600",
  };

  return (
    <div className={`stat-card hover:scale-105 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-secondary-900 mb-2">{value}</p>
        </div>
        <div
          className={`p-4 rounded-xl bg-gradient-to-r ${colorClasses[color]} shadow-lg`}
        >
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </div>
  );
};

interface DashboardOverviewProps {}

const DashboardOverview: React.FC<DashboardOverviewProps> = () => {
  const { 
    stats, 
    isLoading, 
    error, 
    fetchDashboardStats, 
    clearError,
    getRecentUsers,
    getPendingReportsSummary,
    performSystemCheck
  } = useAdminDashboardStore();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [modalType, setModalType] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const handleRefresh = () => {
    clearError();
    fetchDashboardStats();
  };

  const handleQuickAction = async (action: string) => {
    setActionLoading(true);
    try {
      switch (action) {
        case 'pending-reports':
          const reportsData = await getPendingReportsSummary();
          setModalData(reportsData);
          setModalType('pending-reports');
          setModalTitle('Pending Reports Summary');
          setModalOpen(true);
          break;
          
        case 'list-users':
          const usersData = await getRecentUsers(20); // Lấy nhiều user hơn để hiện thị danh sách
          setModalData(usersData);
          setModalType('list-users');
          setModalTitle('User List');
          setModalOpen(true);
          break;

        case 'system-health':
          const healthData = await performSystemCheck();
          setModalData(healthData);
          setModalType('system-health');
          setModalTitle('System Health Check');
          setModalOpen(true);
          break;
          
        default:
          console.log('Unknown action:', action);
      }
    } catch (error) {
      console.error('Quick action error:', error);
      alert(error instanceof Error ? error.message : 'Failed to perform action');
    } finally {
      setActionLoading(false);
    }
  };

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-error-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            Failed to Load Dashboard
          </h3>
          <p className="text-secondary-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && !stats) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-secondary-600">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-primary-100 text-lg">
              Here's what's happening with LewLew today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white bg-opacity-20 rounded-full p-6">
              <BarChart3 className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-6 text-primary-100">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-shrink-0">
        <StatsCard
          title="Total Users"
          value={stats?.users.total.toLocaleString() || "0"}
          icon={<Users className="h-6 w-6" />}
          color="blue"
        />
        <StatsCard
          title="Total Posts"
          value={stats?.posts.total.toLocaleString() || "0"}
          icon={<FileText className="h-6 w-6" />}
          color="green"
        />
        <StatsCard
          title="Pending Reports"
          value={stats?.reports.pendingReports.toLocaleString() || "0"}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="yellow"
        />
        <StatsCard
          title="System Health"
          value={stats?.systemHealth.uptime || "99.9%"}
          icon={<Activity className="h-6 w-6" />}
          color="indigo"
        />
      </div>

      {/* Secondary Stats */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0 overflow-y-auto">
        <div className="card h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">
              Engagement
            </h3>
            <Eye className="h-5 w-5 text-secondary-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-error-500" />
                <span className="text-sm text-secondary-600">Total Likes</span>
              </div>
              <span className="font-semibold text-secondary-900">
                {stats?.engagement.totalLikes.toLocaleString() || "0"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-primary-500" />
                <span className="text-sm text-secondary-600">Total Comments</span>
              </div>
              <span className="font-semibold text-secondary-900">
                {stats?.engagement.totalComments.toLocaleString() || "0"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-success-500" />
                <span className="text-sm text-secondary-600">Avg Likes/Post</span>
              </div>
              <span className="font-semibold text-secondary-900">
                {stats?.engagement.avgLikesPerPost || "0"}
              </span>
            </div>
          </div>
        </div>

        <div className="card h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">
              Content Stats
            </h3>
            <BarChart3 className="h-5 w-5 text-success-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">Active Posts</span>
              <span className="text-sm font-semibold text-success-600">
                {stats?.posts.activePosts.toLocaleString() || "0"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">Expired Posts</span>
              <span className="text-sm font-semibold text-warning-600">
                {stats?.posts.expiredPosts.toLocaleString() || "0"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">New Users Today</span>
              <span className="text-sm font-semibold text-primary-600">
                {stats?.users.newToday.toLocaleString() || "0"}
              </span>
            </div>
          </div>
        </div>

        <div className="card h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">
              Quick Actions
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                className="p-1 hover:bg-secondary-100 rounded"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 text-secondary-400 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {/* Primary Actions */}
            <button 
              onClick={() => window.location.href = '/admin/reports'}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>View All Reports ({stats?.reports.pendingReports || 0})</span>
            </button>
            
            {/* Secondary Actions */}
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => handleQuickAction('pending-reports')}
                className="btn-warning text-sm px-3 py-2 flex items-center justify-center space-x-1"
                disabled={actionLoading}
              >
                <Eye className="h-3 w-3" />
                <span>Pending</span>
              </button>
              <button 
                onClick={() => handleQuickAction('list-users')}
                className="btn-success text-sm px-3 py-2 flex items-center justify-center space-x-1"
                disabled={actionLoading}
              >
                <Users className="h-3 w-3" />
                <span>List Users</span>
              </button>
              <button 
                onClick={() => handleQuickAction('system-health')}
                className="btn-info text-sm px-3 py-2 flex items-center justify-center space-x-1"
                disabled={actionLoading}
              >
                <Activity className="h-3 w-3" />
                <span>Health</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Modal */}
      <QuickActionsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        actionType={modalType}
        title={modalTitle}
        data={modalData}
      />
    </div>
  );
};

export default DashboardOverview;
