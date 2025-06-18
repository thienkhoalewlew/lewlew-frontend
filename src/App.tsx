import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import { useAdminStore } from "./store/adminStore";
import "./App.css";

function App() {
  const { isAuthenticated } = useAdminStore();

  return (
    <Router>
      <div className="min-h-screen bg-secondary-50">
        <Routes>
          {/* Admin Routes */}
          <Route
            path="/admin/login"
            element={
              isAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminLogin />
              )
            }
          />
          <Route
            path="/admin/*"
            element={
              isAuthenticated ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />

          {/* Default route redirects to admin login */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
