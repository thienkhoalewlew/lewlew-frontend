import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  LogOut,
  Menu,
  X,
  Home,
  Flag,
  Bell,
  Activity,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { useAdminStore } from "../store/adminStore";
import useAdminDashboardStore from "../store/adminDashboardStore";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'active' | 'warning' | 'error'>('active');
  const { logout, user } = useAdminStore();
  const { stats } = useAdminDashboardStore();
  const navigate = useNavigate();

  // Update system status based on pending reports
  useEffect(() => {
    if (stats?.reports.pendingReports) {
      if (stats.reports.pendingReports > 20) {
        setSystemStatus('warning');
      } else if (stats.reports.pendingReports > 50) {
        setSystemStatus('error');
      } else {
        setSystemStatus('active');
      }
    }
  }, [stats]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/admin/dashboard",
      description: "Overview & Analytics",
    },
    {
      id: "reports",
      label: "Reports",
      icon: Flag,
      path: "/admin/reports",
      description: "User Reports & Moderation",
    },
    {
      id: "location-analytics",
      label: "Location Analytics",
      icon: MapPin,
      path: "/admin/location-analytics",
      description: "Geographic Insights & Statistics",
    },
  ];

  return (
    <div className="h-screen flex bg-secondary-50 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-secondary-900 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-strong transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-secondary-200 bg-gradient-to-r from-primary-600 to-primary-700">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-lg font-bold text-white">LewLew Admin</h1>
              <p className="text-xs text-primary-100">Management Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-primary-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Admin Info */}
        <div className="p-6 bg-gradient-to-b from-primary-50 to-white border-b border-secondary-100">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-secondary-900 truncate">
                {user?.email || "Admin"}
              </p>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-success-400 rounded-full"></div>
                <p className="text-xs text-secondary-500">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`sidebar-link group ${isActive ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon
                  className={`h-5 w-5 mr-3 transition-colors ${
                    isActive
                      ? "text-primary-600"
                      : "text-secondary-400 group-hover:text-primary-500"
                  }`}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-secondary-500 group-hover:text-secondary-600">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-soft border-b border-secondary-100 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="ml-4 lg:ml-0">
                <h2 className="text-xl font-semibold text-secondary-900 capitalize">
                  {currentPage}
                </h2>
                <p className="text-sm text-secondary-500">
                  {
                    menuItems.find((item) => item.id === currentPage)
                      ?.description
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Activity Indicator - Now with real system status */}
              <div className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all hover:scale-105 ${
                systemStatus === 'active' 
                  ? 'bg-success-50 text-success-700 hover:bg-success-100' 
                  : systemStatus === 'warning'
                  ? 'bg-warning-50 text-warning-700 hover:bg-warning-100'
                  : 'bg-error-50 text-error-700 hover:bg-error-100'
              }`}
              onClick={() => navigate('/admin/dashboard')}
              title="Click to view system health details"
              >
                <Activity className="h-4 w-4" />
                <span>
                  System {systemStatus === 'active' ? 'Active' : systemStatus === 'warning' ? 'Warning' : 'Error'}
                </span>
                {stats?.reports.pendingReports && stats.reports.pendingReports > 0 && (
                  <span className="text-xs opacity-75">
                    ({stats.reports.pendingReports} pending)
                  </span>
                )}
              </div>

              {/* Notifications with real functionality */}
              <div className="relative dropdown-container">
                <button 
                  className="relative p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
                  onClick={() => setShowNotifications(!showNotifications)}
                  title="View notifications"
                >
                  <Bell className="h-5 w-5" />
                  {stats?.reports.pendingReports && stats.reports.pendingReports > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
                      {stats.reports.pendingReports > 9 ? '9+' : stats.reports.pendingReports}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-strong border border-secondary-200 z-50">
                    <div className="p-4 border-b border-secondary-100">
                      <h3 className="text-sm font-medium text-secondary-900">Recent Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {stats?.reports.pendingReports && stats.reports.pendingReports > 0 ? (
                        <div className="p-3 hover:bg-secondary-50 cursor-pointer border-b border-secondary-100"
                             onClick={() => {
                               navigate('/admin/reports');
                               setShowNotifications(false);
                             }}>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                              <Flag className="h-4 w-4 text-warning-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-secondary-900">
                                {stats.reports.pendingReports} Pending Reports
                              </p>
                              <p className="text-xs text-secondary-500">
                                Requires immediate attention
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-secondary-500 text-sm">
                          No new notifications
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t border-secondary-100">
                      <button 
                        className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                        onClick={() => {
                          navigate('/admin/reports');
                          setShowNotifications(false);
                        }}
                      >
                        View All Reports
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu with dropdown */}
              <div className="relative dropdown-container">
                <button 
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-100 transition-colors"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.email?.charAt(0).toUpperCase() || "A"}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-secondary-700">
                    {user?.email || "Admin"}
                  </span>
                  <ChevronDown className="hidden sm:block h-4 w-4 text-secondary-400" />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-strong border border-secondary-200 z-50">
                    <div className="p-3 border-b border-secondary-100">
                      <p className="text-sm font-medium text-secondary-900 truncate">
                        {user?.email || "Admin"}
                      </p>
                      <p className="text-xs text-secondary-500">Administrator</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="animate-fade-in h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
