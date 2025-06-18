import React, { useState } from "react";
import {
  Save,
  Shield,
  Database,
  AlertTriangle,
  CheckCircle,
  Users,
  FileText,
} from "lucide-react";

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("content");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "content", label: "Content", icon: Database },
    { id: "moderation", label: "Moderation", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">
            System Settings
          </h1>
          <p className="text-secondary-600 mt-1">
            Manage system configurations and preferences
          </p>
        </div>

        <button onClick={handleSave} className="btn-primary">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4 animate-slide-down">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-success-400 mr-3" />
            <p className="text-sm text-success-800">
              Settings saved successfully!
            </p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Management Settings */}
        {activeTab === "content" && (
          <>
            <div className="card">
              <div className="card-header">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-secondary-900">
                    Content Management
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Max file upload size (MB)
                  </label>
                  <input
                    type="number"
                    defaultValue={10}
                    min={1}
                    max={50}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Post expiration time (hours)
                  </label>
                  <input
                    type="number"
                    defaultValue={24}
                    min={1}
                    max={168}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Max posts per user per day
                  </label>
                  <input
                    type="number"
                    defaultValue={10}
                    min={1}
                    max={100}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                    <span className="ml-2 text-sm text-secondary-700">
                      Auto-delete expired posts
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                    <span className="ml-2 text-sm text-secondary-700">
                      Require manual post approval
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-secondary-900">
                    Content Rules
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Minimum content length (characters)
                  </label>
                  <input
                    type="number"
                    defaultValue={10}
                    min={1}
                    max={100}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Maximum content length (characters)
                  </label>
                  <input
                    type="number"
                    defaultValue={500}
                    min={100}
                    max={2000}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                    <span className="ml-2 text-sm text-secondary-700">
                      Block inappropriate language
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                    <span className="ml-2 text-sm text-secondary-700">
                      Allow external links
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Moderation Settings */}
        {activeTab === "moderation" && (
          <>
            <div className="card">
              <div className="card-header">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-secondary-900">
                    Auto Moderation
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Reports needed to auto-hide post
                  </label>
                  <input
                    type="number"
                    defaultValue={5}
                    min={1}
                    max={20}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Max report processing time (hours)
                  </label>
                  <input
                    type="number"
                    defaultValue={24}
                    min={1}
                    max={168}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                    <span className="ml-2 text-sm text-secondary-700">
                      Auto-hide posts with multiple reports
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                    <span className="ml-2 text-sm text-secondary-700">
                      Send violation notifications
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-secondary-900">
                    User Management
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Violations for temporary ban
                  </label>
                  <input
                    type="number"
                    defaultValue={3}
                    min={1}
                    max={10}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Temporary ban duration (days)
                  </label>
                  <input
                    type="number"
                    defaultValue={7}
                    min={1}
                    max={30}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                    <span className="ml-2 text-sm text-secondary-700">
                      Auto-ban violating accounts
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                    <span className="ml-2 text-sm text-secondary-700">
                      Allow user appeals
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Warning Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">
              Important Notice
            </h4>
            <p className="text-sm text-blue-700">
              Some settings will take effect immediately, while others may require a system restart. 
              Please create a backup before making critical configuration changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
