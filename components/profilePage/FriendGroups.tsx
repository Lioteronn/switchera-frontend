// components/profilePage/FriendGroups.tsx
import {
  BookOpen,
  Briefcase,
  Coffee,
  Gamepad2,
  Plus,
  Settings,
  UserCircle,
  Users
} from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface FriendGroup {
  id: string;
  name: string;
  icon: 'social' | 'gaming' | 'study' | 'work' | 'casual';
  memberCount: number;
  members: {
    id: string;
    username: string;
    image: string;
    online: boolean;
  }[];
}

interface FriendGroupsProps {
  groups: FriendGroup[];
  onCreateGroup?: () => void;
  onEditGroup?: (groupId: string) => void;
  onViewGroup?: (groupId: string) => void;
}

const GROUP_ICONS = {
  social: UserCircle,
  gaming: Gamepad2,
  study: BookOpen,
  work: Briefcase,
  casual: Coffee,
};

export default function FriendGroups({
  groups,
  onCreateGroup,
  onEditGroup,
  onViewGroup,
}: FriendGroupsProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const handleGroupPress = (groupId: string) => {
    if (expandedGroup === groupId) {
      setExpandedGroup(null);
    } else {
      setExpandedGroup(groupId);
    }
  };

  const renderGroupIcon = (type: keyof typeof GROUP_ICONS) => {
    const Icon = GROUP_ICONS[type];
    return <Icon size={20} color="#3B82F6" />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Users size={20} color="#3B82F6" />
          <Text style={styles.title}>Friend Groups</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={onCreateGroup}
        >
          <Plus size={16} color="#3B82F6" />
          <Text style={styles.addButtonText}>New Group</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {groups.map((group, index) => (
          <MotiView
            key={group.id}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: 'timing',
              duration: 300,
              delay: index * 100,
            }}
          >
            <TouchableOpacity
              style={[
                styles.groupCard,
                expandedGroup === group.id && styles.expandedCard
              ]}
              onPress={() => handleGroupPress(group.id)}
            >
              <View style={styles.groupHeader}>
                <View style={styles.groupInfo}>
                  {renderGroupIcon(group.icon)}
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.memberCount}>
                    {group.memberCount} members
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={() => onEditGroup?.(group.id)}
                >
                  <Settings size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {expandedGroup === group.id && (
                <MotiView
                  from={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ type: 'timing', duration: 300 }}
                  style={styles.membersContainer}
                >
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.membersList}
                  >
                    {group.members.map((member) => (
                      <View key={member.id} style={styles.memberItem}>
                        <View style={styles.memberImageContainer}>
                          <Image
                            source={
                              member.image
                                ? { uri: member.image }
                                : require('@/assets/images/default-avatar.png')
                            }
                            style={styles.memberImage}
                          />
                          {member.online && (
                            <View style={styles.onlineIndicator} />
                          )}
                        </View>
                        <Text style={styles.memberName} numberOfLines={1}>
                          {member.username}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </MotiView>
              )}
            </TouchableOpacity>
          </MotiView>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  groupCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  expandedCard: {
    backgroundColor: '#F3F4F6',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  memberCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  settingsButton: {
    padding: 8,
  },
  membersContainer: {
    marginTop: 16,
    overflow: 'hidden',
  },
  membersList: {
    gap: 12,
  },
  memberItem: {
    alignItems: 'center',
    width: 64,
  },
  memberImageContainer: {
    position: 'relative',
  },
  memberImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: 'white',
  },
  memberName: {
    fontSize: 12,
    color: '#374151',
    marginTop: 4,
    textAlign: 'center',
  },
});

