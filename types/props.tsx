export type Chat = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  blocked: boolean;
  service: string;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'sending';
};

export type UpcomingClass = {
  id: string;
  title: string;
  instructor: string;
  avatar: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed';
};

export type ServiceItem = {
  id: string;
  userId: string;
  userImage: string;
  userName: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  ratingCount: number;
  duration: 30 | 45 | 60 | 90;
  modality: 'online' | 'in-person' | 'both';
  tags: string[];
  category?: string;
  imageUrl?: string;
  status: 'all' | 'booked' | 'saved';
  isBooked?: boolean;
  isSaved?: boolean;
  timeAvailability?: Record<string, string[]>; //Formato: {'2025-06-15': ['09:00', '11:00'], '2025-06-16': ['10:00', '12:00']}
};

export type Post = {
  id: string;
  userId: string;
  userName: string;
  userImage: string | null;
  title: string;
  categories: string[];
  description: string;
  photos: string[];
  likes: number;
  comments: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  bio: string;
  followers: number;
  following: number;
  posts: Post[];
  services: ServiceItem[];
};

export type Friends = {
  id: string;
  name: string;
  image: string | null;
  online: boolean;
  blocked: boolean;
}

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'diamond' | 'ruby' | 'legendary';

export type Badge = {
    id: string;
    name: string;
    description: string;
    image: string;
    tier: BadgeTier;
}