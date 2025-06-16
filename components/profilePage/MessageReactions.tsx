// components/profilePage/MessageReactions.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, ThumbsUp, SmilePlus, MessageCircle } from 'lucide-react-native';
import { MotiView } from 'moti';

interface Reaction {
  type: 'like' | 'love' | 'smile';
  count: number;
  userIds: string[];
}

interface MessageReactionsProps {
  reactions: Reaction[];
  currentUserId: string;
  onAddReaction: (type: Reaction['type']) => void;
  onRemoveReaction: (type: Reaction['type']) => void;
  onReply: () => void;
  replyCount: number;
}

const REACTION_ICONS = {
  like: ThumbsUp,
  love: Heart,
  smile: SmilePlus,
};

export default function MessageReactions({
  reactions,
  currentUserId,
  onAddReaction,
  onRemoveReaction,
  onReply,
  replyCount,
}: MessageReactionsProps) {
  const handleReactionPress = (type: Reaction['type']) => {
    const reaction = reactions.find(r => r.type === type);
    if (reaction?.userIds.includes(currentUserId)) {
      onRemoveReaction(type);
    } else {
      onAddReaction(type);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.reactionsRow}>
        {reactions.map((reaction) => {
          const Icon = REACTION_ICONS[reaction.type];
          const isReacted = reaction.userIds.includes(currentUserId);
          
          return (
            <MotiView
              key={reaction.type}
              animate={{
                scale: isReacted ? [1, 1.2, 1] : 1,
              }}
              transition={{
                type: 'timing',
                duration: 300,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.reactionButton,
                  isReacted && styles.reactionActive,
                ]}
                onPress={() => handleReactionPress(reaction.type)}
              >
                <Icon
                  size={16}
                  color={isReacted ? '#3B82F6' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.reactionCount,
                    isReacted && styles.reactionCountActive,
                  ]}
                >
                  {reaction.count}
                </Text>
              </TouchableOpacity>
            </MotiView>
          );
        })}

        <TouchableOpacity
          style={styles.replyButton}
          onPress={onReply}
        >
          <MessageCircle size={16} color="#6B7280" />
          {replyCount > 0 && (
            <Text style={styles.replyCount}>{replyCount}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  reactionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  reactionActive: {
    backgroundColor: '#EBF5FF',
  },
  reactionCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  reactionCountActive: {
    color: '#3B82F6',
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  replyCount: {
    fontSize: 12,
    color: '#6B7280',
  },
});

