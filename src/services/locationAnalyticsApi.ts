import type { LocationAnalytics, LocationStats } from "../types/location";
import type { ApiResponse } from "./adminApi";

class LocationAnalyticsService {
  private baseURL = import.meta.env.VITE_API_URL;

  private getAuthHeaders() {
    const token = localStorage.getItem("adminToken");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // Get comprehensive location analytics
  async getLocationAnalytics(): Promise<ApiResponse<LocationAnalytics>> {
    try {
      const response = await fetch(`${this.baseURL}/admin/analytics/locations`, {
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || "Failed to fetch location analytics" };
      }

      return { data };
    } catch (error) {
      return { error: "Network error. Please check your connection." };
    }
  }

  // Get top locations by activity
  async getTopLocations(limit: number = 10): Promise<ApiResponse<LocationStats[]>> {
    try {
      const response = await fetch(
        `${this.baseURL}/admin/analytics/locations/top?limit=${limit}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || "Failed to fetch top locations" };
      }

      return { data };
    } catch (error) {
      return { error: "Network error. Please check your connection." };
    }
  }

  // Get location activity over time
  async getLocationGrowth(
    period: "7d" | "30d" | "90d" = "30d"
  ): Promise<ApiResponse<Array<{ date: string; newLocations: number; totalPosts: number }>>> {
    try {
      const response = await fetch(
        `${this.baseURL}/admin/analytics/locations/growth?period=${period}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || "Failed to fetch location growth data" };
      }

      return { data };
    } catch (error) {
      return { error: "Network error. Please check your connection." };
    }
  }

  // Get geographic distribution
  async getGeographicDistribution(): Promise<ApiResponse<Array<{ region: string; count: number; percentage: number }>>> {
    try {
      const response = await fetch(
        `${this.baseURL}/admin/analytics/locations/distribution`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || "Failed to fetch geographic distribution" };
      }

      return { data };
    } catch (error) {
      return { error: "Network error. Please check your connection." };
    }
  }
}

const locationAnalyticsApi = new LocationAnalyticsService();
export default locationAnalyticsApi;
