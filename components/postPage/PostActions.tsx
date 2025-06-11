import { Bookmark, BookmarkCheck, Heart, MessageSquare } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { isBookmarked, removeBookmark, saveBookmark } from './PostUtils';

interface PostActionsProps {
    postId?: string; // Add postId for bookmark functionality
    likes: number;
    comments: number;
    onLike: () => void;
    onComment: () => void;
    onSave: () => void;
    saved: boolean;
}

const PostActions: React.FC<PostActionsProps> = ({ 
    postId = 'default', 
    likes, 
    comments, 
    onLike, 
    onComment, 
    onSave,
    saved 
}) => {
    const [localLikes, setLocalLikes] = useState(likes);
    const [localComments, setLocalComments] = useState(comments);
    const [isSaved, setIsSaved] = useState(saved);

    // On mount, check if this post is already bookmarked
    useEffect(() => {
        if (postId) {
            (async () => {
                const bookmarked = await isBookmarked(postId);
                setIsSaved(bookmarked);
            })();
        }
    }, [postId]);

    const handleLike = () => {
        setLocalLikes(localLikes + 1);
        onLike();
    };

    const handleComment = () => {
        onComment();
    };

    const handleSave = () => {
        const newSavedState = !isSaved;
        setIsSaved(newSavedState);
        
        if (postId) {
            if (newSavedState) {
                saveBookmark(postId);
            } else {
                removeBookmark(postId);
            }
        }
        
        onSave();
    };

    return (
        <View style={styles.container}>
            <View style={styles.actionGroup}>
                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={handleLike}
                >
                    <Heart size={20} color="#EF4444" />
                    <Text style={styles.actionText}>{localLikes}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={handleComment}
                >
                    <MessageSquare size={20} color="#3B82F6" />
                    <Text style={styles.actionText}>{localComments}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSave}
            >
                {isSaved ? (
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