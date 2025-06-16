// components/profilePage/FriendOptionsModal.tsx
import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableWithoutFeedback 
} from 'react-native';
import { 
  UserMinus, 
  UserX, 
  MessageCircle, 
  AlertCircle,
  Share2 
} from 'lucide-react-native';

interface FriendOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onUnfriend: () => void;
  onBlock: () => void;
  onMessage: () => void;
  onReport: () => void;
  friendName: string;
}

export default function FriendOptionsModal({
  visible,
  onClose,
  onUnfriend,
  onBlock,
  onMessage,
  onReport,
  friendName,
}: FriendOptionsModalProps) {
  const handleOptionPress = (action: () => void) => {
    onClose();
    action();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Options for {friendName}
              </Text>

              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOptionPress(onMessage)}
              >
                <MessageCircle size={20} color="#3B82F6" />
                <Text style={styles.optionText}>Send Message</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOptionPress(onUnfriend)}
              >
                <UserMinus size={20} color="#EF4444" />
                <Text style={[styles.optionText, styles.dangerText]}>
                  Remove Friend
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOptionPress(onBlock)}
              >
                <UserX size={20} color="#EF4444" />
                <Text style={[styles.optionText, styles.dangerText]}>
                  Block User
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOptionPress(onReport)}
              >
                <AlertCircle size={20} color="#F59E0B" />
                <Text style={[styles.optionText, styles.warningText]}>
                  Report User
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: '#F9FAFB',
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  dangerText: {
    color: '#EF4444',
  },
  warningText: {
    color: '#F59E0B',
  },
});

