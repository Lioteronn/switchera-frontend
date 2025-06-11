import AsyncStorage from '@react-native-async-storage/async-storage';

// Saved posts functions
export const saveBookmark = async (postId: string) => {
  try {
    const savedPosts = await getSavedPosts();
    if (!savedPosts.includes(postId)) {
      savedPosts.push(postId);
      await AsyncStorage.setItem('savedPosts', JSON.stringify(savedPosts));
    }
    return true;
  } catch (error) {
    console.error('Error saving bookmark:', error);
    return false;
  }
};

export const removeBookmark = async (postId: string) => {
  try {
    let savedPosts = await getSavedPosts();
    savedPosts = savedPosts.filter(id => id !== postId);
    await AsyncStorage.setItem('savedPosts', JSON.stringify(savedPosts));
    return true;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return false;
  }
};

export const getSavedPosts = async (): Promise<string[]> => {
  try {
    const savedPostsJson = await AsyncStorage.getItem('savedPosts');
    return savedPostsJson ? JSON.parse(savedPostsJson) : [];
  } catch (error) {
    console.error('Error getting saved posts:', error);
    return [];
  }
};

export const isBookmarked = async (postId: string): Promise<boolean> => {
  try {
    const savedPosts = await getSavedPosts();
    return savedPosts.includes(postId);
  } catch (error) {
    console.error('Error checking if post is bookmarked:', error);
    return false;
  }
};

// Comments functions
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage: string | null;
  text: string;
  timestamp: string;
}

export const getComments = async (postId: string): Promise<Comment[]> => {
  try {
    const commentsJson = await AsyncStorage.getItem(`comments_${postId}`);
    return commentsJson ? JSON.parse(commentsJson) : [];
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
};

export const addComment = async (
  postId: string, 
  userId: string, 
  userName: string, 
  userImage: string | null, 
  text: string
): Promise<Comment | null> => {
  try {
    const comments = await getComments(postId);
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      userId,
      userName,
      userImage,
      text,
      timestamp: new Date().toISOString(),
    };
    
    comments.push(newComment);
    await AsyncStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
    return newComment;
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
};

// Format timestamp for display
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) {
    return 'Just now';
  } else if (diffMin < 60) {
    return `${diffMin} min${diffMin !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};