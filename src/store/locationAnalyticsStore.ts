import { create } from "zustand";
import type { LocationAnalytics, LocationStats } from "../types/location";
import locationAnalyticsApi from "../services/locationAnalyticsApi";

interface LocationAnalyticsStore {
  // State
  analytics: LocationAnalytics | null;
  topLocations: LocationStats[];
  locationGrowth: Array<{ date: string; newLocations: number; totalPosts: number }>;
  geographicDistribution: Array<{ region: string; count: number; percentage: number }>;
  
  // Loading states
  isLoading: boolean;
  isLoadingCharts: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  fetchLocationAnalytics: () => Promise<void>;
  fetchTopLocations: (limit?: number) => Promise<void>;
  fetchLocationGrowth: (period?: "7d" | "30d" | "90d") => Promise<void>;
  fetchGeographicDistribution: () => Promise<void>;
  
  // Utility actions
  clearError: () => void;
  refreshAllData: () => Promise<void>;
}

export const useLocationAnalyticsStore = create<LocationAnalyticsStore>((set, get) => ({
  // Initial state
  analytics: null,
  topLocations: [],
  locationGrowth: [],
  geographicDistribution: [],
  
  isLoading: false,
  isLoadingCharts: false,
  
  error: null,

  // Actions
  fetchLocationAnalytics: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await locationAnalyticsApi.getLocationAnalytics();
      
      if (response.error) {
        set({ error: response.error, isLoading: false });
        return;
      }
      
      set({ 
        analytics: response.data as LocationAnalytics,
        isLoading: false,
        error: null 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch location analytics", 
        isLoading: false 
      });
    }
  },

  fetchTopLocations: async (limit = 10) => {
    try {
      const response = await locationAnalyticsApi.getTopLocations(limit);
      
      if (response.error) {
        set({ error: response.error });
        return;
      }
      
      set({ 
        topLocations: response.data as LocationStats[],
        error: null 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch top locations"
      });
    }
  },


  fetchLocationGrowth: async (period = "30d") => {
    set({ isLoadingCharts: true, error: null });
    
    try {
      const response = await locationAnalyticsApi.getLocationGrowth(period);
      
      if (response.error) {
        set({ error: response.error, isLoadingCharts: false });
        return;
      }
      
      set({ 
        locationGrowth: response.data as Array<{ date: string; newLocations: number; totalPosts: number }>,
        isLoadingCharts: false,
        error: null 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch location growth data", 
        isLoadingCharts: false 
      });
    }
  },

  fetchGeographicDistribution: async () => {
    try {
      const response = await locationAnalyticsApi.getGeographicDistribution();
      
      if (response.error) {
        set({ error: response.error });
        return;
      }
      
      set({ 
        geographicDistribution: response.data as Array<{ region: string; count: number; percentage: number }>,
        error: null 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch geographic distribution"
      });
    }
  },

  clearError: () => set({ error: null }),
  refreshAllData: async () => {
    const { 
      fetchLocationAnalytics, 
      fetchTopLocations, 
      fetchLocationGrowth,
      fetchGeographicDistribution 
    } = get();
    
    await Promise.all([
      fetchLocationAnalytics(),
      fetchTopLocations(),
      fetchLocationGrowth(),
      fetchGeographicDistribution()
    ]);
  }
}));
