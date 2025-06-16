/**
 * Profile related TypeScript interfaces
 */

// User Profile Interface
export interface Profile {
  id: number;
  username: string;
  email?: string;
  bio?: string;
  image?: string;
  followers: number;
  following: number;
  posts?: Post[];
  services?: UserService[];
}

// Data that can be updated in a profile
export interface ProfileUpdateData {
  username?: string;
  email?: string;
  bio?: string;
  image?: FormData | string;
}

// User Service Interface
export interface UserService {
  id: string;
  user_id: string;
  user_name: string;
  user_image: string;
  title: string;
  description: string;
  price: string;
  rating?: number;
  rating_count: number;
  duration?: 30 | 45 | 60 | 90;
  modality?: 'online' | 'in-person' | 'both';
  tags: string[];
  category: string;
  image_url?: string;
  status?: string;
  is_booked?: string;
  is_saved?: string;
  time_availability?: string;
}

// Badge Interface
export interface Badge {
  medal_id: string;
  name: string;
  description: string;
  image?: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND' | 'RUBY' | 'LEGENDARY';
}

// Friend Interface
export interface Friend {
  id: string;
  name: string;
  image?: string;
  online: boolean;
  blocked: boolean;
}

// Post Interface
export interface Post {
  id: string;
  author: number;
  author_name: string;
  title: string;
  content: string;
  image?: string;
  like_count: string;
  created_at: string;
  updated_at: string;
}

// Service Registration Interface
export interface ServiceRegistration {
  id: number;
  user: number;
  username: string;
  service: number;
  service_title: string;
  registration_date: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// Follow/Unfollow response
export interface FollowResponse {
  success: boolean;
  isFollowing: boolean;
  message: string;
}

