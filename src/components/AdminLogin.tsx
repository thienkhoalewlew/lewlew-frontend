import React, { useState } from "react";
import { useAdminStore } from "../store/adminStore";
import { Eye, EyeOff, LogIn, Shield, User, Lock } from "lucide-react";

const AdminLogin: React.FC = () => {
  const [loginField, setLoginField] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error, clearError } = useAdminStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!loginField || !password) {
      return;
    }

    await login(loginField, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Admin Portal
          </h1>
          <p className="text-secondary-600">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-medium border border-secondary-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-error-50 border border-error-200 rounded-lg p-4 animate-slide-down">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-error-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-error-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="loginField"
                  className="block text-sm font-semibold text-secondary-700 mb-2"
                >
                  Username or Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="loginField"
                    name="loginField"
                    type="text"
                    autoComplete="username"
                    required
                    value={loginField}
                    onChange={(e) => setLoginField(e.target.value)}
                    className="input-field pl-10 h-12"
                    placeholder="Enter your username or phone number"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-secondary-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 pr-10 h-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-secondary-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-secondary-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary h-12 text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign in to Dashboard
                </div>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-secondary-100">
            <p className="text-center text-sm text-secondary-500">
              LewLew Admin Portal • Secure Access
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-secondary-500">
            🔒 This is a secure admin area. All activities are logged and
            monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
