// components/profilePage/GroupManagementModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { 
  UserCircle, 
  Gamepad2, 
  BookOpen, 
  BriefCase, 
  Coffee,
  X,
  Plus,
  Check
} from 'lucide-react-native';
import { MotiView } from 'moti';

interface GroupManagementModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (groupData: GroupData) => Promise<void>;
  initialData?: GroupData;
  availableFriends: Array<{
    id: string;
    username: string;
    image: string;
  }>;
}

interface GroupData {
  name: string;
  icon: 'social' | 'gaming' | 'study' | 'work' | 'casual';
  members: string[]; // Array of user IDs
}

const GROUP_ICONS = {
  social: { icon: UserCircle, label: 'Social' },
  gaming: { icon: Gamepad2, label: 'Gaming' },
  study: { icon: BookOpen, label: 'Study' },
  work: { icon: BriefCase, label: 'Work' },
  casual: { icon: Coffee, label: 'Casual' },
};

export default function GroupManagementModal({
  visible,
  onClose,
  onSave,
  initialData,
  availableFriends,
}: GroupManagementModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<keyof typeof GROUP_ICONS>('social');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setIcon(initialData.icon);
      setSelectedMembers(initialData.members);
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    if (selectedMembers.length === 0) {
      Alert.alert('Error', 'Please select at least one member');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        icon,
        members: selectedMembers,
      });
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save group');
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers(current =>
      current.includes(memberId)
        ? current.filter(id => id !== memberId)
        : [...current, memberId]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.container}
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {initialData ? 'Edit Group' : 'Create New Group'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <TextInput
              style={styles.input}
              placeholder="Group Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.sectionTitle}>Group Type</Text>
            <View style={styles.iconGrid}>
              {Object.entries(GROUP_ICONS).map(([key, { icon: Icon, label }]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.iconOption,
                    icon === key && styles.selectedIcon,
                  ]}
                  onPress={() => setIcon(key as keyof typeof GROUP_ICONS)}
                >
                  <Icon
                    size={24}
                    color={icon === key ? '#3B82F6' : '#6B7280'}
                  />
                  <Text
                    style={[
                      styles.iconLabel,
                      icon === key && styles.selectedLabel,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Members</Text>
            <View style={styles.membersList}>
              {availableFriends.map(friend => (
                <TouchableOpacity
                  key={friend.id}
                  style={[
                    styles.memberItem,
                    selectedMembers.includes(friend.id) && styles.selectedMember,
                  ]}
                  onPress={() => toggleMember(friend.id)}
                >
                  <Text style={styles.memberName}>{friend.username}</Text>
                  {selectedMembers.includes(friend.id) && (
                    <Check size={16} color="#10B981" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveButtonText}>
                {initialData ? 'Save Changes' : 'Create Group'}
              </Text>
            )}
          </TouchableOpacity>
        </MotiView>
      </View>
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
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  iconOption: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedIcon: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  iconLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
  },
  selectedLabel: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  membersList: {
    gap: 8,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  selectedMember: {
    backgroundColor: '#F0FDF4',
  },
  memberName: {
    fontSize: 14,
    color: '#374151',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#93C5FD',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

