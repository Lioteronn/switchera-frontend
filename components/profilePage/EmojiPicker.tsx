// components/profilePage/EmojiPicker.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { MotiView } from 'moti';
import { X, Search } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Add emoji keywords for search
const EMOJI_KEYWORDS = {
  '😀': ['happy', 'smile', 'grin', 'face'],
  '😃': ['happy', 'joy', 'smile', 'face'],
  '😄': ['laugh', 'happy', 'smile', 'face'],
  '😁': ['grin', 'happy', 'smile', 'face'],
  '😅': ['sweat', 'happy', 'relief', 'face'],
  '😂': ['laugh', 'joy', 'tears', 'face'],
  '🤣': ['laugh', 'rofl', 'tears', 'face'],
  '😊': ['blush', 'happy', 'smile', 'face'],
  '😇': ['angel', 'innocent', 'halo', 'face'],
  '🙂': ['smile', 'slight', 'face'],
  '🙃': ['upside', 'down', 'face'],
  '😉': ['wink', 'flirt', 'face'],
  '🐶': ['dog', 'puppy', 'animal'],
  '🐱': ['cat', 'kitten', 'animal'],
  '🐭': ['mouse', 'animal'],
  '🐹': ['hamster', 'animal'],
  '🐰': ['rabbit', 'bunny', 'animal'],
  '🦊': ['fox', 'animal'],
  '🍎': ['apple', 'red', 'fruit', 'food'],
  '🍐': ['pear', 'fruit', 'food'],
  '🍊': ['orange', 'fruit', 'food'],
  '🍋': ['lemon', 'fruit', 'food'],
  '⚽️': ['soccer', 'football', 'sport'],
  '🏀': ['basketball', 'sport'],
  '⌚️': ['watch', 'time', 'object'],
  '📱': ['phone', 'mobile', 'object'],
  // Add more keywords for other emojis as needed
};

interface EmojiPickerProps {
  visible: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
}

const MAX_RECENT_EMOJIS = 20;

const EMOJI_CATEGORIES = {
  'Smileys & People': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉'],
  'Animals & Nature': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
  'Food & Drink': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭'],
  'Activities': ['⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓'],
  'Objects': ['⌚️', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽'],
};

export default function EmojiPicker({
  visible,
  onClose,
  onEmojiSelect,
}: EmojiPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  
  useEffect(() => {
    if (visible) {
      loadRecentEmojis();
    }
  }, [visible]);

  const loadRecentEmojis = async () => {
    try {
      const stored = await AsyncStorage.getItem('recentEmojis');
      if (stored) {
        setRecentEmojis(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent emojis:', error);
    }
  };

  const saveRecentEmoji = async (emoji: string) => {
    try {
      const updated = [emoji, ...recentEmojis.filter(e => e !== emoji)]
        .slice(0, MAX_RECENT_EMOJIS);
      setRecentEmojis(updated);
      await AsyncStorage.setItem('recentEmojis', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent emoji:', error);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    saveRecentEmoji(emoji);
    onEmojiSelect(emoji);
    onClose();
  };

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery) return EMOJI_CATEGORIES;

    const searchLower = searchQuery.toLowerCase();
    const filtered: typeof EMOJI_CATEGORIES = {};

    Object.entries(EMOJI_CATEGORIES).forEach(([category, emojis]) => {
      const matchedEmojis = emojis.filter(emoji => 
        // Match by the emoji itself
        emoji.includes(searchLower) || 
        // Or by its keywords
        EMOJI_KEYWORDS[emoji]?.some(keyword => 
          keyword.includes(searchLower)
        )
      );

      if (matchedEmojis.length > 0) {
        filtered[category] = matchedEmojis;
      }
    });

    return filtered;
  }, [searchQuery]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <MotiView
          from={{ translateY: 300 }}
          animate={{ translateY: 0 }}
          style={styles.container}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Choose Emoji</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search emojis..."
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
            />
          </View>

          <ScrollView style={styles.content}>
            {recentEmojis.length > 0 && !searchQuery && (
              <View style={styles.category}>
                <Text style={styles.categoryTitle}>Recently Used</Text>
                <View style={styles.emojiGrid}>
                  {recentEmojis.map((emoji) => (
                    <TouchableOpacity
                      key={emoji}
                      style={styles.emojiButton}
                      onPress={() => handleEmojiSelect(emoji)}
                    >
                      <Text style={styles.emoji}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            {Object.entries(filteredCategories).map(([category, emojis]) => (
              <View key={category} style={styles.category}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <View style={styles.emojiGrid}>
                  {emojis.map((emoji) => (
                    <TouchableOpacity
                      key={emoji}
                      style={styles.emojiButton}
                      onPress={() => handleEmojiSelect(emoji)}
                    >
                      <Text style={styles.emoji}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </MotiView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  category: {
    padding: 16,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 12,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  emoji: {
    fontSize: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    padding: 8,
  },
});
