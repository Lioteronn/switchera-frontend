import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CommentSection from './CommentSection';
import PostActions from './PostActions';
import PostContent from './PostContent';
import PostHeader from './PostHeader';
import PostMedia from './PostMedia';
import { addComment, formatTimestamp, getComments, isBookmarked } from './PostUtils';

interface Comment {
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
    initialComments?: number;
}

const PostCard: React.FC<PostCardProps> = ({ 
    postId,
    userId, 
    userName, 
    userImage, 
    title, 
    categories, 
    description, 
    photos,
    initialLikes = 0,
    initialComments = 0
}) => {
    const [saved, setSaved] = useState(false);
    const [likes, setLikes] = useState(initialLikes);
    const [comments, setComments] = useState<Comment[]>([]);
    const [showComments, setShowComments] = useState(false);
    
    // Fetch saved state and comments on mount
    useEffect(() => {
        const fetchSavedState = async () => {
            const bookmarked = await isBookmarked(postId);
            setSaved(bookmarked);
        };
        
        const fetchComments = async () => {
            const postComments = await getComments(postId);
            setComments(postComments);
        };
        
        fetchSavedState();
        fetchComments();
    }, [postId]);
    
    const handleSave = () => {
        setSaved(!saved);
        // Save/unsave logic is handled by PostActions component
    };
    
    const handleAddComment = async (postId: string, text: string) => {
        // In a real app, get current user info from auth context
        const currentUserId = 'current-user';
        const currentUserName = 'Current User';
        const currentUserImage = null;
        
        const newComment = await addComment(
            postId, 
            currentUserId, 
            currentUserName, 
            currentUserImage, 
            text
        );
        
        if (newComment) {
            setComments([...comments, newComment]);
        }
    };
    
    const toggleComments = () => {
        setShowComments(!showComments);
    };

    return (
        <View style={styles.card}>
            <PostHeader userId={userId} userName={userName} userImage={userImage} />
            <PostContent title={title} categories={categories} description={description} />
            {photos?.length > 0 && <PostMedia photos={photos} />}
            <PostActions 
                postId={postId}
                likes={likes} 
                comments={comments.length} 
                onLike={() => setLikes(likes + 1)} 
                onComment={toggleComments} 
                onSave={handleSave} 
                saved={saved} 
            />
            
            {showComments && (
                <CommentSection
                    postId={postId}
                    comments={comments.map(comment => ({
                        ...comment,
                        timestamp: formatTimestamp(comment.timestamp)
                    }))}
                    onAddComment={handleAddComment}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    }
});

export default PostCard;