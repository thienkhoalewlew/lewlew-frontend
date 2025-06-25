export interface LocationStats {
  locationName: string;
  coordinates: [number, number];
  postCount: number;
  userCount: number;
  engagementRate: number;
  averageLikes: number;
  averageComments: number;
  lastActivity: string;
}

export interface LocationAnalytics {
  totalLocations: number;
  mostActiveLocation: LocationStats;
  topLocations: LocationStats[];
  locationGrowth: {
    date: string;
    newLocations: number;
    totalPosts: number;
  }[];
  geographicDistribution: {
    region: string;
    count: number;
    percentage: number;
    coordinates?: [number, number];
  }[];
}
