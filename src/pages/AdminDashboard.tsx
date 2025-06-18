import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import DashboardOverview from "../components/DashboardOverview";
import ReportsManagement from "../components/ReportsManagement";
import LocationAnalyticsDashboard from "../components/LocationAnalyticsDashboard";

const AdminDashboard: React.FC = () => {
  const location = useLocation();

  // Determine current page from URL
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.includes("/reports")) return "reports";
    if (path.includes("/location-analytics")) return "location-analytics";
    if (path.includes("/location-map")) return "location-map";
    return "dashboard";
  };

  const currentPage = getCurrentPage();

  const DashboardPage = () => {
    return <DashboardOverview />;
  };

  return (
    <AdminLayout currentPage={currentPage}>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reports" element={<ReportsManagement />} />
        <Route path="/location-analytics" element={<LocationAnalyticsDashboard />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
