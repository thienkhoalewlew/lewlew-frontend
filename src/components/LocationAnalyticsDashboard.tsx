import React, { useEffect, useState } from "react";
import {
  MapPin,
  TrendingUp,
  Users,
  BarChart3,
  Activity,
  RefreshCw,
  Eye,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useLocationAnalyticsStore } from "../store/locationAnalyticsStore";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  color = "blue",
  onClick,
}) => {
  const colorClasses = {
    blue: "from-primary-500 to-primary-600",
    green: "from-success-500 to-success-600",
    yellow: "from-warning-500 to-warning-600",
    red: "from-error-500 to-error-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div
      className={`stat-card ${onClick ? "cursor-pointer hover:scale-105" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-secondary-900 mb-2">{value}</p>
          {change && (
            <p className="text-sm text-success-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {change}
            </p>
          )}
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

const LocationAnalyticsDashboard: React.FC = () => {  const {
    analytics,
    topLocations,
    locationGrowth,
    isLoading,
    isLoadingCharts,
    error,
    fetchLocationGrowth,
    clearError,
    refreshAllData,
  } = useLocationAnalyticsStore();

  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    refreshAllData();
  }, []);

  useEffect(() => {
    fetchLocationGrowth(selectedPeriod);
  }, [selectedPeriod, fetchLocationGrowth]);

  const handleRefresh = () => {
    clearError();
    refreshAllData();
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-error-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            Failed to Load Location Analytics
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

  if (isLoading && !analytics) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-secondary-600">Loading location analytics...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
    {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <BarChart3 className="h-8 w-8 mr-3" />
              Location Analytics
            </h1>
            <p className="text-primary-100 text-lg">
              Geographic insights and location-based content analysis
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as "7d" | "30d" | "90d")}
              className="bg-white bg-opacity-20 text-white border border-white border-opacity-30 rounded-lg px-3 py-2 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button
              onClick={handleRefresh}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-shrink-0">
      <StatsCard
          title="Total Locations"
          value={formatNumber(analytics?.totalLocations || 0)}
          icon={<MapPin className="h-6 w-6" />}
          color="blue"
        />
        <StatsCard
          title="Most Active Location"
          value={analytics?.mostActiveLocation?.postCount || 0}
          change={analytics?.mostActiveLocation?.locationName || "N/A"}
          icon={<Activity className="h-6 w-6" />}
          color="green"
        />        <StatsCard
          title="Avg Engagement Rate"
          value={`${(analytics?.mostActiveLocation?.engagementRate ?? 0).toFixed(1)}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          color="yellow"
        />
        <StatsCard
          title="Active Users"
          value={formatNumber(
            analytics?.topLocations?.reduce((sum, loc) => sum + loc.userCount, 0) || 0
          )}
          icon={<Users className="h-6 w-6" />}
          color="purple"
        />
        </div>

      {/* Charts Section - 2 rows vertical layout */}
      <div className="flex-1 space-y-6 min-h-0 overflow-y-auto">
        {/* Location Growth Chart - Row 1 */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Location Activity Growth
            </h3>
            {isLoadingCharts && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            )}
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={locationGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  className="text-xs"
                />
                <YAxis className="text-xs" />
                <Tooltip
                  labelFormatter={(label) => formatDate(label)}
                  formatter={(value, name) => [
                    value,
                    name === "newLocations" ? "New Locations" : "Total Posts",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="newLocations"
                  stackId="1"
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="totalPosts"
                  stackId="1"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Top Active Locations - Row 2 */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Top Active Locations
            </h3>
            <button
              onClick={() => setShowDetails(showDetails ? null : "locations")}
              className="btn-secondary text-sm flex items-center space-x-1"
            >
              <Eye className="h-4 w-4" />
              <span>{showDetails ? "Hide" : "Show"} Details</span>
            </button>
          </div>
          
          {showDetails === "locations" ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {topLocations.map((location, index) => (
                <div
                  key={location.locationName}
                  className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary-900" title={location.locationName}>
                        {location.locationName}
                      </h4>
                      <p className="text-sm text-secondary-600">
                        {location.postCount} posts • {location.userCount} users
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-secondary-900">
                      {location.engagementRate.toFixed(1)}% engagement
                    </p>
                    <p className="text-xs text-secondary-500">
                      Last activity: {new Date(location.lastActivity).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topLocations.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="locationName"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      name === "postCount" ? "Posts" : "Users",
                    ]}
                    labelFormatter={(label) => {
                      const location = topLocations.find(loc => 
                        loc.locationName === label
                      );
                      return location?.locationName || label;
                    }}
                  />
                  <Bar dataKey="postCount" fill="#0ea5e9" name="postCount" />
                  <Bar dataKey="userCount" fill="#22c55e" name="userCount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationAnalyticsDashboard;
