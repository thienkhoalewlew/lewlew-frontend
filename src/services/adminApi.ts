import type { AdminUser } from "../types/admin";

export interface LoginCredentials {
  login: string; // username or phone number
  password: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class AdminApiService {
  private baseURL = import.meta.env.VITE_API_URL;

  // Authentication methods
  async login(
    credentials: LoginCredentials,
  ): Promise<ApiResponse<{ token: string; user: AdminUser }>> {
    try {
      const response = await fetch(`${this.baseURL}/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || "Admin login failed. Please check your credentials or admin permissions." };
      }

      return { data };
    } catch (_error) {
      // eslint-disable-line @typescript-eslint/no-unused-vars
      return { error: "Network error. Please check your connection." };
    }
  }

  // Get dashboard statistics
  async getDashboardStats(): Promise<ApiResponse<unknown>> {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${this.baseURL}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || "Failed to fetch dashboard stats" };
      }

      return { data };
    } catch (_error) {
      // eslint-disable-line @typescript-eslint/no-unused-vars
      return { error: "Network error. Please check your connection." };
    }
  }

  // Quick Actions API calls
  async getRecentUsers(limit: number = 10): Promise<ApiResponse<unknown>> {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${this.baseURL}/admin/users/recent?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || "Failed to fetch recent users" };
      }

      return { data };
    } catch (_error) {
      // eslint-disable-line @typescript-eslint/no-unused-vars
      return { error: "Network error. Please check your connection." };
    }
  }

  async getPendingReportsSummary(): Promise<ApiResponse<unknown>> {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${this.baseURL}/admin/reports/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || "Failed to fetch pending reports" };
      }

      return { data };
    } catch (_error) {
      // eslint-disable-line @typescript-eslint/no-unused-vars
      return { error: "Network error. Please check your connection." };
    }
  }

  async performSystemCheck(): Promise<ApiResponse<unknown>> {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${this.baseURL}/admin/actions/system-check`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || "Failed to perform system check" };
      }

      return { data };
    } catch (_error) {
      // eslint-disable-line @typescript-eslint/no-unused-vars
      return { error: "Network error. Please check your connection." };
    }
  }

  // Get reports statistics
  async getReportsStats(): Promise<ApiResponse<unknown>> {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${this.baseURL}/reports/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || "Failed to fetch reports stats" };
      }

      return { data };
    } catch (_error) {
      // eslint-disable-line @typescript-eslint/no-unused-vars
      return { error: "Network error. Please check your connection." };
    }
  }

  // Get all reports with filters
  async getReports(
    page: number = 1,
    limit: number = 10,
    status?: string,
    reason?: string,
  ): Promise<ApiResponse<unknown>> {
    try {
      const token = localStorage.getItem("adminToken");
      let url = `${this.baseURL}/reports?page=${page}&limit=${limit}`;

      if (status) url += `&status=${status}`;
      if (reason) url += `&reason=${reason}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || "Failed to fetch reports" };
      }

      return { data };
    } catch (_error) {
      // eslint-disable-line @typescript-eslint/no-unused-vars
      return { error: "Network error. Please check your connection." };
    }
  }

  // Update report status
  async updateReportStatus(
    reportId: string,
    status: string,
    reviewComment?: string,
  ): Promise<ApiResponse<unknown>> {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${this.baseURL}/reports/${reportId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, reviewComment }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || "Failed to update report status" };
      }

      return { data };
    } catch (_error) {
      // eslint-disable-line @typescript-eslint/no-unused-vars
      return { error: "Network error. Please check your connection." };
    }
  }

  // Delete post (Admin)
  async deletePost(postId: string): Promise<ApiResponse<unknown>> {
    try {
      const token = localStorage.getItem("adminToken");
      console.log("AdminApi deletePost - token exists:", !!token);
      console.log("AdminApi deletePost - postId:", postId);
      console.log("AdminApi deletePost - URL:", `${this.baseURL}/admin/posts/${postId}`);
      
      if (!token) {
        return { error: "Admin token not found. Please login again." };
      }

      const response = await fetch(`${this.baseURL}/admin/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("AdminApi deletePost - response status:", response.status);
      console.log("AdminApi deletePost - response ok:", response.ok);

      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        console.log("AdminApi deletePost - error data:", data);
        return { error: data.message || `Failed to delete post (${response.status})` };
      }

      const data = await response.json();
      console.log("AdminApi deletePost - success data:", data);
      return { data };
    } catch (error) {
      console.error("AdminApi deletePost - network error:", error);
      return { error: "Network error. Please check your connection." };
    }
  }
}

export default new AdminApiService();
