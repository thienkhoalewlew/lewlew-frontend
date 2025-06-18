// Admin types and interfaces
export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "moderator";
  token?: string;
}

export interface DashboardStats {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  totalPosts: number;
  newPostsToday: number;
  newPostsThisWeek: number;
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  autoResolvedReports: number;
  recentReports: number;
  autoResolutionRate: string;
  reportsByReason: Array<{ _id: string; count: number }>;
}

export interface ReportedPost {
  id: string;
  postId: {
    id: string;
    caption: string;
    imageUrl: string;
    createdAt: string;
    user?: string;
  };
  reporterId: {
    id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
  reason: string;
  description?: string;
  status: "pending" | "resolved" | "rejected";
  aiConfidenceScore?: number;
  aiPrediction?: string;
  autoResolved?: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComment?: string;
  createdAt: string;
}

export interface ReportsResponse {
  reports: ReportedPost[];
  pagination: {
    current: number;
    total: number;
    count: number;
    limit: number;
  };
}

export interface Post {
  id: string;
  user:
    | string
    | { id: string; fullName: string; email: string; avatar?: string };
  imageUrl: string;
  caption: string;
  location: {
    type: string;
    coordinates: number[];
    placeName: string;
  };
  likes: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
  isDeleted?: boolean;
}
