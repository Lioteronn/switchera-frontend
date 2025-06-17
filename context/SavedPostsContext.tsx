import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { Post } from '../api/postRepository'; // Assuming Post interface is exported from postRepository

interface SavedPostsContextType {
  savedPosts: Post[];
  addSavedPost: (post: Post) => void;
  removeSavedPost: (postId: string) => void;
  isPostSaved: (postId: string) => boolean;
  toggleSavePost: (post: Post) => void;
}

const SavedPostsContext = createContext<SavedPostsContextType | undefined>(undefined);

export const SavedPostsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);

  const addSavedPost = useCallback((post: Post) => {
    setSavedPosts((prevPosts) => {
      if (!prevPosts.find(p => p.id === post.id)) {
        return [...prevPosts, post];
      }
      return prevPosts;
    });
  }, []);

  const removeSavedPost = useCallback((postId: string) => {
    setSavedPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
  }, []);

  const isPostSaved = useCallback((postId: string) => {
    return savedPosts.some(post => post.id === postId);
  }, [savedPosts]);

  const toggleSavePost = useCallback((post: Post) => {
    if (isPostSaved(post.id!)) {
      removeSavedPost(post.id!);
    } else {
      addSavedPost(post);
    }
  }, [addSavedPost, removeSavedPost, isPostSaved]);

  const contextValue = useMemo(() => ({
    savedPosts,
    addSavedPost,
    removeSavedPost,
    isPostSaved,
    toggleSavePost,
  }), [savedPosts, addSavedPost, removeSavedPost, isPostSaved, toggleSavePost]);

  return (
    <SavedPostsContext.Provider value={contextValue}>
      {children}
    </SavedPostsContext.Provider>
  );
};

export const useSavedPosts = (): SavedPostsContextType => {
  const context = useContext(SavedPostsContext);
  if (context === undefined) {
    throw new Error('useSavedPosts must be used within a SavedPostsProvider');
  }
  return context;
};
