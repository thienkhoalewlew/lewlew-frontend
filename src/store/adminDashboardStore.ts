import { create } from "zustand";
import adminApi from "../services/adminApi";

interface DashboardStats {
  users: {
    total: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
    activeUsers: number;
  };
  posts: {
    total: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
    activePosts: number;
    expiredPosts: number;
    deletedPosts: number;
  };
  reports: {
    totalReports: number;
    pendingReports: number;
    resolvedReports: number;
    rejectedReports: number;
    autoResolvedReports: number;
    recentReports: number;
    autoResolutionRate: string;
  };
  engagement: {
    totalLikes: number;
    totalComments: number;
    likesToday: number;
    commentsToday: number;
    avgLikesPerPost: number;
    avgCommentsPerPost: number;
  };
  systemHealth: {
    uptime: string;
    responseTime: string;
    errorRate: string;
    lastUpdated: string;
  };
}

interface AdminDashboardStore {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchDashboardStats: () => Promise<void>;
  clearError: () => void;
  
  // Quick Actions
  getRecentUsers: (limit?: number) => Promise<any>;
  getPendingReportsSummary: () => Promise<any>;
  performSystemCheck: () => Promise<any>;
}

const useAdminDashboardStore = create<AdminDashboardStore>((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await adminApi.getDashboardStats();
      
      if (response.error) {
        set({ error: response.error, isLoading: false });
        return;
      }
      
      set({ 
        stats: response.data as DashboardStats, 
        isLoading: false,
        error: null 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch dashboard stats", 
        isLoading: false 
      });
    }  },

  clearError: () => set({ error: null }),

  // Quick Actions
  getRecentUsers: async (limit = 10) => {
    try {
      const response = await adminApi.getRecentUsers(limit);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPendingReportsSummary: async () => {
    try {
      const response = await adminApi.getPendingReportsSummary();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  performSystemCheck: async () => {
    try {
      const response = await adminApi.performSystemCheck();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}));

export default useAdminDashboardStore;
