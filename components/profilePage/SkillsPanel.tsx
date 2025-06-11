import { BookOpen, ChevronRight, GraduationCap, PlusCircle, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Types
interface Skill {
  id: string;
  name: string;
  type: 'teaching' | 'learning';
  serviceId: string;
  level?: number;
  description?: string;
}

interface SkillsPanelProps {
  userId: string;
  isCurrentUser: boolean;
}

const SkillsPanel: React.FC<SkillsPanelProps> = ({ userId, isCurrentUser }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'teaching' | 'learning'>('teaching');

  useEffect(() => {
    fetchSkills();
  }, [userId]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      // In a real app, fetch from API
      // const response = await fetch(`/api/users/${userId}/skills`);
      // const data = await response.json();
      
      // Using mock data
      const mockSkills = await mockFetchSkills(userId);
      setSkills(mockSkills);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const renderSkillItem = (skill: Skill, showType: boolean = false) => (
    <TouchableOpacity 
      key={skill.id}
      style={styles.skillItem}
      onPress={() => {
        // Navigate to service details
        console.log(`Navigate to service ${skill.serviceId}`);
      }}
    >
      <View style={styles.skillIconContainer}>
        {skill.type === 'teaching' ? (
          <GraduationCap size={20} color="#4F46E5" />
        ) : (
          <BookOpen size={20} color="#10B981" />
        )}
      </View>
      
      <View style={styles.skillInfo}>
        <Text style={styles.skillName}>{skill.name}</Text>
        {showType && (
          <Text style={[
            styles.skillType,
            skill.type === 'teaching' ? styles.teachingText : styles.learningText
          ]}>
            {skill.type === 'teaching' ? 'Teaching' : 'Learning'}
          </Text>
        )}
        {skill.description && (
          <Text style={styles.skillDescription} numberOfLines={2}>
            {skill.description}
          </Text>
        )}
      </View>
      
      <ChevronRight size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );

  // Group skills by type
  const teachingSkills = skills.filter(skill => skill.type === 'teaching');
  const learningSkills = skills.filter(skill => skill.type === 'learning');

  // For the compact view in profile
  const visibleTeachingSkills = teachingSkills.slice(0, 2);
  const visibleLearningSkills = learningSkills.slice(0, 2);
  const hasMoreTeaching = teachingSkills.length > visibleTeachingSkills.length;
  const hasMoreLearning = learningSkills.length > visibleLearningSkills.length;
  const hasAnySkills = skills.length > 0;

  if (loading && !hasAnySkills) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading skills...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.headerIconContainer}>
            <GraduationCap size={16} color="#4F46E5" />
          </View>
          <Text style={styles.sectionTitle}>Teaching</Text>
        </View>
        
        {visibleTeachingSkills.length > 0 ? (
          visibleTeachingSkills.map(skill => renderSkillItem(skill))
        ) : (
          <Text style={styles.emptyText}>No teaching skills yet</Text>
        )}
        
        {hasMoreTeaching && (
          <TouchableOpacity 
            style={styles.viewMoreButton}
            onPress={() => {
              setActiveTab('teaching');
              setModalVisible(true);
            }}
          >
            <Text style={styles.viewMoreText}>View more ({teachingSkills.length})</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={[styles.headerIconContainer, styles.learningIconContainer]}>
            <BookOpen size={16} color="#10B981" />
          </View>
          <Text style={styles.sectionTitle}>Learning</Text>
        </View>
        
        {visibleLearningSkills.length > 0 ? (
          visibleLearningSkills.map(skill => renderSkillItem(skill))
        ) : (
          <Text style={styles.emptyText}>No learning skills yet</Text>
        )}
        
        {hasMoreLearning && (
          <TouchableOpacity 
            style={styles.viewMoreButton}
            onPress={() => {
              setActiveTab('learning');
              setModalVisible(true);
            }}
          >
            <Text style={styles.viewMoreText}>View more ({learningSkills.length})</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {isCurrentUser && (
        <TouchableOpacity 
          style={styles.addServiceButton}
          onPress={() => {
            // Navigate to add service screen
            console.log('Navigate to add service');
          }}
        >
          <PlusCircle size={18} color="#4F46E5" style={styles.addIcon} />
          <Text style={styles.addServiceText}>Add new service</Text>
        </TouchableOpacity>
      )}
      
      {/* Full Skills Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Skills & Services</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[
                  styles.tab,
                  activeTab === 'teaching' ? styles.activeTab : {}
                ]}
                onPress={() => setActiveTab('teaching')}
              >
                <View style={styles.tabIconContainer}>
                  <GraduationCap 
                    size={16} 
                    color={activeTab === 'teaching' ? '#4F46E5' : '#6B7280'} 
                  />
                </View>
                <Text style={[
                  styles.tabText,
                  activeTab === 'teaching' ? styles.activeTabText : {}
                ]}>
                  Teaching
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.tab,
                  activeTab === 'learning' ? styles.activeTab : {}
                ]}
                onPress={() => setActiveTab('learning')}
              >
                <View style={styles.tabIconContainer}>
                  <BookOpen 
                    size={16} 
                    color={activeTab === 'learning' ? '#10B981' : '#6B7280'} 
                  />
                </View>
                <Text style={[
                  styles.tabText,
                  activeTab === 'learning' ? styles.activeTabText : {}
                ]}>
                  Learning
                </Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={activeTab === 'teaching' ? teachingSkills : learningSkills}
              renderItem={({ item }) => renderSkillItem(item, true)}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.modalList}
              ListEmptyComponent={
                <View style={styles.emptyListContainer}>
                  <Text style={styles.emptyListText}>
                    {activeTab === 'teaching' 
                      ? 'No teaching skills yet' 
                      : 'No learning skills yet'
                    }
                  </Text>
                  {isCurrentUser && (
                    <TouchableOpacity 
                      style={styles.emptyAddButton}
                      onPress={() => {
                        setModalVisible(false);
                        // Navigate to add service screen
                        console.log('Navigate to add service');
                      }}
                    >
                      <Text style={styles.emptyAddButtonText}>Add new service</Text>
                    </TouchableOpacity>
                  )}
                </View>
              }
            />
            
            {isCurrentUser && (
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.addServiceButtonModal}
                  onPress={() => {
                    setModalVisible(false);
                    // Navigate to add service screen
                    console.log('Navigate to add service');
                  }}
                >
                  <Text style={styles.addServiceButtonText}>Add new service</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Mock data function
const mockFetchSkills = async (userId: string): Promise<Skill[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    {
      id: 'skill1',
      name: 'JavaScript Programming',
      type: 'teaching',
      serviceId: 'service1',
      level: 5,
      description: 'Advanced JavaScript programming with expertise in React and Node.js'
    },
    {
      id: 'skill2',
      name: 'UX Design',
      type: 'teaching',
      serviceId: 'service2',
      level: 4,
      description: 'User experience design with focus on mobile applications'
    },
    {
      id: 'skill3',
      name: 'Data Science',
      type: 'teaching',
      serviceId: 'service3',
      level: 3,
      description: 'Data analysis and visualization using Python and R'
    },
    {
      id: 'skill4',
      name: 'Spanish Language',
      type: 'learning',
      serviceId: 'service4',
      level: 2,
      description: 'Learning conversational Spanish'
    },
    {
      id: 'skill5',
      name: 'Digital Photography',
      type: 'learning',
      serviceId: 'service5',
      level: 1,
      description: 'Learning photography basics and post-processing techniques'
    }
  ];
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#6B7280',
  },
  sectionContainer: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  learningIconContainer: {
    backgroundColor: '#ECFDF5',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  skillIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  skillType: {
    fontSize: 13,
    marginBottom: 2,
  },
  teachingText: {
    color: '#4F46E5',
  },
  learningText: {
    color: '#10B981',
  },
  skillDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  viewMoreButton: {
    paddingVertical: 8,
    marginTop: 4,
  },
  viewMoreText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
    marginHorizontal: 16,
  },
  addServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 4,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  addIcon: {
    marginRight: 8,
  },
  addServiceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4F46E5',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabIconContainer: {
    marginRight: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#4F46E5',
  },
  modalList: {
    padding: 16,
  },
  emptyListContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  emptyAddButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#4F46E5',
    borderRadius: 20,
  },
  emptyAddButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  addServiceButtonModal: {
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addServiceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SkillsPanel;