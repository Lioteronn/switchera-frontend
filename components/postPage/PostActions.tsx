import { Bookmark, BookmarkCheck, Heart, MessageSquare } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { isBookmarked, removeBookmark, saveBookmark } from './PostUtils';

interface PostActionsProps {
    postId?: string; 
    likes: number;
    comments: number; // Renamed from commentsCount to match existing prop
    onLike: () => void;
    onComment: () => void;
    onSave: () => void;
    saved: boolean; // Prop name from PostCard is isSaved, but this component uses 'saved' internally for its state, prop should be 'saved' or 'isSaved' consistently.
                    // Let's assume PostCard passes `isSaved` which maps to this `saved` prop.
    isLikedByCurrentUser?: boolean; // Added
    disabled?: boolean; // Added
}

const PostActions: React.FC<PostActionsProps> = ({ 
    postId = 'default', 
    likes, 
    comments, 
    onLike, 
    onComment, 
    onSave,
    saved, // Matches the prop name
    isLikedByCurrentUser = false, // Added with default
    disabled = false // Added with default
}) => {
    const [localLikes, setLocalLikes] = useState(likes);
    // const [localComments, setLocalComments] = useState(comments); // Already passed as comments prop
    const [isSavedState, setIsSavedState] = useState(saved); // Use a different name to avoid conflict with prop

    // Update local state if props change
    useEffect(() => {
        setLocalLikes(likes);
    }, [likes]);

    useEffect(() => {
        setIsSavedState(saved);
    }, [saved]);

    // On mount, check if this post is already bookmarked (if postId is provided)
    // This useEffect might be redundant if `saved` prop is always up-to-date from PostCard
    useEffect(() => {
        if (postId && postId !== 'default') { // ensure postId is valid
            (async () => {
                const bookmarked = await isBookmarked(postId);
                setIsSavedState(bookmarked);
            })();
        }
    }, [postId]);

    const handleLike = () => {
        if (disabled) return;
        // Optimistic update removed, parent PostCard handles state after repo call
        onLike();
    };

    const handleComment = () => {
        if (disabled) return;
        onComment();
    };

    const handleSave = () => {
        if (disabled) return;
        const newSavedState = !isSavedState;
        // setIsSavedState(newSavedState); // Parent PostCard will update via context, then prop
        
        if (postId && postId !== 'default') {
            if (newSavedState) {
                saveBookmark(postId);
            } else {
                removeBookmark(postId);
            }
        }
        onSave(); // Notify parent, which handles context update
    };

    return (
        <View style={styles.container}>
            <View style={styles.actionGroup}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleLike}
                    disabled={disabled}
                >
                    <Heart size={20} color={isLikedByCurrentUser ? "#FF0000" : "#6B7280"} fill={isLikedByCurrentUser ? "#FF0000" : "none"} />
                    <Text style={styles.actionText}>{localLikes}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={handleComment}
                    disabled={disabled}
                >
                    <MessageSquare size={20} color="#3B82F6" />
                    <Text style={styles.actionText}>{comments}</Text> {/* Use comments prop directly */} 
                </TouchableOpacity>
            </View>

            <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSave}
                disabled={disabled}
            >
                {isSavedState ? (
                    <BookmarkCheck size={20} color="#10B981" />
                ) : (
                    <Bookmark size={20} color="#6B7280" />
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    actionGroup: {
        flexDirection: 'row',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    actionText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#4B5563',
    },
    saveButton: {
        padding: 4,
    },
});

export default PostActions;