import { Send, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage: string | null;
  text: string;
  timestamp: string;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, text: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments, onAddComment }) => {
  const [commentText, setCommentText] = useState('');

  const handleSendComment = () => {
    if (commentText.trim()) {
      onAddComment(postId, commentText);
      setCommentText('');
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      {item.userImage ? (
        <Image
          source={{ uri: item.userImage }}
          style={styles.avatar}
        />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <User size={16} color="#6B7280" />
        </View>
      )}
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Comments</Text>
      
      {comments.length > 0 ? (
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          style={styles.commentsList}
        />
      ) : (
        <Text style={styles.noComments}>No comments yet. Be the first to comment!</Text>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            !commentText.trim() && styles.disabledButton
          ]}
          onPress={handleSendComment}
          disabled={!commentText.trim()}
        >
          <Send size={20} color={commentText.trim() ? "#FFFFFF" : "#A1A1AA"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  commentsList: {
    maxHeight: 300,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontWeight: '600',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  commentText: {
    fontSize: 14,
    color: '#1F2937',
  },
  noComments: {
    textAlign: 'center',
    color: '#6B7280',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
});

export default CommentSection;