import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native'; // Added Text for error display
import {
    checkIfUserLikedPost,
    getPostLikeCount, // Type for comments fetched from repo
    Post // Type for post object, used for saving
    ,






    PostComment,
    postRepository
} from '../../api/postRepository';
import { useAuth } from '../../context/AuthContext';
import { useSavedPosts } from '../../context/SavedPostsContext';
import { ThemedText } from '../ThemedText'; // For loading/error messages
import CommentSection from './CommentSection';
import PostActions from './PostActions';
import PostContent from './PostContent';
import PostHeader from './PostHeader';
import PostMedia from './PostMedia';

// Interface for CommentSection's expected comment structure
interface DisplayComment {
  id: string;
  userId: string;
  userName: string;
  userImage: string | null;
  text: string;
  timestamp: string;
}

interface PostCardProps {
    postId: string;
    userId: string; 
    userName: string;
    userImage: string | null;
    title: string;
    categories: string[];
    description: string;
    photos: string[];
    initialLikes?: number; 
}

const PostCard: React.FC<PostCardProps> = ({ 
    postId,
    userId: authorId, 
    userName, 
    userImage, 
    title, 
    categories, 
    description, 
    photos,
    initialLikes = 0,
}) => {
    const { user: loggedInUser, isAuthenticated } = useAuth();
    const { savedPosts, addSavedPost, removeSavedPost } = useSavedPosts();

    const [isSaved, setIsSaved] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikes);
    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false);
    const [comments, setComments] = useState<PostComment[]>([]);
    const [showComments, setShowComments] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // General loading for initial data
    const [isActionLoading, setIsActionLoading] = useState(false); // Specific loading for like/comment actions
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (savedPosts && postId) {
            setIsSaved(savedPosts.some(p => p.id === postId));
        }
    }, [savedPosts, postId]);
    
    useEffect(() => {
        const fetchData = async () => {
            if (!postId) {
                console.log('⚠️ PostCard - Fetch Data - No post ID provided');
                setIsLoading(false);
                return;
            }
            console.log('🔍 PostCard - Fetch Data - Starting', { 
                postId,
                isAuthenticated,
                userId: loggedInUser?.id 
            });
            setIsLoading(true);
            setError(null);
            try {
                console.log('🔍 PostCard - Fetch Data - Fetching like count');
                const likeCountPromise = getPostLikeCount(postId);
                
                console.log('🔍 PostCard - Fetch Data - Fetching comments');
                const commentsPromise = postRepository.getPostComments(postId);
                
                let likedPromise = Promise.resolve(false);
                if (isAuthenticated && loggedInUser?.id) {
                    console.log('🔍 PostCard - Fetch Data - Checking if user liked post');
                    likedPromise = checkIfUserLikedPost(postId, loggedInUser.id);
                }

                const [likeCountData, postCommentsData, liked] = await Promise.all([
                    likeCountPromise,
                    commentsPromise,
                    likedPromise
                ]);

                console.log('✅ PostCard - Fetch Data - Results:', {
                    likeCount: likeCountData,
                    commentsCount: postCommentsData.length,
                    isLiked: liked
                });

                setLikesCount(likeCountData);
                setComments(postCommentsData);
                setIsLikedByCurrentUser(liked);

            } catch (err: any) {
                console.error('❌ PostCard - Fetch Data - Error:', err);
                setError("Failed to load post details. Pull to refresh or try again later.");
            } finally {
                setIsLoading(false);
                console.log('✅ PostCard - Fetch Data - Operation completed');
            }
        };
        
        fetchData();
    }, [postId, loggedInUser?.id, isAuthenticated]);
    
    const handleSaveToggle = () => {
        if (!loggedInUser) {
            Alert.alert("Login Required", "You need to be logged in to save posts.");
            return;
        }
        const postSummaryForSave: Post = { 
            id: postId, 
            title, 
            author_id: Number(authorId), // Assuming authorId from props is string, convert if Post type expects number
            content: description, 
            image: photos?.[0] || null, 
            created_at: new Date().toISOString(),
            // Ensure all required fields of Post type are present, or make them optional in Post type
            likes_count: likesCount, // Add current likes
            comments_count: comments.length, // Add current comments count
            // author_username and author_profile_picture can be added if available and needed by SavedPostsContext
        };
        if (isSaved) {
            removeSavedPost(postId);
        } else {
            addSavedPost(postSummaryForSave);
        }
    };
    
    const handleLikeToggle = async () => {
        console.log('🔍 PostCard - Like Toggle - Starting', {
            postId,
            userId: loggedInUser?.id,
            isAuthenticated,
            isActionLoading,
            currentLikeStatus: isLikedByCurrentUser
        });

        if (!isAuthenticated || !loggedInUser?.id) {
            console.log('❌ PostCard - Like Toggle - User not logged in', { isAuthenticated, userId: loggedInUser?.id });
            Alert.alert("Login Required", "You need to be logged in to like posts.");
            return;
        }
        if (isActionLoading) {
            console.log('⚠️ PostCard - Like Toggle - Action already in progress');
            return;
        }

        setIsActionLoading(true);
        const originalLikedStatus = isLikedByCurrentUser;
        const originalLikesCount = likesCount;

        // Optimistic update
        setIsLikedByCurrentUser(!originalLikedStatus);
        setLikesCount(prev => !originalLikedStatus ? prev + 1 : Math.max(0, prev - 1));

        try {
            console.log('🔍 PostCard - Like Toggle - Calling repository');
            const result = await postRepository.likePost(postId);
            console.log('✅ PostCard - Like Toggle - Repository response:', result);

            if (!result.success) {
                throw new Error('Like operation failed');
            }
            // Update with actual server state
            setIsLikedByCurrentUser(result.isLiked);
            setLikesCount(result.likesCount);
            console.log('✅ PostCard - Like Toggle - State updated successfully');
        } catch (error) {
            console.error("❌ PostCard - Like Toggle - Error:", error);
            // Revert optimistic update
            setIsLikedByCurrentUser(originalLikedStatus);
            setLikesCount(originalLikesCount);
            Alert.alert("Error", "Failed to update like status. Please try again.");
        } finally {
            setIsActionLoading(false);
            console.log('✅ PostCard - Like Toggle - Operation completed');
        }
    };
    
    const handleAddComment = async (commentText: string) => {
        console.log('🔍 PostCard - Add Comment - Starting', {
            postId,
            userId: loggedInUser?.id,
            isAuthenticated,
            commentLength: commentText.length,
            isActionLoading,
            actualCommentText: commentText // Add this for debugging
        });

        // Check for valid user authentication
        if (!isAuthenticated || !loggedInUser?.id || loggedInUser.id <= 0) {
            console.log('❌ PostCard - Add Comment - Invalid authentication state:', { 
                isAuthenticated, 
                userId: loggedInUser?.id,
                user: loggedInUser 
            });
            Alert.alert("Login Required", "You need to be logged in to comment. Please log in and try again.");
            return;
        }

        if (!commentText.trim()) {
            console.log('❌ PostCard - Add Comment - Empty comment');
            Alert.alert("Empty Comment", "Comment cannot be empty.");
            return;
        }

        if (isActionLoading) {
            console.log('⚠️ PostCard - Add Comment - Action already in progress');
            return;
        }

        setIsActionLoading(true);
        try {
            // Create a temporary comment for optimistic update
            const tempComment: PostComment = {
                id: Date.now(), // Temporary ID
                post_id: postId,
                user_id: loggedInUser.id,
                comment_text: commentText,
                created_at: new Date().toISOString(),
                user: {
                    username: loggedInUser.username || 'You',
                    avatar_url: null
                }
            };

            // Optimistic update
            setComments(prevComments => [...prevComments, tempComment]);

            console.log('🔍 PostCard - Add Comment - Calling repository with user ID:', loggedInUser.id);
            const newComment = await postRepository.createComment(postId, commentText);
            console.log('✅ PostCard - Add Comment - Repository response:', newComment);

            if (!newComment) {
                throw new Error('Failed to create comment');
            }
            
            // Replace the temporary comment with the real one
            setComments(prevComments => {
                const updatedComments = prevComments.map(comment => 
                    comment.id === tempComment.id ? newComment : comment
                );
                console.log('✅ PostCard - Add Comment - Comments updated:', {
                    previousCount: prevComments.length,
                    newCount: updatedComments.length
                });
                return updatedComments;
            });
            
            // Show success message
            Alert.alert("Success", "Comment added successfully!");
        } catch (error) {
            console.error("❌ PostCard - Add Comment - Error:", error);
            // Remove the temporary comment on error
            setComments(prevComments => prevComments.filter(comment => comment.id !== Date.now()));
            Alert.alert("Error", "Failed to add comment. Please try again.");
        } finally {
            setIsActionLoading(false);
            console.log('✅ PostCard - Add Comment - Operation completed');
        }
    };
    
    const toggleCommentsVisibility = () => {
        setShowComments(!showComments);
    };

    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
        if (diffSeconds < 5) return 'just now';
        if (diffSeconds < 60) return `${diffSeconds}s ago`;
        const diffMinutes = Math.round(diffSeconds / 60);
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        const diffHours = Math.round(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.round(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    if (isLoading) { 
        return <View style={styles.card}><ThemedText>Loading post...</ThemedText></View>;
    }

    if (error) {
        return <View style={styles.card}><ThemedText style={{color: 'red'}}>{error}</ThemedText></View>;
    }

    // Transform PostComment to DisplayComment for CommentSection
    const displayComments: DisplayComment[] = comments.map(comment => ({
        id: String(comment.id), 
        userId: String(comment.user_id),
        userName: comment.user?.username || 'Anonymous', 
        userImage: comment.user?.avatar_url || null, 
        text: comment.comment_text || '', // Ensure we use comment_text and provide a default empty string
        timestamp: comment.created_at ? formatTimestamp(comment.created_at) : 'Date unknown'
    }));

    return (
        <View style={styles.card} >
            <PostHeader userId={authorId} userName={userName} userImage={userImage} />
            <PostContent title={title} categories={categories} description={description} />
            {photos?.length > 0 && (
            <View style={styles.photocontainer}>
                <PostMedia photos={photos} />
            </View>
            )}
            <PostActions 
                postId={postId}
                likes={likesCount} 
                comments={comments.length} 
                onLike={handleLikeToggle} 
                onComment={toggleCommentsVisibility} 
                onSave={handleSaveToggle} 
                saved={isSaved}
                isLikedByCurrentUser={isLikedByCurrentUser}
                disabled={isActionLoading} // Disable actions during like/comment operations
            />
            
            {showComments && (
            <CommentSection
                postId={postId}
                comments={displayComments}
                onAddComment={handleAddComment}
            />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 6,
        overflow: 'hidden',
        padding: 16,
        marginBottom: 16, 
    },
    photocontainer: {
        width: '100%',
        marginVertical: 8, 
    },
});

export default PostCard;